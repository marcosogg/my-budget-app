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
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from 'react';

interface TransactionTableProps {
  transactions: Transaction[];
}

const ITEMS_PER_PAGE = 10;

const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return dateStr;
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

  // Filter completed transactions
  const completedTransactions = transactions.filter(t => t.state === 'COMPLETED');
  
  // Calculate pagination
  const totalPages = Math.ceil(completedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = completedTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            {paginatedTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{transaction.type}</TableCell>
                <TableCell>{transaction.product}</TableCell>
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
                <TableCell>{transaction.currency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TransactionTable;