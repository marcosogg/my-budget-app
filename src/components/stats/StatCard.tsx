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
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
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
        "rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4",
        onClick && "cursor-pointer hover:shadow-md transition-shadow"
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-2 rounded-full",
          `bg-gradient-to-br from-${gradientFrom} to-${gradientTo}`
        )}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      
      <div className="text-2xl font-bold">
        {formatAmount(Math.abs(amount))}
      </div>

      <div className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
        `bg-${badgeColor}/10 text-${badgeColor}`
      )}>
        {formatTransactionCount(count)} transactions
      </div>
    </div>
  );
};