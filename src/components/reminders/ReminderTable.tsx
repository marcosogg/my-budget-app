import { Table, TableBody } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ReminderTableHeader } from "./table/ReminderTableHeader";
import { ReminderTableRow } from "./table/ReminderTableRow";
import { ReminderTableEmpty } from "./table/ReminderTableEmpty";

interface BillReminder {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  recurrence_frequency: 'none' | 'monthly';
}

interface ReminderTableProps {
  reminders: BillReminder[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit: (reminder: BillReminder) => void;
  onDelete: (reminder: BillReminder) => void;
  onTogglePaid: (reminderId: string, isPaid: boolean) => void;
}

export function ReminderTable({ 
  reminders, 
  isLoading, 
  error,
  onEdit, 
  onDelete,
  onTogglePaid 
}: ReminderTableProps) {
  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading reminders: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Table>
        <ReminderTableHeader />
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <ReminderTableHeader />
      <TableBody>
        {reminders?.map((reminder) => (
          <ReminderTableRow
            key={reminder.id}
            reminder={reminder}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePaid={onTogglePaid}
          />
        ))}
        {reminders.length === 0 && <ReminderTableEmpty />}
      </TableBody>
    </Table>
  );
}