import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseCreateReminderOptions {
  onSuccess?: () => void;
}

export function useCreateReminder({ onSuccess }: UseCreateReminderOptions) {
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
        reminder_days_before: [7],
        notification_types: ['email'],
        recurrence_frequency: data.recurrence_frequency,
        user_id: user.id,
      };

      const { error } = await supabase
        .from("bill_reminders")
        .insert(reminderData);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "New bill reminder created successfully" 
      });

      queryClient.invalidateQueries({ queryKey: ["bill-reminders"] });
      onSuccess?.();
    } catch (error) {
      console.error('Error saving bill reminder:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the bill reminder",
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