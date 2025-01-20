import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/hooks/use-toast';

export const useUpdateCategory = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: updateCategory, isPending } = useMutation({
    mutationFn: async ({ 
      transactionId, 
      categoryId 
    }: { 
      transactionId: string; 
      categoryId: string; 
    }) => {
      return categoryService.updateTransactionCategory(transactionId, categoryId);
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
    updateCategory,
    isUpdating: isPending,
  };
};