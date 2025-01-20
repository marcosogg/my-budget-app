import { TableCell, TableRow } from "@/components/ui/table";

export function ReminderTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
        No reminders found
      </TableCell>
    </TableRow>
  );
}