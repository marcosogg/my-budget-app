import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EuroIcon } from "lucide-react";

interface TotalSpendingProps {
  amount: number;
  isLoading: boolean;
}

export const TotalSpending = ({ amount, isLoading }: TotalSpendingProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EuroIcon className="h-5 w-5" />
            Total Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <EuroIcon className="h-5 w-5 text-primary" />
          Total Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-primary">
          {new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
          }).format(amount)}
        </p>
      </CardContent>
    </Card>
  );
};