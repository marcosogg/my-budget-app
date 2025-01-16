import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface Mapping {
  id: string;
  description: string;
  category_id: string;
  category_name: string;
  transaction_count: number;
  last_used_date: string | null;
}

interface MappingTableProps {
  mappings: Mapping[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit: (mapping: Mapping) => void;
  onDelete: (mappingId: string) => void;
}

export function MappingTable({ 
  mappings, 
  isLoading, 
  error,
  onEdit, 
  onDelete 
}: MappingTableProps) {
  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading mappings: {error.message}
      </div>
    );
  }

  if (isLoading) {
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
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
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
              {mapping.last_used_date 
                ? formatEuroDate(mapping.last_used_date)
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
        {mappings.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No mappings found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}