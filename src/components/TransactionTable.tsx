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
import { formatDate, formatAmount, getTransactionColor } from '@/utils/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
}

/**
 * TransactionTable Component
 * 
 * Displays a table of transactions with formatting for dates, amounts, and types.
 * Includes visual indicators for transaction direction (income/expense) and
 * special handling for adjusted transactions.
 */
const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const getTransactionIcon = (amount: number) => (
    amount > 0 
      ? <ArrowUp className="w-4 h-4 text-transaction-income" />
      : <ArrowDown className="w-4 h-4 text-transaction-expense" />
  );

  const isAdjustedTransaction = (description: string | null) => 
    description?.includes('⚡') ?? false;

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
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No transactions found
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