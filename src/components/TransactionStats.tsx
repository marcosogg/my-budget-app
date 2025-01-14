import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';

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

  const formatDate = (dateStr: string) => {
    try {
      const parsedDate = parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
      return format(parsedDate, 'dd MMM yyyy HH:mm');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr;
    }
  };

  const lastTransactionDate = transactions[0]?.completedDate 
    ? formatDate(transactions[0].completedDate)
    : 'No transactions';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Money In</CardTitle>
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
          <CardTitle className="text-sm font-medium">Money Out</CardTitle>
          <ArrowDown className="h-4 w-4 text-transaction-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-transaction-expense">
            {formatAmount(stats.expenses)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lastTransactionDate}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;