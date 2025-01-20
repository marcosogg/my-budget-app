import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, CategorizedTransactionWithDetails } from '@/services/categoryService';
import { useToast } from '@/components/ui/use-toast';

export const useCategorizedTransactionsData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: categorizedTransactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categorizedTransactions'],
    queryFn: categoryService.fetchCategorizedTransactions,
  });

  const { mutate: updateCategory } = useMutation({
    mutationFn: async ({ 
      transactionId, 
      categoryId 
    }: { 
      transactionId: string; 
      categoryId: string; 
    }) => {
      await categoryService.updateTransactionCategory(transactionId, categoryId);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category updated successfully for all matching transactions",
      });
      queryClient.invalidateQueries({ queryKey: ['categorizedTransactions'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category",
      });
    },
  });

  return {
    categorizedTransactions,
    isLoading,
    error,
    updateCategory,
  };
};