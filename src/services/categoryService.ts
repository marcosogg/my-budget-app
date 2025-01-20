import { supabase } from '@/integrations/supabase/client';
import { CategorizedTransaction, Category } from '@/types/categorization';
import { Transaction } from '@/types/transaction';

export type CategorizedTransactionWithDetails = CategorizedTransaction & { 
  transactions: Transaction, 
  categories: Category 
};

export const categoryService = {
  async fetchCategorizedTransactions(): Promise<CategorizedTransactionWithDetails[]> {
    const { data, error } = await supabase
      .from('categorized_transactions')
      .select('*, transactions(*), categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as CategorizedTransactionWithDetails[];
  },

  async updateTransactionCategory(
    transactionId: string,
    categoryId: string,
  ): Promise<void> {
    const { data: transaction, error: fetchError } = await supabase
      .from('categorized_transactions')
      .select('user_id, transactions(description)')
      .eq('id', transactionId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('categorized_transactions')
      .update({ category_id: categoryId })
      .eq('id', transactionId);

    if (updateError) throw updateError;

    // Only update mapping if description exists
    if (transaction?.transactions?.description) {
      const { error: mappingError } = await supabase
        .from('description_category_mappings')
        .upsert({
          description: transaction.transactions.description,
          category_id: categoryId,
          user_id: transaction.user_id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'description,user_id',
        });

      if (mappingError) throw mappingError;
    }
  }
};