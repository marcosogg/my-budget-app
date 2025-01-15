import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, InfoIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import CategorizedTransactionTable from '@/components/CategorizedTransactionTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MappingDialog } from '@/components/mappings/MappingDialog';
import { UncategorizedTransactionList } from '@/components/categorize/UncategorizedTransactionList';
import { useCategories } from '@/hooks/useCategories';
import { useUncategorizedTransactions } from '@/hooks/useUncategorizedTransactions';

const Categorize = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categorizedTransactions, setCategorizedTransactions] = useState<{ [key: string]: string | null }>({});
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading: isLoadingTransactions, error: errorTransactions } = useUncategorizedTransactions();
  const { data: categories = [] } = useCategories();

  const handleCategoryChange = (transactionId: string, categoryId: string) => {
    setCategorizedTransactions(prev => ({
      ...prev,
      [transactionId]: categoryId,
    }));
  };

  const handleNotesChange = (transactionId: string, notes: string) => {
    setCategorizedTransactions(prev => ({
      ...prev,
      [`notes-${transactionId}`]: notes,
    }));
  };

  const handleCreateMapping = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsMappingDialogOpen(true);
  };

  const handleCategorize = async (transactionId: string) => {
    const categoryId = categorizedTransactions[transactionId];
    const notes = categorizedTransactions[`notes-${transactionId}`] || null;

    if (!categoryId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a category",
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not authenticated",
        });
        return;
      }

      const { error } = await supabase
        .from('categorized_transactions')
        .insert({
          transaction_id: transactionId,
          category_id: categoryId,
          user_id: user.id,
          notes: notes,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction categorized successfully",
      });

      setCategorizedTransactions(prev => {
        const { [transactionId]: _, ...rest } = prev;
        const { [`notes-${transactionId}`]: __, ...restWithNotes } = rest;
        return restWithNotes;
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  if (isLoadingTransactions) {
    return <div className="container py-8">Loading...</div>;
  }

  if (errorTransactions) {
    return <div className="container py-8">Error loading data.</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-4xl font-bold mb-2">Categorize Transactions</h1>
          <p className="text-gray-600">Review and update transaction categories</p>
        </div>
        <div className="w-[100px]" />
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Automatic Categorization</AlertTitle>
        <AlertDescription>
          Transactions are automatically categorized based on description mappings. You can manually override categories here or create new mappings for future transactions.
        </AlertDescription>
      </Alert>

      <UncategorizedTransactionList
        transactions={transactions}
        categories={categories}
        categorizedTransactions={categorizedTransactions}
        onCategoryChange={handleCategoryChange}
        onNotesChange={handleNotesChange}
        onCategorize={handleCategorize}
        onCreateMapping={handleCreateMapping}
      />

      <h2 className="text-2xl font-bold mt-8">Categorized Transactions</h2>
      <CategorizedTransactionTable />

      <MappingDialog
        open={isMappingDialogOpen}
        onOpenChange={setIsMappingDialogOpen}
        mapping={undefined}
      />
    </div>
  );
};

export default Categorize;