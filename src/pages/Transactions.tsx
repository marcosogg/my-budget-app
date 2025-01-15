import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TransactionTable from "@/components/TransactionTable";
import TransactionStats from "@/components/TransactionStats";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Transactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: transactions = [], isLoading, error } = useQuery({
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

      // Map the snake_case database fields to camelCase for the Transaction interface
      return data.map(transaction => ({
        type: transaction.type,
        product: transaction.product,
        startedDate: transaction.started_date,
        completedDate: transaction.completed_date,
        description: transaction.description,
        amount: transaction.amount,
        fee: transaction.fee,
        currency: transaction.currency,
        state: transaction.state,
        balance: transaction.balance
      })) as Transaction[];
    },
  });

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>
        <div className="w-[100px]" /> {/* Spacer for alignment */}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found. Import some transactions to get started.</p>
        </div>
      ) : (
        <>
          <TransactionTable transactions={transactions} />
        </>
      )}
    </div>
  );
};

export default Transactions;