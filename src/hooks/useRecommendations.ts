
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/Product';
import { useUserPreferences } from './useUserPreferences';
import { getRange } from "@/utils/paginate";

// Lógica robusta de recomendações, apenas melhorias internas (sem mexer no layout!).
export const useRecommendations = (userId?: string) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 4;
  const { fetchUserPreferences } = useUserPreferences();

  // Busca recomendações personalizadas
  const fetchPersonalizedRecommendations = useCallback(async (isInitial: boolean = false) => {
    if (!userId) return;
    setIsLoading(isInitial);

    try {
      const prefs = await fetchUserPreferences(userId);
      let query: any = supabase.from("products").select("*");

      if (prefs.categories.length > 0) {
        query = query.in("category", prefs.categories);
      }
      if (prefs.colors.length > 0) {
        query = query.in("color", prefs.colors);
      }

      const { from, to } = getRange(isInitial ? 1 : currentPage, itemsPerPage);

      const { data: products, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error('[useRecommendations] Erro no supabase:', error);
        setRecommendations([]);
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      let recs = (products || []) as Product[];

      // Prioriza favoritos no topo se existirem
      if (prefs.favoriteIds.length > 0) {
        const favoriteSet = new Set(prefs.favoriteIds);
        recs = [
          ...recs.filter((p) => favoriteSet.has(p.id)),
          ...recs.filter((p) => !favoriteSet.has(p.id)),
        ];
      }

      if (isInitial) {
        setRecommendations(recs);
        setCurrentPage(1);
      } else {
        setRecommendations((prev) => [...prev, ...recs]);
        setCurrentPage((prev) => prev + 1);
      }
      setTotalCount(recs.length);
      setHasMore(recs.length === itemsPerPage);
    } catch (err) {
      console.error('[useRecommendations] General error:', err);
      setRecommendations([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage, fetchUserPreferences, itemsPerPage]);

  // Para usuários anônimos
  const fetchGeneralRecommendations = useCallback(async (isInitial: boolean = false) => {
    setIsLoading(isInitial);

    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(itemsPerPage);

      if (error) {
        setRecommendations([]);
        setHasMore(false);
        return;
      }

      const recs = (products || []) as Product[];

      if (isInitial) {
        setRecommendations(recs);
        setCurrentPage(1);
      } else {
        setRecommendations((prev) => [...prev, ...recs]);
        setCurrentPage((prev) => prev + 1);
      }
      setTotalCount(recs.length);
      setHasMore(recs.length === itemsPerPage);
    } catch (err) {
      setRecommendations([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  // Carregar mais recomendações
  const loadMoreRecommendations = useCallback(async () => {
    if (!hasMore || isLoading) return;
    if (userId) {
      await fetchPersonalizedRecommendations(false);
    } else {
      await fetchGeneralRecommendations(false);
    }
  }, [userId, hasMore, isLoading, fetchPersonalizedRecommendations, fetchGeneralRecommendations]);

  // Reseta e busca dados ao mudar id usuário
  useEffect(() => {
    if (userId) {
      fetchPersonalizedRecommendations(true);
    } else {
      fetchGeneralRecommendations(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    recommendations,
    isLoading,
    loadMoreRecommendations,
    hasMore,
    totalCount,
  };
};
