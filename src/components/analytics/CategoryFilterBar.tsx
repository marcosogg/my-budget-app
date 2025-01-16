import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CategoryFilters, SortOption } from "@/hooks/useCategoryAnalytics";

interface CategoryFilterBarProps {
  filters: CategoryFilters;
  sortOption: SortOption | null;
  onFilterChange: (key: keyof CategoryFilters, value: string | number | null) => void;
  onSortChange: (value: SortOption | null) => void;
  onClearFilters: () => void;
}

export const CategoryFilterBar = ({
  filters,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters,
}: CategoryFilterBarProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <Input
        placeholder="Search expense categories..."
        value={filters.search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        className="w-[200px]"
      />
      
      <Input
        type="number"
        placeholder="Min expense amount"
        value={filters.minAmount || ''}
        onChange={(e) => onFilterChange('minAmount', e.target.value ? Number(e.target.value) : null)}
        className="w-[150px]"
      />
      
      <Input
        type="number"
        placeholder="Max expense amount"
        value={filters.maxAmount || ''}
        onChange={(e) => onFilterChange('maxAmount', e.target.value ? Number(e.target.value) : null)}
        className="w-[150px]"
      />
      
      <Select
        value={sortOption || ''}
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
          <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
          <SelectItem value="name-asc">Category (A-Z)</SelectItem>
          <SelectItem value="name-desc">Category (Z-A)</SelectItem>
          <SelectItem value="count-asc">Transactions (Low to High)</SelectItem>
          <SelectItem value="count-desc">Transactions (High to Low)</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={onClearFilters}
        className="h-10 w-10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};