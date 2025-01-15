import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TransactionTable from "@/components/TransactionTable";
import { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const Transactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filterType, setFilterType] = useState<string>("");
  const [filterDescription, setFilterDescription] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>("");

  const handleSortOptionChange = (value: string) => {
    setSortOption(value);
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
  };

  const handleFilterDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDescription(event.target.value);
  };

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

      return data.map(transaction => ({
        id: transaction.id,
        user_id: transaction.user_id,
        type: transaction.type,
        product: transaction.product,
        started_date: transaction.started_date,
        completed_date: transaction.completed_date,
        description: transaction.description,
        amount: transaction.amount,
        fee: transaction.fee,
        currency: transaction.currency,
        state: transaction.state,
        balance: transaction.balance,
        created_at: transaction.created_at,
      })) as Transaction[];
    },
  });

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filterType) {
      filtered = filtered.filter(transaction =>
        transaction.type.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    if (filterDescription) {
      filtered = filtered.filter(transaction =>
        transaction.description?.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(transaction => {
        if (!transaction.completed_date) return false;
        const transactionDate = new Date(transaction.completed_date);
        return (
          transactionDate.getFullYear() === filterDate.getFullYear() &&
          transactionDate.getMonth() === filterDate.getMonth() &&
          transactionDate.getDate() === filterDate.getDate()
        );
      });
    }

    return filtered;
  }, [transactions, filterType, filterDescription, filterDate]);

  const sortedTransactions = useMemo(() => {
    let sorted = [...filteredTransactions];

    if (sortOption === "date-asc") {
      sorted.sort((a, b) => {
        const dateA = a.completed_date ? new Date(a.completed_date).getTime() : 0;
        const dateB = b.completed_date ? new Date(b.completed_date).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortOption === "date-desc") {
      sorted.sort((a, b) => {
        const dateA = a.completed_date ? new Date(a.completed_date).getTime() : 0;
        const dateB = b.completed_date ? new Date(b.completed_date).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === "amount-asc") {
      sorted.sort((a, b) => a.amount - b.amount);
    } else if (sortOption === "amount-desc") {
      sorted.sort((a, b) => b.amount - a.amount);
    }

    return sorted;
  }, [filteredTransactions, sortOption]);

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
        <div className="w-[100px]" /> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-wrap gap-4">
        <Select onValueChange={handleSortOptionChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date (Ascending)</SelectItem>
            <SelectItem value="date-desc">Date (Descending)</SelectItem>
            <SelectItem value="amount-asc">Amount (Ascending)</SelectItem>
            <SelectItem value="amount-desc">Amount (Descending)</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleFilterTypeChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            {transactions.map((transaction) => (
              <SelectItem key={transaction.type} value={transaction.type}>
                {transaction.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Filter by Description"
          value={filterDescription}
          onChange={handleFilterDescriptionChange}
          className="w-[200px]"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !filterDate && "text-muted-foreground"
              )}
            >
              {filterDate ? format(filterDate, "dd/MM/yyyy") : "Filter by Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filterDate}
              onSelect={setFilterDate}
              className="border-0"
            />
          </PopoverContent>
        </Popover>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found matching your criteria.</p>
        </div>
      ) : (
        <>
          <TransactionTable transactions={sortedTransactions} />
        </>
      )}
    </div>
  );
};

export default Transactions;
