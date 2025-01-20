import { addMonths } from "date-fns";
import { formatEuroDate } from "@/utils/formatters";

export const getNextDueDate = (dueDate: string, frequency: 'none' | 'monthly'): string => {
  if (frequency === 'none') return '-';
  const nextDate = addMonths(new Date(dueDate), 1);
  return formatEuroDate(nextDate.toISOString());
};