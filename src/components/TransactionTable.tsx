import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  console.log("Transactions received in TransactionTable:", transactions);

  const formatDate = (date: Date | null | undefined) => {
    console.log("Formatting date:", date);
    if (!date) return 'Never';
    try {
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount: number | null | undefined, currency: string) => {
    console.log("Formatting amount:", amount, "currency:", currency);
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionIcon = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return null;
    if (amount > 0) {
      return <ArrowUp className="w-4 h-4 text-transaction-income" />;
    }
    return <ArrowDown className="w-4 h-4 text-transaction-expense" />;
  };

  const getAmountColor = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return '';
    if (amount > 0) return 'text-transaction-income';
    if (amount < 0) return 'text-transaction-expense';
    return 'text-transaction-neutral';
  };

  const isAdjustedTransaction = (description: string | null | undefined) => {
    return description?.includes('⚡') ?? false;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{transaction.type}</TableCell>
                <TableCell>{transaction.product}</TableCell>
                <TableCell>{formatDate(transaction.completed_date)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {transaction.description?.replace('⚡', '')}
                    {isAdjustedTransaction(transaction.description) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Zap className="h-4 w-4 text-yellow-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rent amount adjusted during import</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {getTransactionIcon(transaction.amount)}
                    <span className={getAmountColor(transaction.amount)}>
                      {formatAmount(transaction.amount ? Math.abs(transaction.amount) : 0, transaction.currency)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{transaction.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
