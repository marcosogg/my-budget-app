import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/categorization';
import { useToast } from '@/components/ui/use-toast';

export const useCategories = () => {
  const { toast } = useToast();

  return useQuery({
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
};