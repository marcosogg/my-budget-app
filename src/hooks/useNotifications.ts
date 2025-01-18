import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: notifications = [], refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminder_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notifications",
        });
        throw error;
      }

      return data as Notification[];
    },
  });

  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminder_notifications'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read_at).length);
  }, [notifications]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('reminder_notifications')
      .update({ read_at: new Date().toISOString(), status: 'read' })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read",
      });
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('reminder_notifications')
      .update({ 
        read_at: new Date().toISOString(),
        status: 'read'
      })
      .is('read_at', null);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read",
      });
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}