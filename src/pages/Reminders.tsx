import { useState } from "react";
import { ReminderHeader } from "@/components/reminders/ReminderHeader";
import { ReminderTable } from "@/components/reminders/ReminderTable";
import { ReminderDialog } from "@/components/reminders/ReminderDialog";
import { DeleteReminderDialog } from "@/components/reminders/DeleteReminderDialog";
import { useReminders } from "@/hooks/useReminders";

export default function Reminders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [reminderToDelete, setReminderToDelete] = useState<any>(null);

  const { reminders, isLoading, error, deleteReminder, togglePaid } = useReminders();

  const filteredReminders = reminders?.filter((reminder) => {
    const matchesSearch = reminder.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaidFilter = showPaidOnly ? reminder.is_paid : true;
    return matchesSearch && matchesPaidFilter;
  });

  const handleEdit = (reminder: any) => {
    setSelectedReminder(reminder);
    setDialogOpen(true);
  };

  const handleDelete = (reminder: any) => {
    setReminderToDelete(reminder);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reminderToDelete) {
      await deleteReminder(reminderToDelete.id);
      setDeleteDialogOpen(false);
      setReminderToDelete(null);
    }
  };

  const handleTogglePaid = (reminderId: string, isPaid: boolean) => {
    togglePaid({ reminderId, isPaid });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ReminderHeader
        onAddNew={() => {
          setSelectedReminder(null);
          setDialogOpen(true);
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showPaidOnly={showPaidOnly}
        onShowPaidChange={setShowPaidOnly}
      />

      <ReminderTable
        reminders={filteredReminders || []}
        isLoading={isLoading}
        error={error as Error}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePaid={handleTogglePaid}
      />

      <ReminderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reminder={selectedReminder}
      />

      <DeleteReminderDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isRecurring={reminderToDelete?.recurrence_frequency !== 'none'}
        isRecurringInstance={reminderToDelete?.is_recurring_instance}
      />
    </div>
  );
}