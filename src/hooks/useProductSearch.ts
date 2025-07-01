import { useState, useEffect, useCallback } from 'react';
import { productManager, ProductData } from '@/integrations/productSources';
import { supabase } from '@/integrations/supabase/client';

interface UseProductSearchOptions {
  query?: string;
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  colors?: string[];
  sizes?: string[];
  inStock?: boolean;
  limit?: number;
}

interface UseProductSearchReturn {
  products: ProductData[];
  loading: boolean;
  error: string | null;
  search: (query: string, options?: UseProductSearchOptions) => Promise<void>;
  searchByCategory: (category: string) => Promise<void>;
  searchByBrand: (brand: string) => Promise<void>;
  clearResults: () => void;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useProductSearch(): UseProductSearchReturn {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastOptions, setLastOptions] = useState<UseProductSearchOptions>({});

  const ITEMS_PER_PAGE = 20;

  // Buscar produtos de múltiplas fontes
  const search = useCallback(async (query: string, options: UseProductSearchOptions = {}) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(0);

    try {
      // Primeiro, buscar no banco local
      let localProducts = await searchLocalDatabase(query, options);
      
      // Se não encontrou produtos suficientes, buscar nas APIs externas
      if (localProducts.length < 10) {
        console.log('Poucos produtos locais, buscando em APIs externas...');
        const externalProducts = await productManager.searchProducts(query, options);
        
        // Combinar e remover duplicatas
        const allProducts = [...localProducts, ...externalProducts];
        const uniqueProducts = removeDuplicates(allProducts);
        
        // Salvar produtos externos no banco local
        if (externalProducts.length > 0) {
          await productManager.saveProducts(externalProducts);
        }
        
        localProducts = uniqueProducts;
      }

      setProducts(localProducts.slice(0, ITEMS_PER_PAGE));
      setHasMore(localProducts.length > ITEMS_PER_PAGE);
      setLastQuery(query);
      setLastOptions(options);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar por categoria
  const searchByCategory = useCallback(async (category: string) => {
    await search(`categoria:${category}`, { category });
  }, [search]);

  // Buscar por marca
  const searchByBrand = useCallback(async (brand: string) => {
    await search(`marca:${brand}`, { brand });
  }, [search]);

  // Limpar resultados
  const clearResults = useCallback(() => {
    setProducts([]);
    setError(null);
    setCurrentPage(0);
    setHasMore(true);
  }, []);

  // Carregar mais produtos
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !lastQuery) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const offset = nextPage * ITEMS_PER_PAGE;
      
      // Buscar mais produtos do banco local
      const moreProducts = await searchLocalDatabase(lastQuery, lastOptions, offset, ITEMS_PER_PAGE);
      
      if (moreProducts.length > 0) {
        setProducts(prev => [...prev, ...moreProducts]);
        setCurrentPage(nextPage);
        setHasMore(moreProducts.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais produtos');
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastQuery, currentPage, lastOptions]);

  // Buscar no banco de dados local
  const searchLocalDatabase = async (
    query: string, 
    options: UseProductSearchOptions = {}, 
    offset = 0, 
    limit = ITEMS_PER_PAGE
  ): Promise<ProductData[]> => {
    let supabaseQuery = supabase
      .from('products')
      .select('*')
      .range(offset, offset + limit - 1);

    // Aplicar filtros
    if (options.category) {
      supabaseQuery = supabaseQuery.ilike('category', `%${options.category}%`);
    }
    
    if (options.brand) {
      supabaseQuery = supabaseQuery.ilike('brand', `%${options.brand}%`);
    }
    
    if (options.priceRange) {
      supabaseQuery = supabaseQuery
        .gte('price', options.priceRange[0])
        .lte('price', options.priceRange[1]);
    }
    
    if (options.inStock !== undefined) {
      supabaseQuery = supabaseQuery.eq('in_stock', options.inStock);
    }

    // Busca por texto
    if (query && !query.startsWith('categoria:') && !query.startsWith('marca:')) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
      );
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Erro ao buscar no banco local:', error);
      return [];
    }

    console.log('Dados retornados do Supabase:', data);

    return (data || []).map((item: any) => ({
      ...item,
      source: item.source || 'local',
      source_id: item.source_id || item.id
    })) as ProductData[];
  };

  // Remover produtos duplicados
  const removeDuplicates = (products: ProductData[]): ProductData[] => {
    const seen = new Set();
    return products.filter(product => {
      const key = `${product.source}_${product.source_id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  return {
    products,
    loading,
    error,
    search,
    searchByCategory,
    searchByBrand,
    clearResults,
    hasMore,
    loadMore
  };
} 