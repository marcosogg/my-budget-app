import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useCategorizedTransactionsData } from '@/hooks/useCategorizedTransactionsData';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useTransactionSort } from './hooks/useTransactionSort';
import CategorizedTransactionTable from './CategorizedTransactionTable';

const CategorizedTransactionsContainer = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { data: categories = [] } = useCategories();
  const { categorizedTransactions, isLoading, error } = useCategorizedTransactionsData();
  const { updateCategory } = useUpdateCategory();
  
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
    <CategorizedTransactionTable
      transactions={sortedTransactions}
      categories={categories}
      editingId={editingId}
      onEdit={setEditingId}
      onUpdateCategory={handleUpdateCategory}
      filters={filters}
      onFilterChange={handleFilterChange}
      onSortChange={setSortOption}
    />
  );
};

export default CategorizedTransactionsContainer;