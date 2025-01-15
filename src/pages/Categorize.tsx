import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '@/types/transaction';
import { Category } from '@/types/categorization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import CategorizedTransactionTable from '@/components/CategorizedTransactionTable';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { MappingDialog } from '@/components/mappings/MappingDialog';

const Categorize = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categorizedTransactions, setCategorizedTransactions] = useState<{ [key: string]: string | null }>({});
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading: isLoadingTransactions, error: errorTransactions } = useQuery({
    queryKey: ['uncategorizedTransactions'],
    queryFn: async () => {
      // First, get all categorized transaction IDs
      const { data: categorizedIds } = await supabase
        .from('categorized_transactions')
        .select('transaction_id');

      const transactionIds = categorizedIds?.map(ct => ct.transaction_id) || [];

      // Get uncategorized transactions
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .not('id', 'in', `(${transactionIds.join(',')})`)
        .lt('amount', 0) // Only get expenses (negative amounts)
        .order('completed_date', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load uncategorized transactions",
        });
        throw error;
      }

      // Create a Map to store unique descriptions
      const uniqueDescriptions = new Map();
      data?.forEach(transaction => {
        const description = transaction.description;
        if (description && !uniqueDescriptions.has(description)) {
          uniqueDescriptions.set(description, transaction);
        }
      });

      return Array.from(uniqueDescriptions.values()) as Transaction[];
    },
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load categories",
        });
        throw error;
      }

      return data as Category[];
    },
  });

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

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No uncategorized transactions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{transaction.description}</h2>
                <p className="text-gray-500">{new Date(transaction.completed_date || '').toLocaleDateString()}</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Select onValueChange={(value) => handleCategoryChange(transaction.id, value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Add notes (optional)"
                  className="w-[300px]"
                  onChange={(e) => handleNotesChange(transaction.id, e.target.value)}
                />
                <Button onClick={() => handleCategorize(transaction.id)}>Categorize</Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleCreateMapping(transaction)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Mapping
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8">Categorized Transactions</h2>
      <CategorizedTransactionTable />

      <MappingDialog
        open={isMappingDialogOpen}
        onOpenChange={setIsMappingDialogOpen}
        mapping={selectedTransaction ? {
          description: selectedTransaction.description || '',
          category_id: categorizedTransactions[selectedTransaction.id] || '',
        } : undefined}
      />
    </div>
  );
};

export default Categorize;