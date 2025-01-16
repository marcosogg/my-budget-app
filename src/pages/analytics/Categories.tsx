import { useState } from "react";
import { format, startOfMonth } from "date-fns";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { TotalSpending } from "@/components/analytics/TotalSpending";
import { UncategorizedAlert } from "@/components/analytics/UncategorizedAlert";
import { CategoryFilterBar } from "@/components/analytics/CategoryFilterBar";
import { CategoryList } from "@/components/analytics/CategoryList";
import { useCategoryAnalytics } from "@/hooks/useCategoryAnalytics";
import { useCategorySpending } from "@/hooks/useCategorySpending";
import { useUncategorizedSummary } from "@/hooks/useUncategorizedSummary";
import { Tag } from "@/types/tags";
import { TagCreateDialog } from "@/components/tags/TagCreateDialog";
import { useToast } from "@/hooks/use-toast";

const Categories = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  const { sortOption, setSortOption, filters, updateFilter, clearFilters } = useCategoryAnalytics();
  const formattedDate = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const { toast } = useToast();

  const { data: categorySpending, isLoading: isCategoryLoading } = useCategorySpending(formattedDate);
  const { data: uncategorizedSummary } = useUncategorizedSummary();

  const handleTagSelect = (tag: Tag) => {
    const updatedTags = [...filters.tags, tag];
    updateFilter('tags', updatedTags);
  };

  const handleTagDeselect = (tagId: string) => {
    const updatedTags = filters.tags.filter(tag => tag.id !== tagId);
    updateFilter('tags', updatedTags);
  };

  const handleCreateTagClick = () => {
    setIsCreateTagDialogOpen(true);
  };

  const handleCreateTagSuccess = () => {
    toast({
      title: "Tag created",
      description: "Your new tag has been created successfully.",
    });
    setIsCreateTagDialogOpen(false);
  };

  const totalAmount = categorySpending?.reduce((sum, cat) => sum + (cat.total_amount || 0), 0) || 0;

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
        onCreateTagClick={handleCreateTagClick}
      />

      <TotalSpending 
        amount={totalAmount}
        isLoading={isCategoryLoading} 
      />

      <CategoryList 
        categories={categorySpending || []}
        isLoading={isCategoryLoading}
        filters={filters}
        sortOption={sortOption}
      />

      <TagCreateDialog
        open={isCreateTagDialogOpen}
        onOpenChange={setIsCreateTagDialogOpen}
        onSuccess={handleCreateTagSuccess}
      />
    </div>
  );
};

export default Categories;