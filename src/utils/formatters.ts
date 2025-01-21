import { format } from 'date-fns';

// Date formatting
export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return '';
  }
};

// Currency formatting with currency parameter
export const formatAmount = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Transaction color helper
export const getTransactionColor = (amount: number): string => {
  if (amount > 0) return 'text-transaction-income';
  if (amount < 0) return 'text-transaction-expense';
  return 'text-transaction-neutral';
};

// Icon color helper
export const getTransactionIconColor = (amount: number): string => {
  return amount > 0 ? 'text-transaction-income' : 'text-transaction-expense';
};

// Count formatting
export const formatTransactionCount = (count: number): string => {
  return new Intl.NumberFormat('en-IE').format(count);
};