import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Loader2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";
import { Category } from "@/types/categorization";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface EditableRowProps {
  mapping: {
    id: string;
    description: string;
    category_id: string;
    category_name: string;
    transaction_count: number;
    last_used_date: string | null;
  };
  editValues: { description: string; category_id: string };
  categories: Category[];
  isSaving: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSave: () => void;
  onCancel: () => void;
  onEditValuesChange: (values: { description: string; category_id: string }) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function EditableRow({
  mapping,
  editValues,
  categories,
  isSaving,
  inputRef,
  onCancel,
  onEditValuesChange,
  onKeyDown,
}: EditableRowProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!editValues.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Description cannot be empty",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("description_category_mappings")
        .update({
          description: editValues.description,
          category_id: editValues.category_id,
          updated_at: new Date().toISOString(),
        })
        .eq("description", mapping.description)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({ 
        title: "Success", 
        description: "Mapping and associated transactions have been updated" 
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["description-mappings"] });
      queryClient.invalidateQueries({ queryKey: ["categorizedTransactions"] });
      
      onCancel(); // Close edit mode
    } catch (error) {
      console.error('Error saving mapping:', error);
      toast({
        title: "Error",
        description: "An error occurred while saving the mapping",
        variant: "destructive",
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Input
          ref={inputRef}
          value={editValues.description}
          onChange={(e) => onEditValuesChange({ ...editValues, description: e.target.value })}
          onKeyDown={onKeyDown}
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <Select
          value={editValues.category_id}
          onValueChange={(value) => onEditValuesChange({ ...editValues, category_id: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        {new Intl.NumberFormat('de-DE').format(mapping.transaction_count)}
      </TableCell>
      <TableCell>
        {mapping.last_used_date 
          ? formatEuroDate(mapping.last_used_date)
          : 'Never'}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}