import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOption } from '../../hooks/useTransactionSort';

interface SortSelectProps {
  onSortChange: (value: SortOption) => void;
}

export const SortSelect = ({ onSortChange }: SortSelectProps) => {
  return (
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
  );
};