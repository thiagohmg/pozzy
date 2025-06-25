
import { supabase } from "@/integrations/supabase/client";

export const useWishlist = () => {
  const addToWishlist = async ({
    userId,
    productId,
    favoriteType,
  }: {
    userId: string;
    productId: string;
    favoriteType: "gostei" | "quero_comprar";
  }) => {
    const { error } = await supabase.from("wishlist").insert([
      {
        user_id: userId,
        product_id: productId,
        favorite_type: favoriteType,
      },
    ]);
    if (error) console.error('[addToWishlist] erro:', error);
    return !error;
  };

  const removeFromWishlist = async (userId: string, productId: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .match({ user_id: userId, product_id: productId });
    if (error) console.error('[removeFromWishlist] erro:', error);
    return !error;
  };

  const getWishlist = async (userId: string) => {
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });
    if (error) {
      console.error("[getWishlist] erro:", error);
      return [];
    }
    return data;
  };

  return { addToWishlist, removeFromWishlist, getWishlist };
};
