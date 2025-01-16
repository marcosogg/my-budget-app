import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tag, CreateTagInput } from '@/types/tags';
import { useToast } from '@/hooks/use-toast';

export const useTags = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading tags",
          description: error.message,
        });
        throw error;
      }

      return data as Tag[];
    },
  });

  const createTag = useMutation({
    mutationFn: async (input: CreateTagInput) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User must be authenticated to create tags');
      }

      const { data, error } = await supabase
        .from('tags')
        .insert([{ 
          name: input.name,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error creating tag",
          description: error.message,
        });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: "Tag created",
        description: "Your new tag has been created successfully.",
      });
    },
  });

  const deleteTag = useMutation({
    mutationFn: async (tagId: string) => {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error deleting tag",
          description: error.message,
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast({
        title: "Tag deleted",
        description: "The tag has been deleted successfully.",
      });
    },
  });

  return {
    tags,
    isLoading,
    createTag,
    deleteTag,
  };
};