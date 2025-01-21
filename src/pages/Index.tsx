import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TransactionStats } from "@/components/TransactionStats";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactionsData();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const hasTransactions = transactions && transactions.length > 0;

  // Calculate total spending from transactions
  const totalSpending = transactions?.reduce((sum, transaction) => {
    return transaction.amount < 0 ? sum + Math.abs(transaction.amount) : sum;
  }, 0) || 0;

  // Prepare data for the spending chart
  const spendingByCategory = categories?.map((category) => {
    const categoryTransactions = transactions?.filter(
      (t) => t.category_id === category.id && t.amount < 0
    ) || [];
    const amount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      name: category.name,
      amount: amount,
      transactions: categoryTransactions.length,
    };
  }) || [];

  if (isLoadingTransactions || isLoadingCategories) {
    return <div>Loading...</div>;
  }

  if (!hasTransactions) {
    return (
      <div className="container mx-auto py-10 space-y-8">
        <DashboardHeader />
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <CardHeader>
            <CardTitle>No transactions found</CardTitle>
            <CardDescription>Start by uploading your transaction data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/upload")}>
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Upload Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <DashboardHeader />
      
      <TransactionStats />

      <Card className="bg-primary">
        <CardHeader>
          <CardTitle className="text-primary-foreground">Total Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary-foreground">
            {totalSpending.toFixed(2)} €
          </div>
          <p className="text-sm text-primary-foreground/80">
            Total spending for the selected period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>
            A breakdown of your spending across different categories
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={spendingByCategory}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}€`}
              />
              <Bar
                dataKey="amount"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Spending by Category
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {spendingByCategory.map((category) => (
            <Card key={category.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {category.amount.toFixed(2)} €
                </div>
                <p className="text-xs text-muted-foreground">
                  {category.transactions} transaction
                  {category.transactions !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;