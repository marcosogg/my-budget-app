import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";

export function TableHeader() {
  return (
    <ShadcnTableHeader>
      <TableRow>
        <TableHead>Description</TableHead>
        <TableHead>Category</TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
}