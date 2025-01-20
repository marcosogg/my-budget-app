import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReminderForm } from "../forms/ReminderForm";
import { useCreateReminder } from "../hooks/useCreateReminder";

interface CreateReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateReminderDialog({ open, onOpenChange }: CreateReminderDialogProps) {
  const { handleSubmit, isSubmitting } = useCreateReminder({
    onSuccess: () => onOpenChange(false),
  });

  const defaultValues = {
    name: '',
    amount: 0,
    due_day: 1,
    reminder_days_before: [7],
    notification_types: ['email'] as ("whatsapp" | "email" | "in_app")[],
    recurrence_frequency: 'none' as const,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bill Reminder</DialogTitle>
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