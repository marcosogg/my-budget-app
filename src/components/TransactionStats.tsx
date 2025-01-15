import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, PiggyBank, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

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
    cardPayments: {
      amount: payments.reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
      count: payments.length,
    },
    savingsTotal: savings.reduce((acc, curr) => acc + curr.amount, 0),
    creditCardRepayments: transfers.reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
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
    .map(t => new Date(t.completed_date || '').getTime())
    .sort((a, b) => a - b);

  const firstTransactionDate = dates.length > 0 ? new Date(dates[0]) : null;
  const lastTransactionDate = dates.length > 0 ? new Date(dates[dates.length - 1]) : null;

  return (
    <div className="space-y-8">
      {/* Transaction Dates Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Financial Overview</h1>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">First Transaction</span>
            <span className="font-medium">{firstTransactionDate ? formatDate(firstTransactionDate.toISOString()) : 'No transactions'}</span>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">Last Transaction</span>
            <span className="font-medium">{lastTransactionDate ? formatDate(lastTransactionDate.toISOString()) : 'No transactions'}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Card Payments
              </CardTitle>
              <CreditCard className="h-4 w-4 text-primary/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">
                {formatAmount(stats.cardPayments.amount)}
              </div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {stats.cardPayments.count} transactions
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Savings
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-green-500/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">
                {formatAmount(stats.savingsTotal)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500/5 to-blue-500/10 shadow-lg transition-all hover:shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Credit Card Repayment
              </CardTitle>
              <RefreshCw className="h-4 w-4 text-blue-500/70" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold tracking-tight">
                {formatAmount(stats.creditCardRepayments)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionStats;
