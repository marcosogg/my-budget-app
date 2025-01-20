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
    userId: string,
    description: string | null
  ): Promise<void> {
    // Update categorized transaction
    const { error: updateError } = await supabase
      .from('categorized_transactions')
      .update({ category_id: categoryId })
      .eq('id', transactionId);

    if (updateError) throw updateError;

    // Only update mapping if description exists
    if (description) {
      const { error: mappingError } = await supabase
        .from('description_category_mappings')
        .upsert({
          description: description,
          category_id: categoryId,
          user_id: userId,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'description,user_id',
        });

      if (mappingError) throw mappingError;
    }
  }
};