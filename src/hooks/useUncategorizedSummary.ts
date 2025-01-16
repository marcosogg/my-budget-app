import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUncategorizedSummary = () => {
  return useQuery({
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
};