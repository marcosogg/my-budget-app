import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const getTransactionIcon = (amount: number) => {
  if (amount > 0) return <ArrowUpIcon className="h-4 w-4 text-transaction-income" />;
  if (amount < 0) return <ArrowDownIcon className="h-4 w-4 text-transaction-expense" />;
  return <MinusIcon className="h-4 w-4 text-transaction-neutral" />;
};

export const getTransactionColor = (amount: number): string => {
  if (amount > 0) return "text-transaction-income";
  if (amount < 0) return "text-transaction-expense";
  return "text-transaction-neutral";
};