import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReminderTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Due Date</TableHead>
        <TableHead>Next Due Date</TableHead>
        <TableHead>Recurrence</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}