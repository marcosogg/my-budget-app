import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CategorizedTransaction, Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';
import { SortOption } from '../hooks/useTransactionSort';

interface FilterBarProps {
  transactions: (CategorizedTransaction & { 
    transactions: Transaction, 
    categories: Category 
  })[];
  onFilterChange: (type: string, value: string | Date | undefined) => void;
  onSortChange: (value: SortOption) => void;
  filters: {
    category: string;
    description: string;
    date: Date | undefined;
  };
}

export const FilterBar = ({ transactions, onFilterChange, onSortChange, filters }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Select onValueChange={(value: SortOption) => onSortChange(value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-asc">Date (Ascending)</SelectItem>
          <SelectItem value="date-desc">Date (Descending)</SelectItem>
          <SelectItem value="amount-asc">Amount (Ascending)</SelectItem>
          <SelectItem value="amount-desc">Amount (Descending)</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => onFilterChange('category', value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter by Category" />
        </SelectTrigger>
        <SelectContent>
          {transactions.map((transaction) => (
            <SelectItem key={transaction.categories.id} value={transaction.categories.name}>
              {transaction.categories.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Filter by Description"
        value={filters.description}
        onChange={(e) => onFilterChange('description', e.target.value)}
        className="w-[200px]"
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !filters.date && "text-muted-foreground"
            )}
          >
            {filters.date ? format(filters.date, "dd/MM/yyyy") : "Filter by Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.date}
            onSelect={(date) => onFilterChange('date', date)}
            className="border-0"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};