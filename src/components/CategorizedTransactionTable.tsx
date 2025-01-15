import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category, CategorizedTransaction } from '@/types/categorization';
import { useToast } from '@/components/ui/use-toast';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CategorizedTransactionTableProps {
  
}

const CategorizedTransactionTable = ({}: CategorizedTransactionTableProps) => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterDescription, setFilterDescription] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>("");

  const { data: categorizedTransactions = [], isLoading, error } = useQuery({
    queryKey: ['categorizedTransactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorized_transactions')
        .select('*, transactions(*), categories(*)')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categorized transactions",
        });
        throw error;
      }

      return data as (CategorizedTransaction & { transactions: Transaction, categories: Category })[];
    },
  });

  const filteredTransactions = useMemo(() => {
    let filtered = [...categorizedTransactions];

    if (filterCategory) {
      filtered = filtered.filter(transaction =>
        transaction.categories.name.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }

    if (filterDescription) {
      filtered = filtered.filter(transaction =>
        transaction.transactions.description?.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.transactions.completed_date || '');
        return (
          transactionDate.getFullYear() === filterDate.getFullYear() &&
          transactionDate.getMonth() === filterDate.getMonth() &&
          transactionDate.getDate() === filterDate.getDate()
        );
      });
    }

    return filtered;
  }, [categorizedTransactions, filterCategory, filterDescription, filterDate]);

  const sortedTransactions = useMemo(() => {
    let sorted = [...filteredTransactions];

    if (sortOption === "date-asc") {
      sorted.sort((a, b) => new Date(a.transactions.completed_date || '').getTime() - new Date(b.transactions.completed_date || '').getTime());
    } else if (sortOption === "date-desc") {
      sorted.sort((a, b) => new Date(b.transactions.completed_date || '').getTime() - new Date(a.transactions.completed_date || '').getTime());
    } else if (sortOption === "amount-asc") {
      sorted.sort((a, b) => a.transactions.amount - b.transactions.amount);
    } else if (sortOption === "amount-desc") {
      sorted.sort((a, b) => b.transactions.amount - a.transactions.amount);
    }

    return sorted;
  }, [filteredTransactions, sortOption]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Error parsing date:', dateStr, error);
      return '';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const getTransactionIcon = (amount: number) => {
    if (amount > 0) {
      return <ArrowUp className="w-4 h-4 text-transaction-income" />;
    }
    return <ArrowDown className="w-4 h-4 text-transaction-expense" />;
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-transaction-income';
    if (amount < 0) return 'text-transaction-expense';
    return 'text-transaction-neutral';
  };

  const handleFilterCategoryChange = (value: string) => {
    setFilterCategory(value);
  };

  const handleFilterDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDescription(e.target.value);
  };

  const handleSortOptionChange = (value: string) => {
    setSortOption(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading categorized transactions.</div>;
  }

  return (
    <div className="space-y-4">
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
        <Select onValueChange={handleFilterCategoryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {categorizedTransactions.map((transaction) => (
              <SelectItem key={transaction.categories.id} value={transaction.categories.name}>
                {transaction.categories.name}
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((categorizedTransaction) => (
              <TableRow key={categorizedTransaction.id}>
                <TableCell className="font-medium">{categorizedTransaction.categories.name}</TableCell>
                <TableCell>{formatDate(categorizedTransaction.transactions.completed_date)}</TableCell>
                <TableCell>{categorizedTransaction.transactions.description}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {getTransactionIcon(categorizedTransaction.transactions.amount)}
                    <span className={getAmountColor(categorizedTransaction.transactions.amount)}>
                      {formatAmount(Math.abs(categorizedTransaction.transactions.amount), categorizedTransaction.transactions.currency)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{categorizedTransaction.transactions.currency}</TableCell>
                <TableCell>{categorizedTransaction.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategorizedTransactionTable;