import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { useToast } from "@/components/ui/use-toast";

export const useTransactionsData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('completed_date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions",
        });
        throw error;
      }

      return data.map(transaction => ({
        type: transaction.type,
        product: transaction.product,
        started_date: transaction.started_date,
        completed_date: transaction.completed_date,
        description: transaction.description,
        amount: transaction.amount,
        fee: transaction.fee,
        currency: transaction.currency,
        state: transaction.state,
        balance: transaction.balance,
        id: transaction.id,
        user_id: transaction.user_id,
        created_at: transaction.created_at,
      })) as Transaction[];
    },
  });
};