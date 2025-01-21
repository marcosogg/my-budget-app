import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyState = () => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p>No transactions found</p>
          <p className="text-sm">Try adjusting your filters or upload new transactions</p>
        </div>
      </TableCell>
    </TableRow>
  );
};