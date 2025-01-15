import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthPicker } from "@/components/analytics/MonthPicker";
import { CategorySummaryGrid } from "@/components/analytics/CategorySummaryGrid";
import { TotalSpending } from "@/components/analytics/TotalSpending";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format the date as a proper ISO timestamp for the start of the month
  const formattedDate = format(startOfMonth(selectedDate), "yyyy-MM-dd'T'HH:mm:ss'Z'");

  const { data: totalSpending, isLoading: isTotalLoading } = useQuery({
    queryKey: ["monthly-total-spending", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_total_spending")
        .select("*")
        .eq("month", formattedDate);
      
      if (error) throw error;
      return data[0];
    },
  });

  const { data: categorySpending, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["monthly-category-spending", format(selectedDate, "yyyy-MM")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("monthly_category_spending")
        .select("*")
        .eq("month", formattedDate);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Monthly Spending Summary</h1>
        <MonthPicker value={selectedDate} onChange={setSelectedDate} />
      </div>

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