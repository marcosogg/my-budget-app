import { useState, useMemo } from 'react';
import { CategorizedTransaction, Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';

type SortOption = "date-asc" | "date-desc" | "amount-asc" | "amount-desc" | "";

export const useTransactionSort = (transactions: (CategorizedTransaction & { 
  transactions: Transaction, 
  categories: Category 
})[]) => {
  const [sortOption, setSortOption] = useState<SortOption>("");

  const sortedTransactions = useMemo(() => {
    let sorted = [...transactions];

    switch (sortOption) {
      case "date-asc":
        sorted.sort((a, b) => 
          new Date(a.transactions.completed_date || '').getTime() - 
          new Date(b.transactions.completed_date || '').getTime()
        );
        break;
      case "date-desc":
        sorted.sort((a, b) => 
          new Date(b.transactions.completed_date || '').getTime() - 
          new Date(a.transactions.completed_date || '').getTime()
        );
        break;
      case "amount-asc":
        sorted.sort((a, b) => a.transactions.amount - b.transactions.amount);
        break;
      case "amount-desc":
        sorted.sort((a, b) => b.transactions.amount - a.transactions.amount);
        break;
    }

    return sorted;
  }, [transactions, sortOption]);

  return {
    sortOption,
    setSortOption,
    sortedTransactions,
  };
};