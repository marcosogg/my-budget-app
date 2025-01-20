import { format } from 'date-fns';
import { ArrowDown, ArrowUp } from 'lucide-react';

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

// Amount formatting
export const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatEuroAmount = (amount: number): string => {
  return formatAmount(amount, 'EUR');
};

export const formatTransactionCount = (count: number): string => {
  return new Intl.NumberFormat('en-IE').format(count);
};

// Transaction display helpers
export const getTransactionColor = (amount: number): string => {
  if (amount > 0) return 'text-transaction-income';
  if (amount < 0) return 'text-transaction-expense';
  return 'text-transaction-neutral';
};

export const getTransactionIcon = (amount: number): JSX.Element => {
  if (amount > 0) {
    return <ArrowUp className="w-4 h-4 text-transaction-income" />;
  }
  return <ArrowDown className="w-4 h-4 text-transaction-expense" />;
};