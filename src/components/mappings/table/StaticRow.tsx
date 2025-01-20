import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";

interface StaticRowProps {
  mapping: {
    id: string;
    description: string;
    category_id: string;
    category_name: string;
    transaction_count: number;
    last_used_date: string | null;
  };
  isEditingAny: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function StaticRow({
  mapping,
  isEditingAny,
  onEdit,
  onDelete,
}: StaticRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {mapping.description}
      </TableCell>
      <TableCell>
        {mapping.category_name}
        {mapping.transaction_count > 0 && (
          <Badge variant="secondary" className="ml-2">Active</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        {new Intl.NumberFormat('de-DE').format(mapping.transaction_count)}
      </TableCell>
      <TableCell>
        {mapping.last_used_date 
          ? formatEuroDate(mapping.last_used_date)
          : 'Never'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            disabled={isEditingAny}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            disabled={isEditingAny}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}