import TransactionStats from '@/components/TransactionStats';
import { useCategories } from '@/hooks/useCategories';
import { useTransactionsData } from '@/hooks/useTransactionsData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const { data: categories = [], isLoading: categoriesLoading } = useCategories({
    onlyExpenses: true
  });

  const { data: transactions = [] } = useTransactionsData();

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 space-y-8">
      <DashboardHeader />

      {transactions.length > 0 ? (
        <TransactionStats 
          transactions={transactions} 
          categories={categories}
          isLoading={categoriesLoading}
        />
      ) : (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">No transactions found</p>
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