import { TableCell, TableRow } from "@/components/ui/table";
import { Transaction } from "@/types/transaction";
import { ArrowDown, ArrowUp, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate, formatAmount, getTransactionColor } from '@/utils/formatters';

interface TransactionRowProps {
  transaction: Transaction;
}

export const TransactionRow = ({ transaction }: TransactionRowProps) => {
  const getTransactionIcon = (amount: number) => (
    amount > 0 
      ? <ArrowUp className="w-4 h-4 text-transaction-income" />
      : <ArrowDown className="w-4 h-4 text-transaction-expense" />
  );

  const isAdjustedTransaction = (description: string | null) => 
    description?.includes('⚡') ?? false;

  return (
    <TableRow>
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
  );
};