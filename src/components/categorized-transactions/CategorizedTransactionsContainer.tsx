import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useCategorizedTransactionsData } from '@/hooks/useCategorizedTransactionsData';
import { useUpdateCategory } from '@/hooks/useUpdateCategory';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useTransactionSort } from './hooks/useTransactionSort';
import CategorizedTransactionTable from './CategorizedTransactionTable';
import { useToast } from '@/components/ui/use-toast';

const CategorizedTransactionsContainer = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { categorizedTransactions, isLoading: transactionsLoading, error } = useCategorizedTransactionsData();
  const { updateCategory, isUpdating } = useUpdateCategory();
  
  const { 
    filters, 
    filteredTransactions, 
    handleFilterChange
  } = useTransactionFilters(categorizedTransactions);
  const { sortOption, setSortOption, sortedTransactions } = useTransactionSort(filteredTransactions);

  const isLoading = categoriesLoading || transactionsLoading;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load transactions. Please try again later.",
    });
    return null;
  }

  const handleUpdateCategory = async (transactionId: string, categoryId: string) => {
    try {
      await updateCategory({ transactionId, categoryId });
      setEditingId(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category. Please try again.",
      });
    }
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
      sortOption={sortOption}
      onSortChange={setSortOption}
      isLoading={isUpdating}
    />
  );
};

export default CategorizedTransactionsContainer;