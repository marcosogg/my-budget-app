import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";

interface Mapping {
  id: string;
  description: string;
  category_id: string;
  category_name: string;
  transaction_count: number;
  last_used: string | null;
}

interface MappingTableProps {
  mappings: Mapping[];
  onEdit: (mapping: Mapping) => void;
  onDelete: (mappingId: string) => void;
}

export function MappingTable({ mappings, onEdit, onDelete }: MappingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Transactions</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mappings?.map((mapping) => (
          <TableRow key={mapping.id}>
            <TableCell className="font-medium">{mapping.description}</TableCell>
            <TableCell>{mapping.category_name}</TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat('de-DE').format(mapping.transaction_count)}
            </TableCell>
            <TableCell>
              {mapping.last_used 
                ? formatEuroDate(mapping.last_used)
                : 'Never'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(mapping)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(mapping.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}