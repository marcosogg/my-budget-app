import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";

interface CategorySpending {
  category_name: string;
  total_amount: number;
  transaction_count: number;
}

interface CategorySummaryGridProps {
  categories: CategorySpending[];
  isLoading: boolean;
}

export const CategorySummaryGrid = ({ categories, isLoading }: CategorySummaryGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card key={category.category_name} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              {category.category_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
              }).format(category.total_amount)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {new Intl.NumberFormat('de-DE').format(category.transaction_count)} transactions
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};