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

const adjustRentTransaction = (transaction: Transaction): Transaction => {
  if (
    transaction.description?.toLowerCase().includes('rent') &&
    transaction.amount === 2200
  ) {
    return {
      ...transaction,
      amount: 1000,
      description: `${transaction.description} ⚡`, // Adding indicator for adjusted transactions
    };
  }
  return transaction;
};

export const parseCSV = (text: string): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    parse(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        console.log('Transforming header:', header, 'to:', headerMap[header] || header);
        return headerMap[header] || header;
      },
      transform: (value, field) => {
        if (field === 'amount' || field === 'fee' || field === 'balance') {
          return parseFloat(value);
        }
        if (field === 'completed_date' || field === 'started_date') {
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
          .filter(t => 
            t.state === 'COMPLETED' && 
            t.completed_date && 
            t.started_date &&
            t.amount < 0 // Only include negative transactions
          )
          .map(adjustRentTransaction);
        resolve(transactions);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};