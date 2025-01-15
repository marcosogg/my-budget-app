import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Calendar, CreditCard, PiggyBank, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionStatsProps {
  transactions: Transaction[];
}

const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  const stats = transactions.reduce(
    (acc, curr) => {
      // Money Out (negative amounts)
      if (curr.amount < 0) {
        acc.expenses += Math.abs(curr.amount);
      }
      
      // Card Payments count
      if (curr.type === 'CARD_PAYMENT') {
        acc.cardPaymentsCount += 1;
      }
      
      // Savings total
      if (curr.product === 'Savings') {
        acc.savingsTotal += curr.amount;
      }
      
      // Credit card repayments
      if (curr.description?.toLowerCase().includes('credit card repayment')) {
        acc.creditCardRepayments += curr.amount;
      }
      
      return acc;
    },
    { 
      expenses: 0, 
      cardPaymentsCount: 0, 
      savingsTotal: 0, 
      creditCardRepayments: 0 
    }
  );

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr;
    }
  };

  const dates = transactions
    .map(t => new Date(t.completedDate).getTime())
    .sort((a, b) => a - b);

  const firstTransactionDate = dates.length > 0 ? new Date(dates[0]) : null;
  const lastTransactionDate = dates.length > 0 ? new Date(dates[dates.length - 1]) : null;

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
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
          <CardTitle className="text-sm font-medium">First Transaction</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {firstTransactionDate ? formatDate(firstTransactionDate.toISOString()) : 'No transactions'}
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
            {lastTransactionDate ? formatDate(lastTransactionDate.toISOString()) : 'No transactions'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Card Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.cardPaymentsCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatAmount(stats.savingsTotal)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credit Card Repayment</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatAmount(stats.creditCardRepayments)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionStats;