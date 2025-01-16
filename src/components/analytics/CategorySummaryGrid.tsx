import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Euro } from "lucide-react";
import { formatEuroAmount, formatTransactionCount } from "@/utils/formatters";

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
          <Card key={i} className="border border-border/50">
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="border border-border/50 text-center py-8">
        <CardContent>
          <p className="text-lg text-muted-foreground">No categories found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or selecting a different month</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Card 
          key={category.category_name} 
          className="group border border-border/50 transition-all duration-200 hover:border-primary/50 hover:shadow-md"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
              <Euro className="h-5 w-5 text-primary" />
              {category.category_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary transition-colors group-hover:text-primary/90">
              {formatEuroAmount(category.total_amount)}
            </p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              {formatTransactionCount(category.transaction_count)} transactions
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};