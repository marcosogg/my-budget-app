import Papa from 'papaparse';
import { Transaction } from '@/types/transaction';
import { parseDate } from '@/utils/dateParser';

export const parseCSV = async (fileContent: string): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const transactions = results.data
          .map((row: any) => {
            const completedDate = parseDate(row['Completed Date']);
            if (!completedDate) {
              console.warn(`Skipping row with invalid date: ${row['Completed Date']}`);
              return null;
            }

            let amount = parseFloat(row['Amount']);
            if (isNaN(amount)) {
              console.warn(`Skipping row with invalid amount: ${row['Amount']}`);
              return null;
            }

            // Corrected rent adjustment logic:
            if (row['Description'] === "To Trading Places" && amount === -2200.00) {
              amount = -1000.00;
              row['Description'] = `⚡${row['Description']} (adjusted)`;
            }

            return {
              type: row['Type'],
              product: row['Product'],
              started_date: parseDate(row['Started Date']),
              completed_date: completedDate,
              description: row['Description'],
              amount: amount, // Use the potentially modified amount
              fee: parseFloat(row['Fee']) || 0,
              currency: row['Currency'],
              state: row['State'],
              balance: parseFloat(row['Balance']) || 0,
            } as Transaction;
          })
          .filter((transaction): transaction is Transaction => transaction !== null);

        resolve(transactions);
      },
      error: (error: Error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      },
    });
  });
};
