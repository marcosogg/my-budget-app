import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { CategorySummaryGrid } from "@/components/analytics/CategorySummaryGrid";
import { TotalSpending } from "@/components/analytics/TotalSpending";
import { UncategorizedAlert } from "@/components/analytics/UncategorizedAlert";
import { CategoryFilterBar } from "@/components/analytics/CategoryFilterBar";
import { useCategoryAnalytics } from "@/hooks/useCategoryAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { Tag } from "@/types/tags";

const Categories = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sortOption, setSortOption, filters, updateFilter, clearFilters } = useCategoryAnalytics();
  const formattedDate = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  // Handle tag selection
  const handleTagSelect = (tag: Tag) => {
    const updatedTags = [...filters.tags, tag];
    updateFilter('tags', updatedTags);
  };

  const handleTagDeselect = (tagId: string) => {
    const updatedTags = filters.tags.filter(tag => tag.id !== tagId);
    updateFilter('tags', updatedTags);
  };

  const { data: totalSpending, isLoading: isTotalLoading } = useQuery({
    queryKey: ["monthly-total-spending", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      console.group("Total Spending Query");
      const startTime = new Date().toISOString();
      console.log("Query Start:", startTime);
      console.log("Parameters:", { month: formattedDate });

      try {
        const { data, error, status } = await supabase
          .from("monthly_total_spending")
          .select("*")
          .eq("month", formattedDate);

        console.log("Response Status:", status);
        if (error) {
          console.error("Query Error:", error);
          throw error;
        }

        console.log("Query Success - Row Count:", data?.length);
        console.log("Query End:", new Date().toISOString());
        console.groupEnd();
        return data[0];
      } catch (error) {
        console.error("Query Exception:", error);
        console.groupEnd();
        throw error;
      }
    },
  });

  // Category Spending Query with Debug Logging
  const { data: categorySpending, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["monthly-category-spending", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      console.group("Category Spending Query");
      const startTime = new Date().toISOString();
      console.log("Query Start:", startTime);
      console.log("Parameters:", { month: formattedDate });

      try {
        // First, get the categories with their spending data
        const { data: spendingData, error: spendingError } = await supabase
          .from("categories")
          .select(`
            id,
            name,
            monthly_category_spending!inner(
              total_amount,
              transaction_count,
              type,
              month
            )
          `)
          .eq('monthly_category_spending.month', formattedDate);

        if (spendingError) throw spendingError;

        // Transform the data to match the expected format
        const transformedData = spendingData?.map(category => ({
          category_name: category.name,
          total_amount: category.monthly_category_spending[0]?.total_amount || 0,
          transaction_count: category.monthly_category_spending[0]?.transaction_count || 0,
          type: category.monthly_category_spending[0]?.type || 'expense',
          category_id: category.id
        })) || [];

        // Fetch tags for each category
        const categoriesWithTags = await Promise.all(
          transformedData.map(async (category) => {
            const { data: tagData, error: tagError } = await supabase
              .from('category_tags')
              .select('tags(*)')
              .eq('category_id', category.category_id);

            if (tagError) throw tagError;

            return {
              ...category,
              tags: tagData?.map(t => t.tags) || []
            };
          })
        );

        console.log("Query Success - Row Count:", categoriesWithTags.length);
        console.log("Query End:", new Date().toISOString());
        console.groupEnd();
        return categoriesWithTags || [];
      } catch (error) {
        console.error("Query Exception:", error);
        console.groupEnd();
        throw error;
      }
    },
  });

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
        amount={totalSpending?.total_amount || 0} 
        isLoading={isTotalLoading} 
      />

      <CategorySummaryGrid 
        categories={filteredAndSortedCategories} 
        isLoading={isCategoryLoading} 
      />
    </div>
  );
};

export default Categories;