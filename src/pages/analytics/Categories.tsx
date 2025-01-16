import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { CategorySummaryGrid } from "@/components/analytics/CategorySummaryGrid";
import { TotalSpending } from "@/components/analytics/TotalSpending";
import { UncategorizedAlert } from "@/components/analytics/UncategorizedAlert";
import { CategoryFilterBar } from "@/components/analytics/CategoryFilterBar";
import { useCategoryAnalytics } from "@/hooks/useCategoryAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Categories = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { sortOption, setSortOption, filters, updateFilter, clearFilters } = useCategoryAnalytics();
  const formattedDate = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Subscribe to real-time changes
  useEffect(() => {
    console.log('Setting up real-time subscription for spending updates');
    
    const categorizedTransactionsChannel = supabase
      .channel('spending-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categorized_transactions'
        },
        () => {
          console.log('Categorized transaction changed, invalidating queries');
          queryClient.invalidateQueries({ queryKey: ['monthly-total-spending'] });
          queryClient.invalidateQueries({ queryKey: ['monthly-category-spending'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      categorizedTransactionsChannel.unsubscribe();
    };
  }, [queryClient]);

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
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load total spending data",
          });
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

  const { data: categorySpending, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["monthly-category-spending", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      console.group("Category Spending Query");
      const startTime = new Date().toISOString();
      console.log("Query Start:", startTime);
      console.log("Parameters:", { month: formattedDate });

      try {
        const { data, error, status } = await supabase
          .from("monthly_category_spending")
          .select("*")
          .eq("month", formattedDate);

        console.log("Response Status:", status);
        if (error) {
          console.error("Query Error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load category spending data",
          });
          throw error;
        }

        console.log("Query Success - Row Count:", data?.length);
        console.log("Query End:", new Date().toISOString());
        console.groupEnd();
        return data || [];
      } catch (error) {
        console.error("Query Exception:", error);
        console.groupEnd();
        throw error;
      }
    },
  });

  const { data: uncategorizedSummary } = useQuery({
    queryKey: ["uncategorized-summary"],
    queryFn: async () => {
      console.group("Uncategorized Summary Query");
      const startTime = new Date().toISOString();
      console.log("Query Start:", startTime);

      try {
        const { data, error, status } = await supabase
          .from("uncategorized_summary")
          .select("*")
          .maybeSingle();

        console.log("Response Status:", status);
        if (error) {
          console.error("Query Error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load uncategorized summary",
          });
          throw error;
        }

        console.log("Query Success");
        console.log("Query End:", new Date().toISOString());
        console.groupEnd();
        return data;
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