import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useReminders() {
  const queryClient = useQueryClient();

  const { data: reminders, isLoading, error } = useQuery({
    queryKey: ["bill-reminders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bill_reminders")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (reminderId: string) => {
      if (!reminderId) {
        throw new Error("Reminder ID is required");
      }

      const { error } = await supabase
        .from("bill_reminders")
        .delete()
        .eq("id", reminderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-reminders"] });
      toast.success("Reminder deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    },
  });

  const togglePaid = useMutation({
    mutationFn: async ({ reminderId, isPaid }: { reminderId: string; isPaid: boolean }) => {
      const { error } = await supabase
        .from("bill_reminders")
        .update({ is_paid: isPaid })
        .eq("id", reminderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bill-reminders"] });
      toast.success("Reminder updated successfully");
    },
    onError: (error) => {
      console.error("Error updating reminder:", error);
      toast.error("Failed to update reminder");
    },
  });

  return {
    reminders,
    isLoading,
    error,
    deleteReminder: deleteReminder.mutate,
    togglePaid: togglePaid.mutate,
  };
}