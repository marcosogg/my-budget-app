import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface CategoryMapping {
  category: string;
  descriptions: string[];
}

export function JsonMappingUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a JSON file');
      return;
    }

    setIsUploading(true);
    try {
      const text = await file.text();
      const mappings: CategoryMapping[] = JSON.parse(text);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload mappings');
        return;
      }

      // Get all categories for the user
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .or(`user_id.eq.${user.id},is_system.eq.true`);

      if (!categories) {
        toast.error('Failed to fetch categories');
        return;
      }

      let successCount = 0;
      let skipCount = 0;

      // Process each mapping
      for (const mapping of mappings) {
        // Find matching category
        const category = categories.find(
          c => c.name.toLowerCase() === mapping.category.toLowerCase()
        );

        if (!category) {
          console.log(`Category not found: ${mapping.category}`);
          continue;
        }

        // Process descriptions
        for (const description of mapping.descriptions) {
          // Check if mapping already exists
          const { data: existing } = await supabase
            .from('description_category_mappings')
            .select('id')
            .eq('description', description)
            .eq('user_id', user.id)
            .single();

          if (existing) {
            skipCount++;
            continue;
          }

          // Create new mapping
          const { error } = await supabase
            .from('description_category_mappings')
            .insert({
              description,
              category_id: category.id,
              user_id: user.id,
            });

          if (error) {
            console.error('Error creating mapping:', error);
            continue;
          }

          successCount++;
        }
      }

      // Refresh mappings list
      queryClient.invalidateQueries({ queryKey: ["description-mappings"] });

      toast.success(
        `Upload complete: ${successCount} mappings created, ${skipCount} skipped`
      );
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to process JSON file');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        id="json-upload"
        disabled={isUploading}
      />
      <label htmlFor="json-upload">
        <Button
          variant="outline"
          disabled={isUploading}
          className="cursor-pointer"
          asChild
        >
          <span>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Import JSON'}
          </span>
        </Button>
      </label>
    </div>
  );
}