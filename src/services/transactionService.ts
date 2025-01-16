import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transaction } from '@/types/transaction';

export const clearExistingData = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    console.log('Current user:', user);
    
    if (!user) {
      console.error('No authenticated user found');
      toast.error('Please sign in to manage transactions');
      return false;
    }

    // First, delete categorized transactions
    const { error: categorizedError } = await supabase
      .from('categorized_transactions')
      .delete()
      .eq('user_id', user.id);

    if (categorizedError) {
      console.error('Error clearing categorized transactions:', categorizedError);
      toast.error('Failed to clear existing categorized transactions');
      return false;
    }

    // Then, delete transactions
    const { error: transactionsError } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', user.id);

    if (transactionsError) {
      console.error('Error clearing transactions:', transactionsError);
      toast.error('Failed to clear existing transactions');
      return false;
    }

    console.log('Successfully cleared existing transactions and their categorizations');
    return true;
  } catch (error) {
    console.error('Error in clearExistingData:', error);
    toast.error('Failed to clear existing data');
    return false;
  }
};

export const saveTransactions = async (transactions: Transaction[], userId: string): Promise<boolean> => {
  const { error } = await supabase.from('transactions').insert(
    transactions.map(t => ({
      user_id: userId,
      type: t.type,
      product: t.product,
      started_date: t.started_date,
      completed_date: t.completed_date,
      description: t.description,
      amount: t.amount,
      fee: t.fee,
      currency: t.currency,
      state: t.state,
      balance: t.balance
    }))
  );

  if (error) {
    console.error('Error saving transactions:', error);
    toast.error('Failed to save transactions');
    return false;
  }

  console.log('Transactions saved successfully');
  return true;
};