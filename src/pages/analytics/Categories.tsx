import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { CategorySummaryGrid } from "@/components/analytics/CategorySummaryGrid";
import { TotalSpending } from "@/components/analytics/TotalSpending";
import { UncategorizedAlert } from "@/components/analytics/UncategorizedAlert";
import { CategoryFilterBar } from "@/components/analytics/CategoryFilterBar";
import { useCategoryAnalytics } from "@/hooks/useCategoryAnalytics";
import { useCategorySpending } from "@/hooks/useCategorySpending";
import { useUncategorizedSummary } from "@/hooks/useUncategorizedSummary";
import { Tag } from "@/types/tags";

const Categories = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sortOption, setSortOption, filters, updateFilter, clearFilters } = useCategoryAnalytics();
  const formattedDate = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  const { data: categorySpending, isLoading: isCategoryLoading } = useCategorySpending(formattedDate);
  const { data: uncategorizedSummary } = useUncategorizedSummary();

  // Handle tag selection
  const handleTagSelect = (tag: Tag) => {
    const updatedTags = [...filters.tags, tag];
    updateFilter('tags', updatedTags);
  };

  const handleTagDeselect = (tagId: string) => {
    const updatedTags = filters.tags.filter(tag => tag.id !== tagId);
    updateFilter('tags', updatedTags);
  };

  // Apply filters and sorting to category spending data
  const filteredAndSortedCategories = categorySpending?.filter(category => {
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
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Monthly Spending Summary</h1>
        <MonthPicker value={selectedDate} onChange={setSelectedDate} />
      </div>

      {uncategorizedSummary?.total_transactions > 0 && (
        <UncategorizedAlert
          uniqueDescriptions={uncategorizedSummary.unique_description_count}
          totalTransactions={uncategorizedSummary.total_transactions}
        />
      )}

      <CategoryFilterBar
        filters={filters}
        sortOption={sortOption}
        onFilterChange={updateFilter}
        onSortChange={setSortOption}
        onClearFilters={clearFilters}
        selectedTags={filters.tags}
        onTagSelect={handleTagSelect}
        onTagDeselect={handleTagDeselect}
      />

      <TotalSpending 
        amount={filteredAndSortedCategories.reduce((sum, cat) => sum + (cat.total_amount || 0), 0)} 
        isLoading={isCategoryLoading} 
      />

      <CategorySummaryGrid 
        categories={filteredAndSortedCategories} 
        isLoading={isCategoryLoading} 
      />
    </div>
  );
};

export default Categories;