import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MappingDialog } from "@/components/mappings/MappingDialog";
import { DeleteMappingDialog } from "@/components/mappings/DeleteMappingDialog";

interface Mapping {
  id: string;
  description: string;
  category_id: string;
  category_name: string;
}

const Mappings = () => {
  const [selectedMapping, setSelectedMapping] = useState<Mapping | undefined>();
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<string | null>(null);

  const { data: mappings, isLoading } = useQuery({
    queryKey: ["description-mappings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("description_category_mappings")
        .select(`
          id,
          description,
          category_id,
          categories (
            name
          )
        `);

      if (error) throw error;

      return data.map((mapping) => ({
        id: mapping.id,
        description: mapping.description,
        category_id: mapping.category_id,
        category_name: mapping.categories.name,
      }));
    },
  });

  const handleEdit = (mapping: Mapping) => {
    setSelectedMapping(mapping);
    setIsAddEditOpen(true);
  };

  const handleDelete = (mappingId: string) => {
    setMappingToDelete(mappingId);
    setIsDeleteOpen(true);
  };

  const handleAddNew = () => {
    setSelectedMapping(undefined);
    setIsAddEditOpen(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Description Mappings</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings?.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell>{mapping.description}</TableCell>
              <TableCell>{mapping.category_name}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(mapping)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(mapping.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MappingDialog
        open={isAddEditOpen}
        onOpenChange={setIsAddEditOpen}
        mapping={selectedMapping}
      />

      {mappingToDelete && (
        <DeleteMappingDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          mappingId={mappingToDelete}
        />
      )}
    </div>
  );
};

export default Mappings;