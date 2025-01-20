import { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from '@/hooks/useCategories';
import { useCategorizedTransactionsData } from '@/hooks/useCategorizedTransactionsData';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useTransactionSort } from './hooks/useTransactionSort';
import { FilterBar } from './components/FilterBar';
import { TransactionRow } from './components/TransactionRow';

const CategorizedTransactionTable = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { data: categories = [] } = useCategories();
  const { 
    categorizedTransactions, 
    isLoading, 
    error, 
    updateCategory 
  } = useCategorizedTransactionsData();
  
  const { filters, filteredTransactions, handleFilterChange } = useTransactionFilters(categorizedTransactions);
  const { sortOption, setSortOption, sortedTransactions } = useTransactionSort(filteredTransactions);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading categorized transactions.</div>;
  }

  const handleUpdateCategory = (transactionId: string, categoryId: string) => {
    updateCategory({ transactionId, categoryId });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <FilterBar
        transactions={categorizedTransactions}
        onFilterChange={handleFilterChange}
        onSortChange={setSortOption}
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
            {sortedTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                categories={categories}
                editingId={editingId}
                onEdit={setEditingId}
                onUpdateCategory={handleUpdateCategory}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategorizedTransactionTable;