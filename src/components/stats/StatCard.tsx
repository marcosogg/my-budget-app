import { LucideIcon } from 'lucide-react';
import { formatAmount, formatTransactionCount } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  amount: number;
  count: number;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  badgeColor: string;
  onClick?: () => void;
  isLoading?: boolean;
}

export const StatCard = ({
  title,
  amount,
  count,
  icon: Icon,
  gradientFrom,
  gradientTo,
  iconColor,
  badgeColor,
  onClick,
  isLoading = false,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-6 w-[100px]" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4 hover:shadow-md transition-all",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`
          )}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
      </div>
      
      <div className="text-3xl font-bold tracking-tight">
        {formatAmount(Math.abs(amount))}
      </div>

      <div className={cn(
        "text-sm font-medium",
        `text-${badgeColor}/70`
      )}>
        {formatTransactionCount(count)} transactions
      </div>
    </div>
  );
};