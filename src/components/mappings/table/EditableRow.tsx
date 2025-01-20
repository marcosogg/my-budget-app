import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Loader2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/categorization";

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
  onSave,
  onCancel,
  onEditValuesChange,
  onKeyDown,
}: EditableRowProps) {
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
            onClick={onSave}
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