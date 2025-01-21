import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/types/categorization';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onFilterChange: (type: string, value: string) => void;
}

export const CategorySelect = ({ categories, value, onFilterChange }: CategorySelectProps) => {
  const filteredCategories = categories.filter(category => category.type !== 'uncategorized');

  return (
    <Select 
      value={value}
      onValueChange={(value) => onFilterChange('category', value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by Category" />
      </SelectTrigger>
      <SelectContent>
        {filteredCategories.map((category) => (
          <SelectItem key={category.id} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};