import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, PiggyBank, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionStatsProps {
  transactions: Transaction[];
}

const TransactionStats = ({ transactions }: TransactionStatsProps) => {

  const roundedTransactions = transactions.map(transaction => ({
    ...transaction,
    amount: parseFloat(transaction.amount.toFixed(1)),
  }));

  const payments = roundedTransactions.filter(t => t.amount < 0 && t.type === 'CARD_PAYMENT');
  const transfers = roundedTransactions.filter(t => t.amount < 0 && t.type === 'TRANSFER' && t.description === 'Credit card repayment');
  const savings = roundedTransactions.filter(t => t.product === 'Savings');

  const stats = {
    cardPaymentsCount: payments.length,
    savingsTotal: savings.reduce((acc, curr) => acc + curr.amount, 0),
    creditCardRepayments: transfers.reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
  };

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
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-4">
        <Card>
          <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Transaction</CardTitle>
            <div className="text-2xl font-bold">
              {firstTransactionDate ? formatDate(firstTransactionDate.toISOString()) : 'No transactions'}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Transaction</CardTitle>
            <div className="text-2xl font-bold">
              {lastTransactionDate ? formatDate(lastTransactionDate.toISOString()) : 'No transactions'}
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
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
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
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
    </div>
  );
};

export default TransactionStats;
