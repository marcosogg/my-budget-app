import TransactionStats from '@/components/TransactionStats';
import { useCategories } from '@/hooks/useCategories';
import { useTransactionsData } from '@/hooks/useTransactionsData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories({
    onlyExpenses: true
  });

  const { data: transactions = [] } = useTransactionsData();

  return (
    <div className="flex-1 min-h-screen">
      <DashboardHeader />
      <main className="p-6">
        {transactions.length > 0 ? (
          <TransactionStats 
            transactions={transactions} 
            categories={categories}
            isLoading={categoriesLoading}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <p className="text-muted-foreground">No transactions found</p>
            <Button onClick={() => navigate('/upload')} variant="default" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Transactions
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;