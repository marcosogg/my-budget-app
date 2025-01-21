import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount, formatTransactionCount } from '@/utils/formatters';

interface Category {
  category_name: string | null;
  total_amount: number | null;
  transaction_count: number | null;
}

interface CategorySummaryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategorySummaryGrid({ categories, isLoading }: CategorySummaryGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card key={category.category_name}>
          <CardContent>
            <h2 className="text-lg font-semibold">{category.category_name}</h2>
            <p>Total: {formatAmount(category.total_amount || 0)}</p>
            <p>Transactions: {formatTransactionCount(category.transaction_count || 0)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
