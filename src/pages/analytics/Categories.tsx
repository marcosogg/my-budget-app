import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { CategorySummaryGrid } from "@/components/analytics/CategorySummaryGrid";
import { TotalSpending } from "@/components/analytics/TotalSpending";
import { UncategorizedAlert } from "@/components/analytics/UncategorizedAlert";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const formattedDate = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  // Total Spending Query with Debug Logging
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
        const { data, error, status } = await supabase
          .from("monthly_category_spending")
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
        return data;
      } catch (error) {
        console.error("Query Exception:", error);
        console.groupEnd();
        throw error;
      }
    },
  });

  // Uncategorized Summary Query with Debug Logging
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
          .single();

        console.log("Response Status:", status);
        if (error) {
          console.error("Query Error:", error);
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

      <TotalSpending 
        amount={totalSpending?.total_amount || 0} 
        isLoading={isTotalLoading} 
      />

      <CategorySummaryGrid 
        categories={categorySpending || []} 
        isLoading={isCategoryLoading} 
      />
    </div>
  );
};

export default Categories;