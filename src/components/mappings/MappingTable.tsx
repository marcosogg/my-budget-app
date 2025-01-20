import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useRef, useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";
import { TableHeader } from "./table/TableHeader";
import { LoadingState } from "./table/LoadingState";
import { EditableRow } from "./table/EditableRow";
import { StaticRow } from "./table/StaticRow";

interface Mapping {
  id: string;
  description: string;
  category_id: string;
  category_name: string;
  transaction_count: number;
  last_used_date: string | null;
}

interface MappingTableProps {
  mappings: Mapping[];
  isLoading?: boolean;
  error?: Error | null;
  onEdit: (mapping: Mapping) => void;
  onDelete: (mappingId: string) => void;
}

export function MappingTable({ 
  mappings, 
  isLoading, 
  error,
  onEdit, 
  onDelete 
}: MappingTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ description: string; category_id: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { data: categories } = useCategories({ onlyExpenses: true });

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleStartEdit = (mapping: Mapping) => {
    setEditingId(mapping.id);
    setEditValues({
      description: mapping.description,
      category_id: mapping.category_id,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const handleSave = async (mapping: Mapping) => {
    if (!editValues) return;
    
    if (!editValues.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Description cannot be empty",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onEdit({
        ...mapping,
        description: editValues.description,
        category_id: editValues.category_id,
      });
      setEditingId(null);
      setEditValues(null);
      toast({
        title: "Success",
        description: "Mapping updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update mapping",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, mapping: Mapping) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter' && !e.shiftKey) {
      handleSave(mapping);
    }
  };

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading mappings: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader />
        <LoadingState />
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader />
      <TableBody>
        {mappings?.map((mapping) => (
          editingId === mapping.id && editValues ? (
            <EditableRow
              key={mapping.id}
              mapping={mapping}
              editValues={editValues}
              categories={categories || []}
              isSaving={isSaving}
              inputRef={inputRef}
              onSave={() => handleSave(mapping)}
              onCancel={handleCancelEdit}
              onEditValuesChange={setEditValues}
              onKeyDown={(e) => handleKeyDown(e, mapping)}
            />
          ) : (
            <StaticRow
              key={mapping.id}
              mapping={mapping}
              isEditingAny={!!editingId}
              onEdit={() => handleStartEdit(mapping)}
              onDelete={() => onDelete(mapping.id)}
            />
          )
        ))}
        {mappings.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
              No mappings found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}