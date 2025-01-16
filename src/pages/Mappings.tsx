import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MappingDialog } from "@/components/mappings/MappingDialog";
import { DeleteMappingDialog } from "@/components/mappings/DeleteMappingDialog";
import { MappingTable } from "@/components/mappings/MappingTable";
import { MappingHeader } from "@/components/mappings/MappingHeader";
import { toast } from "sonner";

interface Mapping {
  id: string;
  description: string;
  category_id: string;
  category_name: string;
  transaction_count: number;
  last_used: string | null;
}

interface QueryResult {
  id: string;
  description: string;
  category_id: string;
  categories: {
    name: string;
  };
}

const Mappings = () => {
  const [selectedMapping, setSelectedMapping] = useState<Mapping | undefined>();
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [mappingToDelete, setMappingToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: mappings, isLoading } = useQuery({
    queryKey: ["description-mappings"],
    queryFn: async () => {
      // First, get the mappings with their categories
      const { data: mappingsData, error: mappingsError } = await supabase
        .from("description_category_mappings")
        .select(`
          id,
          description,
          category_id,
          categories (
            name
          )
        `)
        .order('description') as { data: QueryResult[] | null, error: any };

      if (mappingsError) {
        toast.error("Failed to load mappings");
        throw mappingsError;
      }

      // For each mapping, get the usage statistics from categorized_transactions
      const mappingsWithStats = await Promise.all((mappingsData || []).map(async (mapping) => {
        const { data: statsData, error: statsError } = await supabase
          .from("categorized_transactions")
          .select('id, created_at')
          .eq('category_id', mapping.category_id);

        if (statsError) {
          console.error("Error fetching stats:", statsError);
          return {
            ...mapping,
            transaction_count: 0,
            last_used: null,
            category_name: mapping.categories.name
          };
        }

        const transactions = statsData || [];
        const lastUsedDate = transactions.length > 0 
          ? transactions.reduce((latest, curr) => 
              latest.created_at > curr.created_at ? latest : curr
            ).created_at
          : null;

        return {
          id: mapping.id,
          description: mapping.description,
          category_id: mapping.category_id,
          category_name: mapping.categories.name,
          transaction_count: transactions.length,
          last_used: lastUsedDate
        };
      }));

      return mappingsWithStats;
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

  const filteredMappings = mappings?.filter((mapping) =>
    mapping.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <MappingHeader
        onAddNew={handleAddNew}
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <MappingTable
        mappings={filteredMappings || []}
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
