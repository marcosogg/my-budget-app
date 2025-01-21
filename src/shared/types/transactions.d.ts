import { Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';
import { CategorizedTransaction } from '@/types/categorization';

export interface BaseTransaction {
  id: string;
  user_id: string;
  type: string;
  product: string | null;
  started_date: string | null;
  completed_date: string | null;
  description: string | null;
  amount: number;
  fee: number | null;
  currency: string;
  state: string | null;
  balance: number;
  created_at: string;
}

export interface CategorizedTransactionData extends CategorizedTransaction {
  transactions: Transaction;
  categories: Category;
}

export interface TransactionFilters {
  category: string; // Made required
  description: string; // Made required
  date: Date | undefined;
  expensesOnly: boolean; // Made required
  type?: string;
  product?: string;
}

// Type guard for categorized transactions
export function isCategorizedTransaction(
  transaction: BaseTransaction | CategorizedTransactionData
): transaction is CategorizedTransactionData {
  return 'categories' in transaction && 'transactions' in transaction;
}

// Type guard for expense transactions
export function isExpenseTransaction(
  transaction: BaseTransaction | CategorizedTransactionData
): boolean {
  if (isCategorizedTransaction(transaction)) {
    return transaction.transactions.amount < 0;
  }
  return transaction.amount < 0;
}