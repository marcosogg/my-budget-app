import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

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
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-28 mb-1" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        onClick && "hover:cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
          }).format(amount)}
        </div>
        <p className="text-xs text-muted-foreground">
          {count} transaction{count !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
};