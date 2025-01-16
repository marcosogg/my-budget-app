import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { CategoryFilters, SortOption } from "@/hooks/useCategoryAnalytics";
import { TagSelect } from "@/components/tags/TagSelect";
import { Tag } from "@/types/tags";
import { useTags } from "@/hooks/useTags";

interface CategoryFilterBarProps {
  filters: CategoryFilters;
  sortOption: SortOption | null;
  onFilterChange: (key: keyof CategoryFilters, value: string | number | null) => void;
  onSortChange: (value: SortOption | null) => void;
  onClearFilters: () => void;
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagDeselect: (tagId: string) => void;
}

export const CategoryFilterBar = ({
  filters,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters,
  selectedTags,
  onTagSelect,
  onTagDeselect,
}: CategoryFilterBarProps) => {
  const { tags, isLoading: isLoadingTags } = useTags();

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      
      <div className="flex flex-wrap gap-4 items-start">
        <div className="space-y-4">
          <Input
            placeholder="Search expense categories..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-[250px]"
          />
          
          <Input
            type="number"
            placeholder="Min expense amount"
            value={filters.minAmount || ''}
            onChange={(e) => onFilterChange('minAmount', e.target.value ? Number(e.target.value) : null)}
            className="w-[250px]"
          />
          
          <Input
            type="number"
            placeholder="Max expense amount"
            value={filters.maxAmount || ''}
            onChange={(e) => onFilterChange('maxAmount', e.target.value ? Number(e.target.value) : null)}
            className="w-[250px]"
          />
        </div>

        <div className="space-y-4">
          <Select
            value={sortOption || ''}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="w-[250px]">
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

          <TagSelect
            tags={tags || []}
            selectedTags={selectedTags}
            onTagSelect={onTagSelect}
            onTagDeselect={onTagDeselect}
            className="w-[250px]"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onClearFilters}
          className="h-10 w-10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};