import { CreditCard, PiggyBank, RefreshCw } from 'lucide-react';
import { StatCard } from './StatCard';
import { TransactionStats } from '@/types/stats';

interface StatCardsGridProps {
  stats: TransactionStats;
  onCardClick: (filterType: string, filterValue?: string) => void;
  isLoading?: boolean;
}

export const StatCardsGrid = ({ stats, onCardClick, isLoading = false }: StatCardsGridProps) => {
  return (
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
        onClick={() => onCardClick('CARD_PAYMENT')}
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
        onClick={() => onCardClick('product', 'Savings')}
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
        onClick={() => onCardClick('TRANSFER', 'Credit card repayment')}
        isLoading={isLoading}
      />
    </div>
  );
};