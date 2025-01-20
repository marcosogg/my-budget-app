import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsHeaderProps {
  firstTransactionDate: Date | null;
  lastTransactionDate: Date | null;
  isLoading?: boolean;
}

export const StatsHeader = ({ firstTransactionDate, lastTransactionDate, isLoading = false }: StatsHeaderProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  if (!firstTransactionDate || !lastTransactionDate) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">Statistics</h2>
      <p className="text-muted-foreground">
        Showing data from {format(firstTransactionDate, 'PPP')} to{' '}
        {format(lastTransactionDate, 'PPP')}
      </p>
    </div>
  );
};