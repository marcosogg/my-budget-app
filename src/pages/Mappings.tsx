import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MappingDialog } from "@/components/mappings/MappingDialog";
import { DeleteMappingDialog } from "@/components/mappings/DeleteMappingDialog";
import { MappingTable } from "@/components/mappings/MappingTable";
import { MappingHeader } from "@/components/mappings/MappingHeader";

interface Mapping {
  id: string;
  description: string;
  category_id: string;
  category_name: string;
  transaction_count: number;
  last_used_date: string | null;
}

const Mappings = () => {
  const [selectedMapping, setSelectedMapping] = useState<Mapping | undefined>();
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showUncategorizedOnly, setShowUncategorizedOnly] = useState(false);

  const { data: mappings, isLoading, error } = useQuery({
    queryKey: ["description-mappings"],
    queryFn: async () => {
      console.log("Fetching mapping statistics...");
      const { data: mappingsData, error: fetchError } = await supabase
        .from("mapping_management")
        .select("*")
        .order('description');

      if (fetchError) {
        console.error("Error fetching mappings:", fetchError);
        throw new Error("Failed to load mappings");
      }

      console.log("Received mapping data:", mappingsData);
      return mappingsData?.map(mapping => ({
        id: mapping.id || crypto.randomUUID(), // Generate an ID if none exists
        description: mapping.description,
        category_id: mapping.category_id,
        category_name: mapping.category_name,
        transaction_count: Number(mapping.transaction_count),
        last_used_date: mapping.last_transaction_date
      })) || [];
    },
  });

  const handleEdit = (mapping: Mapping) => {
    console.log("Editing mapping:", mapping);
    setSelectedMapping(mapping);
    setIsAddEditOpen(true);
  };

  const handleDelete = (mappingId: string) => {
    console.log("Deleting mapping:", mappingId);
    setMappingToDelete(mappingId);
    setIsDeleteOpen(true);
  };

  const handleAddNew = () => {
    console.log("Adding new mapping");
    setSelectedMapping(undefined);
    setIsAddEditOpen(true);
  };

  const filteredMappings = mappings?.filter((mapping) => {
    const matchesSearch = mapping.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActive = !showActiveOnly || mapping.transaction_count > 0;
    const matchesUncategorized = !showUncategorizedOnly || mapping.category_name === 'Uncategorized';
    
    return matchesSearch && matchesActive && matchesUncategorized;
  });

  return (
    <div className="container py-6 space-y-6">
      <MappingHeader
        onAddNew={handleAddNew}
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        showActiveOnly={showActiveOnly}
        onShowActiveChange={setShowActiveOnly}
        showUncategorizedOnly={showUncategorizedOnly}
        onShowUncategorizedChange={setShowUncategorizedOnly}
      />

      <MappingTable
        mappings={filteredMappings || []}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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