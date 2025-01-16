import { format } from 'date-fns';

export const formatEuroDate = (dateStr: string | null): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return '';
  }
};

export const formatEuroAmount = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatTransactionCount = (count: number): string => {
  return new Intl.NumberFormat('de-DE').format(count);
};