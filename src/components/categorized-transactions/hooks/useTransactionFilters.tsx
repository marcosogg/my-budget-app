import { useState, useMemo } from 'react';
import { CategorizedTransactionData, TransactionFilters, isExpenseTransaction } from '@/shared/types/transactions';

export const useTransactionFilters = (transactions: CategorizedTransactionData[]) => {
  const [filters, setFilters] = useState<TransactionFilters>({
    category: "",
    description: "",
    date: undefined,
    expensesOnly: false,
  });

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filters.expensesOnly) {
      filtered = filtered.filter(isExpenseTransaction);
    }

    if (filters.category) {
      filtered = filtered.filter(transaction =>
        transaction.categories.name.toLowerCase().includes(filters.category?.toLowerCase() || '')
      );
    }

    if (filters.description) {
      filtered = filtered.filter(transaction =>
        transaction.transactions.description?.toLowerCase().includes(filters.description?.toLowerCase() || '')
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

  const handleFilterChange = (type: keyof TransactionFilters, value: string | Date | undefined) => {
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