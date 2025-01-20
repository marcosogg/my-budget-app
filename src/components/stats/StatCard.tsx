import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { formatEuroAmount, formatTransactionCount } from '@/utils/formatters';
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
  onClick: () => void;
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
      <Card className={`overflow-hidden border-none bg-gradient-to-br from-${gradientFrom} to-${gradientTo} shadow-lg`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden border-none bg-gradient-to-br from-${gradientFrom} to-${gradientTo} shadow-lg transition-all hover:shadow-xl`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold tracking-tight">
            {formatEuroAmount(amount)}
          </div>
          <button
            onClick={onClick}
            className={`inline-flex items-center rounded-full bg-${badgeColor}/10 px-2.5 py-0.5 text-xs font-semibold text-${badgeColor} transition-colors hover:bg-${badgeColor}/20 cursor-pointer`}
          >
            {formatTransactionCount(count)} transactions
          </button>
        </div>
      </CardContent>
    </Card>
  );
};