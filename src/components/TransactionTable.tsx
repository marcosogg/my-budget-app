import { Transaction } from '@/types/transaction';
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatAmount, getTransactionColor } from '@/utils/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

/**
 * TransactionTable Component
 * 
 * Displays a table of transactions with formatting for dates, amounts, and types.
 * Includes visual indicators for transaction direction (income/expense) and
 * special handling for adjusted transactions.
 * 
 * @param transactions - Array of transactions to display
 * @param isLoading - Loading state flag
 */
const TransactionTable = ({ transactions, isLoading = false }: TransactionTableProps) => {
  const getTransactionIcon = (amount: number) => (
    amount > 0 
      ? <ArrowUp className="w-4 h-4 text-transaction-income" />
      : <ArrowDown className="w-4 h-4 text-transaction-expense" />
  );

  const isAdjustedTransaction = (description: string | null) => 
    description?.includes('⚡') ?? false;

  if (isLoading) {
    return (
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
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
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
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <p>No transactions found</p>
                  <p className="text-sm">Try adjusting your filters or upload new transactions</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
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
                    <span className={getTransactionColor(transaction.amount)}>
                      {formatAmount(Math.abs(transaction.amount), transaction.currency)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{transaction.currency}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;