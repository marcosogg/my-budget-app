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
        .select('*, categorized_transactions(*)')
        .order('completed_date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions",
        });
        throw error;
      }

      return data as Transaction[];
    },
  });
};