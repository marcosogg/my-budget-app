import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReminderForm } from "../forms/ReminderForm";
import { useUpdateReminder } from "../hooks/useUpdateReminder";

interface EditReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder: {
    id: string;
    name: string;
    amount: number;
    due_date: string;
    reminder_days_before: number[];
    notification_types: ("whatsapp" | "email" | "in_app")[];
    recurrence_frequency: 'none' | 'monthly' | 'yearly';
  };
}

export function EditReminderDialog({ 
  open, 
  onOpenChange, 
  reminder 
}: EditReminderDialogProps) {
  const { handleSubmit, isSubmitting } = useUpdateReminder({
    reminderId: reminder.id,
    onSuccess: () => onOpenChange(false),
  });

  const defaultValues = {
    name: reminder.name,
    amount: reminder.amount,
    due_day: new Date(reminder.due_date).getDate(),
    reminder_days_before: reminder.reminder_days_before,
    notification_types: reminder.notification_types,
    recurrence_frequency: reminder.recurrence_frequency,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bill Reminder</DialogTitle>
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