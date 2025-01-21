import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';
import { CreditCard, PiggyBank, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTransactionStats } from './stats/useTransactionStats';
import { StatsHeader } from './stats/StatsHeader';
import { StatCard } from './stats/StatCard';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';

interface TransactionStatsProps {
  transactions: Transaction[];
  categories?: Category[];
  isLoading?: boolean;
}

const TransactionStats = ({ 
  transactions, 
  categories = [], 
  isLoading = false 
}: TransactionStatsProps) => {
  const navigate = useNavigate();
  const { setFilter } = useTransactionFilters();
  const { stats, firstTransactionDate, lastTransactionDate } = useTransactionStats(
    transactions, 
    categories
  );

  const handleCountClick = (filterType: string, filterValue?: string) => {
    navigate('/transactions');
    
    switch (filterType) {
      case 'CARD_PAYMENT':
        setFilter('type', filterType);
        break;
      case 'product':
        setFilter('product', filterValue);
        break;
      case 'TRANSFER':
        setFilter('type', filterType);
        if (filterValue) {
          setFilter('description', filterValue);
        }
        break;
    }
  };

  return (
    <div className="space-y-8">
      <StatsHeader 
        firstTransactionDate={firstTransactionDate}
        lastTransactionDate={lastTransactionDate}
        isLoading={isLoading}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Card Payments"
          amount={stats.cardPayments.amount}
          count={stats.cardPayments.count}
          icon={CreditCard}
          gradientFrom="primary/5"
          gradientTo="primary/10"
          iconColor="text-primary/70"
          badgeColor="primary"
          onClick={() => handleCountClick('CARD_PAYMENT')}
          isLoading={isLoading}
        />

        <StatCard
          title="Savings"
          amount={stats.savingsTotal.amount}
          count={stats.savingsTotal.count}
          icon={PiggyBank}
          gradientFrom="green-500/5"
          gradientTo="green-500/10"
          iconColor="text-green-500/70"
          badgeColor="green-500"
          onClick={() => handleCountClick('product', 'Savings')}
          isLoading={isLoading}
        />

        <StatCard
          title="Credit Card Repayment"
          amount={stats.creditCardRepayments.amount}
          count={stats.creditCardRepayments.count}
          icon={RefreshCw}
          gradientFrom="blue-500/5"
          gradientTo="blue-500/10"
          iconColor="text-blue-500/70"
          badgeColor="blue-500"
          onClick={() => handleCountClick('TRANSFER', 'Credit card repayment')}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TransactionStats;