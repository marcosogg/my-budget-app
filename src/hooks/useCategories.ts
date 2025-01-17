import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/categorization';
import { useToast } from '@/components/ui/use-toast';

interface UseCategoriesOptions {
  includeUncategorized?: boolean;
  onlyExpenses?: boolean;
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const { toast } = useToast();
  const { includeUncategorized = true, onlyExpenses = false } = options;

  return useQuery({
    queryKey: ['categories', { includeUncategorized, onlyExpenses }],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!includeUncategorized) {
        query = query.neq('type', 'uncategorized');
      }

      if (onlyExpenses) {
        query = query.eq('type', 'expense');
      }

      const { data, error } = await query;

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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes (formerly cacheTime)
  });
};