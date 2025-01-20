import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isRecurring?: boolean;
  isRecurringInstance?: boolean;
}

export function DeleteReminderDialog({
  open,
  onOpenChange,
  onConfirm,
  isRecurring,
  isRecurringInstance,
}: DeleteReminderDialogProps) {
  const getDialogContent = () => {
    if (isRecurring && !isRecurringInstance) {
      return {
        title: "Delete Recurring Bill Reminder",
        description: "This will delete this bill reminder and all future recurring instances. This action cannot be undone.",
      };
    } else if (isRecurringInstance) {
      return {
        title: "Delete Reminder Instance",
        description: "This will delete only this instance of the recurring bill. This action cannot be undone.",
      };
    }
    return {
      title: "Delete Bill Reminder",
      description: "Are you sure you want to delete this reminder? This action cannot be undone.",
    };
  };

  const { title, description } = getDialogContent();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}