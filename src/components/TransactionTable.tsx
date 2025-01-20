import { Transaction } from '@/types/transaction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  formatDate, 
  formatAmount, 
  getTransactionIcon, 
  getTransactionColor 
} from '@/lib/formatters';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const isAdjustedTransaction = (description: string | null) => {
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
                    <span className={getTransactionColor(transaction.amount)}>
                      {formatAmount(Math.abs(transaction.amount), transaction.currency)}
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