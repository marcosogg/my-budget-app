import { CreateReminderDialog } from "./dialogs/CreateReminderDialog";
import { EditReminderDialog } from "./dialogs/EditReminderDialog";

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

export function ReminderDialog({ open, onOpenChange, reminder }: ReminderDialogProps) {
  if (reminder) {
    return (
      <EditReminderDialog
        open={open}
        onOpenChange={onOpenChange}
        reminder={reminder}
      />
    );
  }

  return (
    <CreateReminderDialog
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}