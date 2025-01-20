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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bill Reminder</DialogTitle>
        </DialogHeader>

        <ReminderForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}