import { Transaction } from '@/types/transaction';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from './transactions/LoadingState';
import { EmptyState } from './transactions/EmptyState';
import { TransactionRow } from './transactions/TransactionRow';

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
          {isLoading ? (
            <LoadingState />
          ) : transactions.length === 0 ? (
            <EmptyState />
          ) : (
            transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;