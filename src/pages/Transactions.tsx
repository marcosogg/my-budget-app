import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TransactionTable from "@/components/TransactionTable";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { FilterBar } from "./transactions/components/FilterBar";
import { useTransactionFilters } from "./transactions/hooks/useTransactionFilters";
import CategorizedTransactionTable from "@/components/categorized-transactions/CategorizedTransactionTable";

const Transactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('completed_date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transactions",
        });
        throw error;
      }

      return data as Transaction[];
    },
  });

  const {
    filterDescription,
    setFilterDescription,
    filterDate,
    setFilterDate,
    sortOption,
    setSortOption,
    filteredTransactions,
  } = useTransactionFilters(transactions);

  if (isLoading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
        </div>
        <div className="w-[100px]" />
      </div>

      <FilterBar
        description={filterDescription}
        onDescriptionChange={setFilterDescription}
        date={filterDate}
        onDateChange={setFilterDate}
        onSortChange={setSortOption}
      />

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found matching your criteria.</p>
        </div>
      ) : (
        <CategorizedTransactionTable />
      )}
    </div>
  );
};

export default Transactions;