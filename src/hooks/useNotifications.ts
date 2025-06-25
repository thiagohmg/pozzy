
import { supabase } from "@/integrations/supabase/client";

export type NotificationType = "price_drop" | "back_in_stock" | "new_deal";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  product_id?: string | null;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  // Busca notificações mais recentes do usuário
  const getNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[getNotifications] erro:", error);
      return [];
    }
    return (data ?? []) as Notification[];
  };

  // Marca uma notificação como lida
  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);
    if (error) {
      console.error("[markAsRead] erro:", error);
      return false;
    }
    return true;
  };

  // Remove uma notificação (deleta do banco)
  const removeNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);
    if (error) {
      console.error("[removeNotification] erro:", error);
      return false;
    }
    return true;
  };

  // Cria uma notificação nova
  const addNotification = async ({
    userId,
    type,
    title,
    message,
    productId
  }: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    productId?: string;
  }) => {
    const { error } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: userId,
          type,
          title,
          message,
          product_id: productId,
        }
      ]);
    if (error) {
      console.error("[addNotification] erro:", error);
      return false;
    }
    return true;
  };

  return {
    getNotifications,
    markAsRead,
    removeNotification,
    addNotification,
  };
}
