import { CategorySummaryGrid } from "./CategorySummaryGrid";
import { Tag } from "@/types/tags";

interface CategoryListProps {
  categories: any[];
  isLoading: boolean;
  filters: {
    search: string;
    minAmount: number | null;
    maxAmount: number | null;
    tags: Tag[];
  };
  sortOption: string | null;
}

export const CategoryList = ({ categories, isLoading, filters, sortOption }: CategoryListProps) => {
  const filteredAndSortedCategories = categories?.filter(category => {
    if (filters.search && !category.category_name?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.minAmount !== null && category.total_amount < filters.minAmount) {
      return false;
    }
    if (filters.maxAmount !== null && category.total_amount > filters.maxAmount) {
      return false;
    }
    if (filters.tags.length > 0) {
      const categoryTagIds = category.tags?.map(t => t.id) || [];
      return filters.tags.every(tag => categoryTagIds.includes(tag.id));
    }
    return true;
  }).sort((a, b) => {
    if (!sortOption) return 0;
    
    switch (sortOption) {
      case 'amount-asc':
        return (a.total_amount || 0) - (b.total_amount || 0);
      case 'amount-desc':
        return (b.total_amount || 0) - (a.total_amount || 0);
      case 'name-asc':
        return (a.category_name || '').localeCompare(b.category_name || '');
      case 'name-desc':
        return (b.category_name || '').localeCompare(a.category_name || '');
      case 'count-asc':
        return (a.transaction_count || 0) - (b.transaction_count || 0);
      case 'count-desc':
        return (b.transaction_count || 0) - (a.transaction_count || 0);
      default:
        return 0;
    }
  }) || [];

  return (
    <CategorySummaryGrid 
      categories={filteredAndSortedCategories} 
      isLoading={isLoading} 
    />
  );
};