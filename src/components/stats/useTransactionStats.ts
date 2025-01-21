import { useMemo } from 'react';
import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';

interface TransactionStats {
  cardPayments: {
    amount: number;
    count: number;
  };
  savingsTotal: {
    amount: number;
    count: number;
  };
  creditCardRepayments: {
    amount: number;
    count: number;
  };
}

export const useTransactionStats = (
  transactions: Transaction[],
  categories: Category[] = []
) => {
  const stats = useMemo(() => {
    const initialStats: TransactionStats = {
      cardPayments: { amount: 0, count: 0 },
      savingsTotal: { amount: 0, count: 0 },
      creditCardRepayments: { amount: 0, count: 0 },
    };

    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'CARD_PAYMENT') {
        acc.cardPayments.amount += transaction.amount;
        acc.cardPayments.count += 1;
      } else if (transaction.product === 'Savings') {
        acc.savingsTotal.amount += transaction.amount;
        acc.savingsTotal.count += 1;
      } else if (
        transaction.type === 'TRANSFER' &&
        transaction.description?.toLowerCase().includes('credit card repayment')
      ) {
        acc.creditCardRepayments.amount += transaction.amount;
        acc.creditCardRepayments.count += 1;
      }
      return acc;
    }, initialStats);
  }, [transactions]);

  const dates = useMemo(() => {
    const dates = transactions
      .map(t => t.completed_date ? new Date(t.completed_date) : null)
      .filter((date): date is Date => date !== null);

    return {
      firstTransactionDate: dates.length ? new Date(Math.min(...dates.map(d => d.getTime()))) : null,
      lastTransactionDate: dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : null,
    };
  }, [transactions]);

  return {
    stats,
    ...dates,
  };
};