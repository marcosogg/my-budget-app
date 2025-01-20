import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';

interface TransactionStat {
  amount: number;
  count: number;
}

interface TransactionStats {
  cardPayments: TransactionStat;
  savingsTotal: TransactionStat;
  creditCardRepayments: TransactionStat;
}

export const useTransactionStats = (transactions: Transaction[], categories: Category[] = []) => {
  const stats: TransactionStats = {
    cardPayments: { amount: 0, count: 0 },
    savingsTotal: { amount: 0, count: 0 },
    creditCardRepayments: { amount: 0, count: 0 },
  };

  let firstTransactionDate: Date | null = null;
  let lastTransactionDate: Date | null = null;

  transactions.forEach((transaction) => {
    if (transaction.completed_date) {
      const date = new Date(transaction.completed_date);
      
      if (!firstTransactionDate || date < firstTransactionDate) {
        firstTransactionDate = date;
      }
      if (!lastTransactionDate || date > lastTransactionDate) {
        lastTransactionDate = date;
      }

      if (transaction.type === 'CARD_PAYMENT') {
        stats.cardPayments.amount += Math.abs(transaction.amount);
        stats.cardPayments.count++;
      } else if (transaction.product === 'Savings') {
        stats.savingsTotal.amount += Math.abs(transaction.amount);
        stats.savingsTotal.count++;
      } else if (
        transaction.type === 'TRANSFER' &&
        transaction.description?.toLowerCase().includes('credit card repayment')
      ) {
        stats.creditCardRepayments.amount += Math.abs(transaction.amount);
        stats.creditCardRepayments.count++;
      }
    }
  });

  return {
    stats,
    firstTransactionDate,
    lastTransactionDate,
  };
};