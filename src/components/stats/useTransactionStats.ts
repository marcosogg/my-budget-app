import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';
import { useMemo } from 'react';

export const useTransactionStats = (transactions: Transaction[], categories: Category[] = []) => {
  return useMemo(() => {
    // Get expense categories for proper categorization
    const expenseCategories = categories.filter(category => category.type === 'expense');
    
    const roundedTransactions = transactions.map(transaction => ({
      ...transaction,
      amount: parseFloat(transaction.amount.toFixed(1)),
    }));

    // Enhanced filtering with category awareness
    const payments = roundedTransactions.filter(t => t.amount < 0 && t.type === 'CARD_PAYMENT');
    const transfers = roundedTransactions.filter(t => t.type === 'TRANSFER' && t.description === 'Credit card repayment');
    const savings = roundedTransactions.filter(t => t.product === 'Savings' && t.amount > 0);

    const stats = {
      cardPayments: {
        amount: payments.reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
        count: payments.length,
      },
      savingsTotal: {
        amount: savings.reduce((acc, curr) => acc + curr.amount, 0),
        count: savings.length,
      },
      creditCardRepayments: {
        amount: transfers.reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
        count: transfers.length,
      },
    };

    const dates = transactions
      .map(t => new Date(t.completed_date || '').getTime())
      .sort((a, b) => a - b);

    const firstTransactionDate = dates.length > 0 ? new Date(dates[0]) : null;
    const lastTransactionDate = dates.length > 0 ? new Date(dates[dates.length - 1]) : null;

    return {
      stats,
      firstTransactionDate,
      lastTransactionDate,
      expenseCategories,
    };
  }, [transactions, categories]);
};