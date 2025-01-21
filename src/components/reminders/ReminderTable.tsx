import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface BillReminder {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  recurrence_frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
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
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Recurrence</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Recurrence</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reminders?.map((reminder) => (
          <TableRow key={reminder.id}>
            <TableCell className="font-medium">{reminder.name}</TableCell>
            <TableCell>
              {new Intl.NumberFormat('de-DE', { 
                style: 'currency', 
                currency: 'EUR' 
              }).format(reminder.amount)}
            </TableCell>
            <TableCell>{formatDate(reminder.due_date)}</TableCell>
            <TableCell className="capitalize">{reminder.recurrence_frequency}</TableCell>
            <TableCell>
              <Button
                variant={reminder.is_paid ? "default" : "outline"}
                size="sm"
                onClick={() => onTogglePaid(reminder.id, !reminder.is_paid)}
              >
                {reminder.is_paid ? "Paid" : "Unpaid"}
              </Button>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(reminder)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(reminder)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {reminders.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No reminders found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
