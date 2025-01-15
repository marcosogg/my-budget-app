import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UncategorizedTransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  categorizedTransactions: { [key: string]: string | null };
  onCategoryChange: (transactionId: string, categoryId: string) => void;
  onNotesChange: (transactionId: string, notes: string) => void;
  onCategorize: (transactionId: string) => void;
  onCreateMapping: (transaction: Transaction) => void;
}

export const UncategorizedTransactionList = ({
  transactions,
  categories,
  categorizedTransactions,
  onCategoryChange,
  onNotesChange,
  onCategorize,
  onCreateMapping,
}: UncategorizedTransactionListProps) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No uncategorized transactions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="border rounded-md p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{transaction.description}</h2>
            <p className="text-gray-500">
              {new Date(transaction.completed_date || '').toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Select onValueChange={(value) => onCategoryChange(transaction.id, value)}>
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
            <Textarea
              placeholder="Add notes (optional)"
              className="w-[300px]"
              onChange={(e) => onNotesChange(transaction.id, e.target.value)}
            />
            <Button onClick={() => onCategorize(transaction.id)}>Categorize</Button>
            <Button variant="outline" onClick={() => onCreateMapping(transaction)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Mapping
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};