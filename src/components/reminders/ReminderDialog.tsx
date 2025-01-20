import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReminderForm, ReminderFormData } from "./forms/ReminderForm";
import { useCreateReminder } from "./hooks/useCreateReminder";
import { useUpdateReminder } from "./hooks/useUpdateReminder";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder?: {
    id: string;
    name: string;
    amount: number;
    due_date: string;
    reminder_days_before: number[];
    notification_types: ("whatsapp" | "email" | "in_app")[];
    recurrence_frequency: 'none' | 'monthly';
  };
}

export function ReminderDialog({ open, onOpenChange, reminder }: ReminderDialogProps) {
  const { handleSubmit: handleCreate, isSubmitting: isCreating } = useCreateReminder({
    onSuccess: () => onOpenChange(false),
  });

  const { handleSubmit: handleUpdate, isSubmitting: isUpdating } = useUpdateReminder({
    reminderId: reminder?.id ?? '',
    onSuccess: () => onOpenChange(false),
  });

  const defaultValues: ReminderFormData = reminder ? {
    name: reminder.name,
    amount: reminder.amount,
    due_day: new Date(reminder.due_date).getDate(),
    reminder_days_before: reminder.reminder_days_before,
    notification_types: reminder.notification_types,
    recurrence_frequency: reminder.recurrence_frequency,
  } : {
    name: '',
    amount: 0,
    due_day: new Date().getDate(),
    reminder_days_before: [7],
    notification_types: ['email'] as ("whatsapp" | "email" | "in_app")[],
    recurrence_frequency: 'none' as const,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reminder ? "Edit Reminder" : "Add Reminder"}</DialogTitle>
        </DialogHeader>

        <ReminderForm
          defaultValues={defaultValues}
          isSubmitting={isCreating || isUpdating}
          onSubmit={reminder ? handleUpdate : handleCreate}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}