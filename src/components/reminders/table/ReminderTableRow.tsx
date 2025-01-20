import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";

interface BillReminder {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  recurrence_frequency: 'none' | 'monthly';
}

interface ReminderTableRowProps {
  reminder: BillReminder;
  onEdit: (reminder: BillReminder) => void;
  onDelete: (reminder: BillReminder) => void;
  onTogglePaid: (reminderId: string, isPaid: boolean) => void;
}

export function ReminderTableRow({
  reminder,
  onEdit,
  onDelete,
  onTogglePaid,
}: ReminderTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{reminder.name}</TableCell>
      <TableCell>
        {new Intl.NumberFormat('de-DE', { 
          style: 'currency', 
          currency: 'EUR' 
        }).format(reminder.amount)}
      </TableCell>
      <TableCell>{formatEuroDate(reminder.due_date)}</TableCell>
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
  );
}