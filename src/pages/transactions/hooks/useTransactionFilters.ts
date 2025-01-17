import { useState, useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { useSearchParams } from 'react-router-dom';

export const useTransactionFilters = (transactions: Transaction[]) => {
  const [searchParams] = useSearchParams();
  const [filterDescription, setFilterDescription] = useState<string>("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>("");

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    const typeParam = searchParams.get('type');
    const productParam = searchParams.get('product');
    const descriptionParam = searchParams.get('description');

    // Filter by type (CARD_PAYMENT or TRANSFER)
    if (typeParam) {
      filtered = filtered.filter(t => t.type === typeParam);
      
      // Additional filter for CARD_PAYMENT to only show negative amounts
      if (typeParam === 'CARD_PAYMENT') {
        filtered = filtered.filter(t => t.amount < 0);
      }
      
      // If it's a TRANSFER with a specific description, filter by that too
      if (typeParam === 'TRANSFER' && descriptionParam) {
        filtered = filtered.filter(t => t.description === descriptionParam);
      }
    }

    // Filter by product (e.g., Savings)
    if (productParam) {
      filtered = filtered.filter(t => t.product === productParam);
    }

    // Filter by description search input
    if (filterDescription) {
      filtered = filtered.filter(transaction =>
        transaction.description?.toLowerCase().includes(filterDescription.toLowerCase())
      );
    }

    // Filter by date
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

    // Apply sorting
    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case "date-asc":
            return new Date(a.completed_date || '').getTime() - new Date(b.completed_date || '').getTime();
          case "date-desc":
            return new Date(b.completed_date || '').getTime() - new Date(a.completed_date || '').getTime();
          case "amount-asc":
            return a.amount - b.amount;
          case "amount-desc":
            return b.amount - a.amount;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [transactions, searchParams, filterDescription, filterDate, sortOption]);

  return {
    filterDescription,
    setFilterDescription,
    filterDate,
    setFilterDate,
    sortOption,
    setSortOption,
    filteredTransactions,
  };
};