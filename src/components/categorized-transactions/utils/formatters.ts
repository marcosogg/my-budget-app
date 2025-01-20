import { format } from 'date-fns';

export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return '';
  }
};

export const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const getTransactionColor = (amount: number) => {
  if (amount > 0) return 'text-transaction-income';
  if (amount < 0) return 'text-transaction-expense';
  return 'text-transaction-neutral';
};