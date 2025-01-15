import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { CategorizedTransaction, Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';

export const useCategorizedTransactions = () => {
  const { toast } = useToast();

  const { data: categorizedTransactions = [], isLoading, error, refetch } = useQuery({
    queryKey: ['categorizedTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorized_transactions')
        .select('*, transactions(*), categories(*)')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categorized transactions",
        });
        throw error;
      }

      return data as (CategorizedTransaction & { 
        transactions: Transaction, 
        categories: Category 
      })[];
    },
  });

  const handleUpdateCategory = async (transactionId: string, newCategoryId: string) => {
    try {
      const currentTransaction = categorizedTransactions.find(t => t.id === transactionId);
      if (!currentTransaction) return;

      const description = currentTransaction.transactions.description;

      const { error: updateError } = await supabase
        .from('categorized_transactions')
        .update({ category_id: newCategoryId })
        .eq('id', transactionId);

      if (updateError) throw updateError;

      const { error: mappingError } = await supabase
        .from('description_category_mappings')
        .upsert({
          description: description || '',
          category_id: newCategoryId,
          user_id: currentTransaction.user_id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'description,user_id',
        });

      if (mappingError) throw mappingError;

      toast({
        title: "Success",
        description: "Category updated successfully for all matching transactions",
      });
      
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update category",
      });
    }
  };

  return {
    categorizedTransactions,
    isLoading,
    error,
    handleUpdateCategory,
  };
};