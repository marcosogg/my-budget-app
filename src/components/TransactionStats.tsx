import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet } from 'lucide-react';

interface TransactionStatsProps {
  transactions: Transaction[];
}

const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  const stats = transactions.reduce(
    (acc, curr) => {
      if (curr.amount > 0) {
        acc.income += curr.amount;
      } else {
        acc.expenses += Math.abs(curr.amount);
      }
      return acc;
    },
    { income: 0, expenses: 0 }
  );

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatAmount(transactions[0]?.balance || 0)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUp className="h-4 w-4 text-transaction-income" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-transaction-income">
            {formatAmount(stats.income)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-transaction-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-transaction-expense">
            {formatAmount(stats.expenses)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;