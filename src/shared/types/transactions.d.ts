import { Category } from '@/types/categorization';

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

export interface CategorizedTransactionData extends BaseTransaction {
  categories: Category;
  transactions: BaseTransaction;
}

export interface TransactionFilters {
  type?: string;
  product?: string;
  description?: string;
  date?: Date;
  expensesOnly?: boolean;
  category?: string;
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