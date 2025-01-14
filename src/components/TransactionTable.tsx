import { Transaction } from '@/types/transaction';
import { format, parse } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const formatDate = (dateStr: string) => {
    try {
      // Parse the date string in the format "DD/MM/YYYY HH:mm"
      const parsedDate = parse(dateStr, 'dd/MM/yyyy HH:mm', new Date());
      return format(parsedDate, 'dd MMM yyyy HH:mm');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr; // Return original string if parsing fails
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionIcon = (amount: number) => {
    if (amount > 0) {
      return <ArrowUp className="w-4 h-4 text-transaction-income" />;
    }
    return <ArrowDown className="w-4 h-4 text-transaction-expense" />;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-transaction-income';
    if (amount < 0) return 'text-transaction-expense';
    return 'text-transaction-neutral';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{transaction.type}</TableCell>
              <TableCell>{formatDate(transaction.completedDate)}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {getTransactionIcon(transaction.amount)}
                  <span className={getAmountColor(transaction.amount)}>
                    {formatAmount(Math.abs(transaction.amount), transaction.currency)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatAmount(transaction.balance, transaction.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;