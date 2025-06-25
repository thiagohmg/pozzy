import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface NotificationCenterProps {
  userId?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();
  const { getNotifications, markAsRead, removeNotification } = useNotifications();
  const [loading, setLoading] = useState(false);

  // Estado para push notifications
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem('pozzy-push-enabled') === 'true';
  });

  // Real notifications load
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getNotifications(userId)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [userId, showNotifications]); // reload when panel opens

  // Persistir notificações no localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('pozzy-notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Restaurar notificações ao carregar
  useEffect(() => {
    const saved = localStorage.getItem('pozzy-notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleRemoveNotification = async (id: string) => {
    await removeNotification(id);
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const togglePush = () => {
    const newValue = !pushEnabled;
    setPushEnabled(newValue);
    localStorage.setItem('pozzy-push-enabled', newValue ? 'true' : 'false');
    toast({
      title: newValue ? 'Notificações push ativadas!' : 'Notificações push desativadas.',
      description: newValue ? 'Você receberá notificações mesmo fora do site (simulado).' : 'Você não receberá mais notificações push.',
    });
  };

  // Manter o sininho, abrir popover/modal com aviso
  return (
    <Popover>
      <PopoverTrigger asChild>
      <Button
        variant="ghost"
          size="icon"
          className="relative rounded-full"
      >
          <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4">
        <h4 className="font-medium text-center">Notificações</h4>
        <p className="text-sm text-center text-gray-500 mt-2">
          Ajuste ou configure as opções de notificação no menu do seu perfil.
                          </p>
      </PopoverContent>
    </Popover>
  );
};
