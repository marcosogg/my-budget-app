import { parse } from 'papaparse';
import { Transaction } from '@/types/transaction';
import { parseCustomDate } from '@/utils/dateParser';
import { supabase } from '@/integrations/supabase/client';
import { saveTransactions } from './transactionService';

// Mapping of CSV headers to internal field names
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

// Configuration for rent transaction identification
const RENT_DESCRIPTION = 'To Trading Places';
const RENT_AMOUNT = -2200;
const ADJUSTED_RENT_AMOUNT = -1000;

// Function to check if a transaction is a rent transaction
const isRentTransaction = (transaction: Transaction): boolean => {
  const description = transaction.description?.toLowerCase().trim() || '';
  return description === RENT_DESCRIPTION.toLowerCase() && transaction.amount === RENT_AMOUNT;
};

// Function to adjust the rent transaction
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

// Function to update the category mapping in the database
async function updateCategoryMapping(userId: string, transaction: Transaction) {
  if (!transaction.description || !transaction.completed_date) {
    console.error("Transaction description or completed_date is missing");
    return;
  }

  try {
    const { error } = await supabase
      .from("description_category_mappings")
      .upsert(
        {
          user_id: userId,
          description: transaction.description,
          category_id: "4c242882-1c6e-4675-aa60-e5e80abdffba", //  "your_rent_category_id"
          last_used_date: transaction.completed_date.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "description,user_id" }
      );

    if (error) {
      console.error("Error updating description_category_mappings:", error);
    } else {
      console.log("Updated description_category_mappings for:", transaction.description);
    }
  } catch (err) {
    console.error("Unexpected error updating description_category_mappings:", err);
  }
}

// Function to parse the CSV file content
export const parseCSV = (text: string): Promise<Transaction[]> => {
    return new Promise((resolve, reject) => {
      parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => headerMap[header] || header,
        transform: (value, field) => {
          if (['amount', 'fee', 'balance'].includes(field)) {
            const numericValue = parseFloat(value.replace(/,/g, ''));
            return isNaN(numericValue) ? null : numericValue;
          }
          if (['completed_date', 'started_date'].includes(field)) {
            const parsedDate = parseCustomDate(value);
            return parsedDate || null;
          }
          return value;
        },
        complete: async (results) => {
          const { data: { session } } = await supabase.auth.getSession();
          const user = session?.user;
          if (!user) {
            console.error('No authenticated user found during CSV parsing');
            reject('User not authenticated');
            return;
          }
  
          const transactions = (results.data as any[])
            .filter(row => row.state === 'COMPLETED' && row.completed_date && row.started_date)
            .map((row: { [key: string]: any }): Transaction => ({
              id: generateUniqueId(),
              user_id: user.id,
              type: row.type,
              product: row.product,
              started_date: row.started_date,
              completed_date: row.completed_date,
              description: row.description,
              amount: row.amount,
              fee: row.fee,
              currency: row.currency,
              state: row.state,
              balance: row.balance,
            }));
  
          try {
            // Save transactions first
            const savedTransactions = await saveTransactions(transactions, user.id);
            console.log('Transactions saved successfully:', savedTransactions);
  
            // Then update mappings based on saved transactions
            for (const transaction of savedTransactions) {
              const adjustedTransaction = adjustRentTransaction(transaction);
              if (adjustedTransaction !== transaction) {
                await updateCategoryMapping(user.id, adjustedTransaction);
              }
            }
  
            resolve(savedTransactions);
          } catch (error) {
            console.error('Error saving transactions or updating mappings:', error);
            reject(error);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        },
      });
    });
  };

// Function to generate a unique ID (consider using a library like `uuid` in a real app)
function generateUniqueId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
