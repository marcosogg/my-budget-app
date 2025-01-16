import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tag } from "@/types/tags";

interface CategorySpending {
  category_id: string;
  category_name: string;
  total_amount: number;
  transaction_count: number;
  type: 'expense' | 'uncategorized';
  tags?: Tag[];
}

interface MonthlySpendingResponse {
  id: string;
  name: string;
  monthly_category_spending: {
    total_amount: number;
    transaction_count: number;
    type: 'expense' | 'uncategorized';
    month: string;
  }[];
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
        const transformedData = (spendingData as MonthlySpendingResponse[])?.map(category => ({
          category_id: category.id,
          category_name: category.name,
          total_amount: category.monthly_category_spending[0]?.total_amount || 0,
          transaction_count: category.monthly_category_spending[0]?.transaction_count || 0,
          type: category.monthly_category_spending[0]?.type || 'expense'
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
        return categoriesWithTags as CategorySpending[];
      } catch (error) {
        console.error("Query Exception:", error);
        console.groupEnd();
        throw error;
      }
    },
  });
};