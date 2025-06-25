
import { supabase } from "@/integrations/supabase/client";

export const useUserInteractions = () => {
  const saveInteraction = async ({
    userId,
    productId,
    interactionType,
    interactionData,
  }: {
    userId: string;
    productId: string;
    interactionType: "view" | "favorite" | "click" | "search_result";
    interactionData?: any;
  }) => {
    const { error } = await supabase.from("user_interactions").insert([
      {
        user_id: userId,
        product_id: productId,
        interaction_type: interactionType,
        interaction_data: interactionData ?? {},
      },
    ]);
    if (error) console.error('[saveInteraction] erro:', error);
    return !error;
  };

  // Adicional: obter interações (opcional)
  const getUserInteractions = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_interactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[getUserInteractions] erro:", error);
      return [];
    }
    return data;
  };

  return { saveInteraction, getUserInteractions };
};
