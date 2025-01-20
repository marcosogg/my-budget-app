import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Save, X, Loader2 } from "lucide-react";
import { formatEuroDate } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRef, useEffect, useState } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useToast } from "@/hooks/use-toast";

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
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Transactions</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Transactions</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mappings?.map((mapping) => (
          <TableRow key={mapping.id}>
            <TableCell className="font-medium">
              {editingId === mapping.id ? (
                <Input
                  ref={inputRef}
                  value={editValues?.description}
                  onChange={(e) => setEditValues(prev => ({ ...prev!, description: e.target.value }))}
                  onKeyDown={(e) => handleKeyDown(e, mapping)}
                  className="w-full"
                />
              ) : (
                mapping.description
              )}
            </TableCell>
            <TableCell>
              {editingId === mapping.id ? (
                <Select
                  value={editValues?.category_id}
                  onValueChange={(value) => setEditValues(prev => ({ ...prev!, category_id: value }))}
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
              ) : (
                <>
                  {mapping.category_name}
                  {mapping.transaction_count > 0 && (
                    <Badge variant="secondary" className="ml-2">Active</Badge>
                  )}
                </>
              )}
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
                {editingId === mapping.id ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave(mapping)}
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
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(mapping)}
                      disabled={!!editingId}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(mapping.id)}
                      disabled={!!editingId}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
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