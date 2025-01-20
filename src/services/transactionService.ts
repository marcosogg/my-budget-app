import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';

export const clearExistingData = async (): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error: deleteTransactionsError } = await supabase
            .from('transactions')
            .delete()
            .eq('user_id', user.id);

        if (deleteTransactionsError) {
            console.error('Error deleting existing transactions:', deleteTransactionsError);
            return false;
        }

        const { error: deleteCategorizedError } = await supabase
            .from('categorized_transactions')
            .delete()
            .eq('user_id', user.id);

        if (deleteCategorizedError) {
            console.error('Error deleting existing categorized transactions:', deleteCategorizedError);
            return false;
        }

        console.log('Successfully cleared existing transactions and their categorizations');
        return true;
    } else {
        console.error('User not authenticated');
        return false;
    }
};

export const saveTransactions = async (transactions: Transaction[], userId: string): Promise<Transaction[]> => {
    const transactionsToInsert = transactions.map(transaction => ({
        ...transaction,
        user_id: userId
    }));

    const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select();

    if (error) {
        console.error('Error saving transactions:', error);
        throw error;
    }
    
    return data as Transaction[];
};
