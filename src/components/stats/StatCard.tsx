import { LucideIcon } from 'lucide-react';
import { formatAmount, formatTransactionCount } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="mt-2 h-4 w-[100px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden transition-shadow hover:shadow-md",
        onClick && "cursor-pointer"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatAmount(Math.abs(amount))}
        </div>
        <p className={cn(
          "text-xs",
          `text-${badgeColor}/70`
        )}>
          {formatTransactionCount(count)} transactions
        </p>
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          `bg-${badgeColor}/10`
        )} />
      </CardContent>
    </Card>
  );
};