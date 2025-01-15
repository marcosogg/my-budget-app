import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';

export const useUncategorizedTransactions = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['uncategorizedTransactions'],
    queryFn: async () => {
      const { data: categorizedIds } = await supabase
        .from('categorized_transactions')
        .select('transaction_id');

      const transactionIds = categorizedIds?.map(ct => ct.transaction_id) || [];

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .not('id', 'in', `(${transactionIds.join(',')})`)
        .lt('amount', 0)
        .order('completed_date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load uncategorized transactions",
        });
        throw error;
      }

      const uniqueDescriptions = new Map();
      data?.forEach(transaction => {
        const description = transaction.description;
        if (description && !uniqueDescriptions.has(description)) {
          uniqueDescriptions.set(description, transaction);
        }
      });

      return Array.from(uniqueDescriptions.values()) as Transaction[];
    },
  });
};