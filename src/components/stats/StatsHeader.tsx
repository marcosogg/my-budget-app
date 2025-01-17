import { formatEuroDate } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';

interface StatsHeaderProps {
  firstTransactionDate: Date | null;
  lastTransactionDate: Date | null;
}

export const StatsHeader = ({ firstTransactionDate, lastTransactionDate }: StatsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">Financial Overview</h1>
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground">First Transaction</span>
          <span className="font-medium">
            {firstTransactionDate ? formatEuroDate(firstTransactionDate.toISOString()) : 'No transactions'}
          </span>
        </div>
        <Separator orientation="vertical" className="h-8" />
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground">Last Transaction</span>
          <span className="font-medium">
            {lastTransactionDate ? formatEuroDate(lastTransactionDate.toISOString()) : 'No transactions'}
          </span>
        </div>
      </div>
    </div>
  );
};