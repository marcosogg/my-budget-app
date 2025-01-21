import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';
import { useNavigate } from 'react-router-dom';
import { useTransactionStats } from './stats/useTransactionStats';
import { StatsHeader } from './stats/StatsHeader';
import { StatCard } from './stats/StatCard';
import { useTransactionFilters } from '@/hooks/useTransactionFilters';
import { StatCardsGrid } from './stats/StatCardsGrid';

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
    const params = new URLSearchParams();
    
    switch (filterType) {
      case 'CARD_PAYMENT':
        params.set('type', filterType);
        break;
      case 'product':
        if (filterValue) params.set('product', filterValue);
        break;
      case 'TRANSFER':
        params.set('type', filterType);
        if (filterValue) {
          params.set('description', filterValue);
        }
        break;
    }
    
    navigate({
      pathname: '/transactions',
      search: params.toString()
    }, {
      state: { from: location.pathname }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <StatsHeader 
        firstTransactionDate={firstTransactionDate}
        lastTransactionDate={lastTransactionDate}
        isLoading={isLoading}
      />

      <StatCardsGrid
        stats={stats}
        onCardClick={handleCountClick}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionStats;