import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag } from "@/types/tags";

interface CategorySpending {
  category_name: string;
  total_amount: number;
  transaction_count: number;
  type: 'expense' | 'uncategorized';
  tags?: Tag[];
}

export const useCategorySpending = (formattedDate: string) => {
  return useQuery({
    queryKey: ["monthly-category-spending", formattedDate],
    queryFn: async () => {
      console.group("Category Spending Query");
      const startTime = new Date().toISOString();
      console.log("Query Start:", startTime);
      console.log("Parameters:", { month: formattedDate });

      try {
        // Query the monthly_category_spending view directly
        const { data: spendingData, error: spendingError } = await supabase
          .from("monthly_category_spending")
          .select("*")
          .eq('month', formattedDate);

        if (spendingError) throw spendingError;

        // Get all categories with their tags
        const { data: categoriesWithTags, error: tagsError } = await supabase
          .from('categories')
          .select(`
            name,
            category_tags(
              tags(*)
            )
          `);

        if (tagsError) throw tagsError;

        // Create a map of category names to their tags
        const categoryTagsMap = new Map(
          categoriesWithTags?.map(category => [
            category.name,
            category.category_tags?.map(ct => ct.tags) || []
          ])
        );

        // Transform the data to include tags
        const transformedData = spendingData?.map(spending => ({
          category_name: spending.category_name,
          total_amount: spending.total_amount,
          transaction_count: spending.transaction_count,
          type: spending.type,
          tags: categoryTagsMap.get(spending.category_name) || []
        })) || [];

        console.log("Query Success - Row Count:", transformedData.length);
        console.log("Query End:", new Date().toISOString());
        console.groupEnd();
        return transformedData as CategorySpending[];
      } catch (error) {
        console.error("Query Exception:", error);
        console.groupEnd();
        throw error;
      }
    },
  });
};