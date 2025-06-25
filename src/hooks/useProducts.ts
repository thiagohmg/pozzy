
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Novo: Product baseado no tipo correto do Supabase
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  brand?: string | null;
  image_url?: string | null;
  url?: string | null;
  category?: string | null;
  color?: string | null;
  in_stock?: boolean | null;
  data?: any;
  created_at?: string | null;
}

export function useProducts({ query, category }: { query?: string; category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let supaQuery = supabase.from("products").select("*").limit(60);
      if (query) {
        supaQuery = supaQuery.ilike("name", `%${query}%`);
      }
      if (category) {
        supaQuery = supaQuery.eq("category", category);
      }
      const { data, error } = await supaQuery;
      if (error) {
        setProducts([]);
      } else {
        setProducts((data ?? []) as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [query, category]);

  return { products, loading };
}
