import { useEffect, useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';
import TransactionStats from '@/components/TransactionStats';
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fetchTransactions = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('completed_date', { ascending: false });

  if (error) throw error;

  return data.map(t => ({
    type: t.type,
    product: t.product,
    startedDate: t.started_date,
    completedDate: t.completed_date,
    description: t.description,
    amount: t.amount,
    fee: t.fee,
    currency: t.currency,
    state: t.state,
    balance: t.balance
  }));
};

const Index = () => {
  const navigate = useNavigate();
  const { data: transactions = [], refetch } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
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
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <FileUpload onFileUpload={handleFileUpload} />
      
      {transactions.length > 0 && (
        <div className="space-y-8">
          <TransactionStats transactions={transactions} />
          <TransactionTable transactions={transactions} />
        </div>
      )}
    </div>
  );
};

export default Index;