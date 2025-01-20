import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from '@/types/categorization';
import { FilterBar } from './components/FilterBar';
import { TransactionRow } from './components/TransactionRow';
import { CategorizedTransactionWithDetails } from '@/services/categoryService';
import { SortOption } from './hooks/useTransactionSort';

interface CategorizedTransactionTableProps {
  transactions: CategorizedTransactionWithDetails[];
  categories: Category[];
  editingId: string | null;
  onEdit: (id: string | null) => void;
  onUpdateCategory: (transactionId: string, categoryId: string) => void;
  filters: {
    category: string;
    description: string;
    date: Date | undefined;
  };
  onFilterChange: (type: string, value: string | Date | undefined) => void;
  sortOption: SortOption;
  onSortChange: (value: SortOption) => void;
  isLoading: boolean;
}

const CategorizedTransactionTable = ({
  transactions,
  categories,
  editingId,
  onEdit,
  onUpdateCategory,
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
  isLoading,
}: CategorizedTransactionTableProps) => {
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">Updating...</div>;
  }

  return (
    <div className="space-y-4">
      <FilterBar
        transactions={transactions}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        filters={filters}
      />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                editingId={editingId}
                onEdit={onEdit}
                onUpdateCategory={onUpdateCategory}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategorizedTransactionTable;