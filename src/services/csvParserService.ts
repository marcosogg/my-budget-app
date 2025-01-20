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
const RENT_KEYWORDS = ['trading places', 'rent'];
const RENT_AMOUNT = 2200; // Positive value for comparison
const ADJUSTED_RENT_AMOUNT = 1000;

const isRentTransaction = (transaction: Transaction): boolean => {
  const description = transaction.description?.toLowerCase().trim() || '';

  const hasTradingPlaces = description.includes('trading places');

  // Use a tolerance to handle floating point precision
  const isCorrectAmount = Math.abs(transaction.amount + RENT_AMOUNT) < 0.01;

  console.log('Rent transaction check:', {
    description,
    hasTradingPlaces,
    amount: transaction.amount,
    isCorrectAmount,
  });

  return hasTradingPlaces && isCorrectAmount;
};

const adjustRentTransaction = (transaction: Transaction): Transaction => {
  if (isRentTransaction(transaction)) {
    console.log('Adjusting rent transaction amount from', transaction.amount, 'to', -ADJUSTED_RENT_AMOUNT);
    return {
      ...transaction,
      amount: -ADJUSTED_RENT_AMOUNT, // Keep negative sign for expenses
      description: `${transaction.description} ⚡ (adjusted)`, // Adding indicators
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
          console.log(`Parsing field ${field}: value = "${value}"`);
          const numericValue = value.replace(/,/g, '');
          const parsedNumber = parseFloat(numericValue);
          console.log(`Parsed number: ${parsedNumber}`);
          return parsedNumber;
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
          .filter(t => t.state === 'COMPLETED' && t.completed_date && t.started_date)
          .map(adjustRentTransaction);
        console.log('Filtered completed transactions count:', transactions.length);
        resolve(transactions);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
