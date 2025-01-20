import { useEffect } from 'react';
import TransactionStats from '@/components/TransactionStats';
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, Upload, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { useCategories } from '@/hooks/useCategories';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories({
    onlyExpenses: true
  });

  const { data: transactions = [] } = useQuery({
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Transaction Dashboard</h1>
          <p className="text-gray-600">View your transaction statistics</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/upload')}>
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
          <Button variant="outline" onClick={() => navigate('/transactions')}>
            View All Transactions
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {transactions.length > 0 ? (
        <TransactionStats 
          transactions={transactions} 
          categories={categories}
          isLoading={categoriesLoading}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No transactions found</p>
          <Button onClick={() => navigate('/upload')}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;