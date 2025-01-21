import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableHeader } from "./table/TableHeader";
import { LoadingState } from "./table/LoadingState";

interface Mapping {
  id: string;
  description: string;
  category_name: string;
  transaction_count: number;
}

interface MappingTableProps {
  mappings: Mapping[];
  isLoading?: boolean;
  error?: Error | null;
}

export function MappingTable({ 
  mappings, 
  isLoading, 
  error
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
        <TableHeader />
        <LoadingState />
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader />
      <TableBody>
        {mappings?.map((mapping) => (
          <TableRow key={mapping.id}>
            <TableCell className="font-medium">
              {mapping.description}
            </TableCell>
            <TableCell>
              {mapping.category_name}
            </TableCell>
          </TableRow>
        ))}
        {mappings.length === 0 && (
          <TableRow>
            <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
              No mappings found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}