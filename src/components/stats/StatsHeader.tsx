import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsHeaderProps {
  firstTransactionDate: Date | null;
  lastTransactionDate: Date | null;
  isLoading?: boolean;
}

export const StatsHeader = ({ 
  firstTransactionDate, 
  lastTransactionDate,
  isLoading = false 
}: StatsHeaderProps) => {
  if (isLoading) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-7 w-[300px]" />
        <Skeleton className="h-5 w-[200px]" />
      </div>
    );
  }

  if (!firstTransactionDate || !lastTransactionDate) {
    return null;
  }

  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold tracking-tight">Transaction Overview</h2>
      <p className="text-sm text-muted-foreground">
        From {format(firstTransactionDate, 'MMMM d, yyyy')} to {format(lastTransactionDate, 'MMMM d, yyyy')}
      </p>
    </div>
  );
};