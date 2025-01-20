import { useState, useMemo } from 'react';
import { CategorizedTransaction, Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';

type FilterState = {
  category: string;
  description: string;
  date: Date | undefined;
  expensesOnly: boolean;
};

export const useTransactionFilters = (transactions: (CategorizedTransaction & { 
  transactions: Transaction, 
  categories: Category 
})[]) => {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    description: "",
    date: undefined,
    expensesOnly: false,
  });

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply expenses-only filter first
    if (filters.expensesOnly) {
      filtered = filtered.filter(transaction =>
        transaction.transactions.amount < 0
      );
    }

    if (filters.category) {
      filtered = filtered.filter(transaction =>
        transaction.categories.name.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.description) {
      filtered = filtered.filter(transaction =>
        transaction.transactions.description?.toLowerCase().includes(filters.description.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.transactions.completed_date || '');
        return (
          transactionDate.getFullYear() === filters.date?.getFullYear() &&
          transactionDate.getMonth() === filters.date?.getMonth() &&
          transactionDate.getDate() === filters.date?.getDate()
        );
      });
    }

    return filtered;
  }, [transactions, filters]);

  const handleFilterChange = (type: keyof FilterState, value: string | Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleExpensesOnlyChange = (checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      expensesOnly: checked,
    }));
  };

  return {
    filters,
    filteredTransactions,
    handleFilterChange,
    handleExpensesOnlyChange,
  };
};