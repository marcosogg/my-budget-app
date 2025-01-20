import { parse } from 'papaparse';
import { Transaction } from '@/types/transaction';
import { parseCustomDate } from '@/utils/dateParser';

const headerMap: { [key: string]: string } = {
  'Type': 'type',
  'Product': 'product',
  'Started Date': 'started_date',
  'Completed Date': 'completed_date',
  'Description': 'description',
  'Amount': 'amount',
  'Fee': 'fee',
  'Currency': 'currency',
  'State': 'state',
  'Balance': 'balance'
};

// Rent transaction identification configuration
const RENT_DESCRIPTION = 'To Trading Places';
const RENT_AMOUNT = -2200;
const ADJUSTED_RENT_AMOUNT = -1000;

const isRentTransaction = (transaction: Transaction): boolean => {
  const description = transaction.description?.toLowerCase().trim() || '';
  return description === RENT_DESCRIPTION.toLowerCase() && transaction.amount === RENT_AMOUNT;
};

const adjustRentTransaction = (transaction: Transaction): Transaction => {
  if (isRentTransaction(transaction)) {
    console.log('Adjusting rent transaction:', transaction);
    return {
      ...transaction,
      amount: ADJUSTED_RENT_AMOUNT,
      description: `⚡${transaction.description} (adjusted)`,
    };
  }
  return transaction;
};

export const parseCSV = (text: string): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => headerMap[header] || header,
      transform: (value, field) => {
        if (['amount', 'fee', 'balance'].includes(field)) {
          return parseFloat(value.replace(/,/g, ''));
        }
        if (['completed_date', 'started_date'].includes(field)) {
          const parsedDate = parseCustomDate(value);
          if (!parsedDate) {
            console.error('Failed to parse date:', value);
            return null;
          }
          return parsedDate;
        }
        return value;
      },
      complete: (results) => {
        const transactions = (results.data as Transaction[])
          .filter(t => t.state === 'COMPLETED' && t.completed_date && t.started_date)
          .map(adjustRentTransaction);
        console.log('Parsed transactions:', transactions);
        resolve(transactions);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      }
    });
  });
};
