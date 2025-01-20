import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ReminderForm } from "./forms/ReminderForm";

type NotificationType = "whatsapp" | "email" | "in_app";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder?: {
    id: string;
    name: string;
    amount: number;
    due_date: string;
    reminder_days_before: number[];
    notification_types: NotificationType[];
    recurrence_frequency: 'none' | 'monthly' | 'yearly';
  };
}

export function ReminderDialog({ 
  open, 
  onOpenChange, 
  reminder 
}: ReminderDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = reminder ? {
    name: reminder.name,
    amount: reminder.amount,
    due_day: new Date(reminder.due_date).getDate(),
    reminder_days_before: reminder.reminder_days_before,
    notification_types: reminder.notification_types,
    recurrence_frequency: reminder.recurrence_frequency,
  } : {};

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
        reminder_days_before: [7], // Default to 7 days
        notification_types: ['email'] as NotificationType[], // Default to email
        recurrence_frequency: data.recurrence_frequency,
        user_id: user.id,
      };

      if (reminder) {
        const { error } = await supabase
          .from("bill_reminders")
          .update({
            ...reminderData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", reminder.id);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Bill reminder updated successfully" 
        });
      } else {
        const { error } = await supabase
          .from("bill_reminders")
          .insert(reminderData);

        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "New bill reminder created successfully" 
        });
      }

      queryClient.invalidateQueries({ queryKey: ["bill-reminders"] });
      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reminder ? "Edit Bill Reminder" : "Add Bill Reminder"}</DialogTitle>
        </DialogHeader>

        <ReminderForm
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}