import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAmount, formatTransactionCount } from '@/utils/formatters';

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
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-7 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`p-6 space-y-4 cursor-pointer transition-colors hover:bg-${gradientFrom}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <div className={`p-2 rounded-full bg-${gradientFrom}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold">
          {formatAmount(amount)}
        </p>
        <div className={`inline-flex items-center text-sm text-${badgeColor}`}>
          {formatTransactionCount(count)}
        </div>
      </div>
    </Card>
  );
};