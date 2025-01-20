import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading reminders: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Table>
        <ReminderTableHeader />
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index} className="animate-pulse">
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

  if (!reminders?.length) {
    return (
      <Table>
        <ReminderTableHeader />
        <TableBody>
          <ReminderTableEmpty />
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <ReminderTableHeader />
      <TableBody>
        {reminders.map((reminder) => (
          <ReminderTableRow
            key={reminder.id}
            reminder={reminder}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePaid={onTogglePaid}
          />
        ))}
      </TableBody>
    </Table>
  );
}