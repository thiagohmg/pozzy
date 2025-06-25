
import { supabase } from "@/integrations/supabase/client";

type UserPreferences = {
  categories: string[];
  colors: string[];
  favoriteIds: string[];
};

export const useUserPreferences = () => {
  // Busca preferências recentes do usuário.
  const fetchUserPreferences = async (userId?: string): Promise<UserPreferences> => {
    if (!userId) {
      return { categories: [], colors: [], favoriteIds: [] };
    }

    // Busca filtros usados nas últimas pesquisas.
    const { data: searches, error: errSearches } = await supabase
      .from("user_searches")
      .select("search_filters")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (errSearches) {
      console.error("[UserPreferences] Falha ao buscar user_searches:", errSearches);
      return { categories: [], colors: [], favoriteIds: [] };
    }

    // Interações recentes com produtos.
    const { data: interactions, error: errInteractions } = await supabase
      .from("user_interactions")
      .select("interaction_data, product_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (errInteractions) {
      console.error("[UserPreferences] Falha ao buscar user_interactions:", errInteractions);
      return { categories: [], colors: [], favoriteIds: [] };
    }

    // Wishlist do usuário.
    const { data: wishlist, error: errWishlist } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", userId);

    if (errWishlist) {
      console.error("[UserPreferences] Falha ao buscar wishlist:", errWishlist);
      return { categories: [], colors: [], favoriteIds: [] };
    }

    const categories: Record<string, number> = {};
    const colors: Record<string, number> = {};
    const favoriteIds: string[] = wishlist?.map((w: any) => String(w.product_id)) || [];

    (searches ?? []).forEach((s: any) => {
      const f = s?.search_filters || {};
      if (f.category) categories[f.category] = (categories[f.category] || 0) + 1;
      if (f.color) colors[f.color] = (colors[f.color] || 0) + 1;
    });

    (interactions ?? []).forEach((i: any) => {
      if (i?.interaction_data?.category) {
        const cat = i.interaction_data.category;
        categories[cat] = (categories[cat] || 0) + 2;
      }
      if (i?.interaction_data?.color) {
        const color = i.interaction_data.color;
        colors[color] = (colors[color] || 0) + 2;
      }
    });

    const preferredCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([cat]) => cat);

    const preferredColors = Object.entries(colors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([col]) => col);

    return {
      categories: preferredCategories,
      colors: preferredColors,
      favoriteIds,
    };
  };

  return { fetchUserPreferences };
};
