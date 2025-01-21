import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { uploadMappings } from "./utils/uploadMappings";

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
      const mappings = JSON.parse(text);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to upload mappings');
        return;
      }

      const { successCount, skipCount } = await uploadMappings(mappings, user.id);
      queryClient.invalidateQueries({ queryKey: ["description-mappings"] });
      toast.success(`${successCount} mappings imported, ${skipCount} skipped`);
    } catch (error) {
      toast.error('Failed to import mappings');
    } finally {
      setIsUploading(false);
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