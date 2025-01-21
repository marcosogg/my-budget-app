import { Category } from '@/types/categorization';
import { SortOption } from '../hooks/useTransactionSort';
import { SortSelect } from './filters/SortSelect';
import { CategorySelect } from './filters/CategorySelect';
import { DescriptionInput } from './filters/DescriptionInput';
import { DateFilter } from './filters/DateFilter';
import { ExpensesToggle } from './filters/ExpensesToggle';

interface FilterBarProps {
  categories: Category[];
  onFilterChange: (type: string, value: string | Date | undefined) => void;
  onSortChange: (value: SortOption) => void;
  onExpensesOnlyChange: (checked: boolean) => void;
  filters: {
    category: string;
    description: string;
    date: Date | undefined;
    expensesOnly: boolean;
  };
}

export const FilterBar = ({ 
  categories, 
  onFilterChange, 
  onSortChange, 
  filters,
  onExpensesOnlyChange
}: FilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <SortSelect onSortChange={onSortChange} />
      
      <CategorySelect
        categories={categories}
        value={filters.category}
        onFilterChange={onFilterChange}
      />
      
      <DescriptionInput
        value={filters.description}
        onFilterChange={onFilterChange}
      />
      
      <DateFilter
        date={filters.date}
        onFilterChange={onFilterChange}
      />
      
      <ExpensesToggle
        checked={filters.expensesOnly}
        onExpensesOnlyChange={onExpensesOnlyChange}
      />
    </div>
  );
};