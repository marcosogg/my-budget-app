import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseUpdateReminderOptions {
  reminderId: string;
  onSuccess?: () => void;
}

type NotificationType = "whatsapp" | "email" | "in_app";

export function useUpdateReminder({ reminderId, onSuccess }: UseUpdateReminderOptions) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const reminderData = {
        name: data.name,
        amount: data.amount,
        due_date: data.due_date.toISOString(),
        reminder_days_before: data.reminder_days_before,
        notification_types: data.notification_types as NotificationType[],
        recurrence_frequency: data.recurrence_frequency,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("bill_reminders")
        .update(reminderData)
        .eq("id", reminderId);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "Bill reminder updated successfully" 
      });

      queryClient.invalidateQueries({ queryKey: ["bill-reminders"] });
      onSuccess?.();
    } catch (error) {
      console.error('Error updating bill reminder:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the bill reminder",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}