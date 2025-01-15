import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { CategorizedTransaction, Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';
import { Edit, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDate, formatAmount, getTransactionColor } from '../utils/formatters';

interface TransactionRowProps {
  transaction: CategorizedTransaction & { 
    transactions: Transaction, 
    categories: Category 
  };
  categories: Category[];
  editingId: string | null;
  onEdit: (id: string | null) => void;
  onUpdateCategory: (transactionId: string, categoryId: string) => void;
}

export const TransactionRow = ({
  transaction,
  categories,
  editingId,
  onEdit,
  onUpdateCategory,
}: TransactionRowProps) => {
  const getTransactionIcon = (amount: number) => {
    if (amount > 0) {
      return <ArrowUp className="w-4 h-4 text-transaction-income" />;
    }
    return <ArrowDown className="w-4 h-4 text-transaction-expense" />;
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {editingId === transaction.id ? (
          <Select
            defaultValue={transaction.category_id}
            onValueChange={(value) => onUpdateCategory(transaction.id, value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          transaction.categories.name
        )}
      </TableCell>
      <TableCell>{formatDate(transaction.transactions.completed_date)}</TableCell>
      <TableCell>{transaction.transactions.description}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {getTransactionIcon(transaction.transactions.amount)}
          <span className={getTransactionColor(transaction.transactions.amount)}>
            {formatAmount(Math.abs(transaction.transactions.amount), transaction.transactions.currency)}
          </span>
        </div>
      </TableCell>
      <TableCell>{transaction.transactions.currency}</TableCell>
      <TableCell>{transaction.notes}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(editingId === transaction.id ? null : transaction.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};