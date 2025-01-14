import { useEffect, useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
import TransactionStats from '@/components/TransactionStats';
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: transactions = [], refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('completed_date', { ascending: false })
        .limit(5);

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

  const handleFileUpload = async (newTransactions: Transaction[]) => {
    await refetch();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Transaction Viewer</h1>
          <p className="text-gray-600">Upload your CSV file to view and analyze your transactions</p>
        </div>
        <div className="flex gap-4">
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

      <FileUpload onFileUpload={handleFileUpload} />
      
      {transactions.length > 0 && (
        <div className="space-y-8">
          <TransactionStats transactions={transactions} />
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Transactions</h2>
            <Button variant="link" onClick={() => navigate('/transactions')}>
              View All
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <TransactionTable transactions={transactions} />
        </div>
      )}
    </div>
  );
};

export default Index;