import { TableHead, TableHeader as ShadcnTableHeader, TableRow } from "@/components/ui/table";

export function TableHeader() {
  return (
    <ShadcnTableHeader>
      <TableRow>
        <TableHead>Description</TableHead>
        <TableHead>Category</TableHead>
        <TableHead className="text-right">Transactions</TableHead>
        <TableHead>Last Used</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </ShadcnTableHeader>
  );
}