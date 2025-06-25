
import { supabase } from "@/integrations/supabase/client";

export const useUserSearches = () => {
  const saveSearch = async ({
    userId,
    searchQuery,
    searchFilters,
    searchMode,
  }: {
    userId: string;
    searchQuery: string;
    searchFilters: any;
    searchMode: "text" | "filters" | "occasions" | "image";
  }) => {
    const { error } = await supabase.from("user_searches").insert([
      {
        user_id: userId,
        search_query: searchQuery,
        search_filters: searchFilters,
        search_mode: searchMode,
      },
    ]);
    if (error) console.error('[saveSearch] erro:', error);
    return !error;
  };

  const getSearches = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_searches")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[getSearches] erro:", error);
      return [];
    }
    return data;
  };

  return { saveSearch, getSearches };
};
