import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TotalSpendingProps {
  amount: number;
  isLoading: boolean;
}

export const TotalSpending = ({ amount, isLoading }: TotalSpendingProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </CardContent>
    </Card>
  );
};