import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MappingTable } from "@/components/mappings/MappingTable";
import { MappingHeader } from "@/components/mappings/MappingHeader";

interface MappingManagementRow {
  description: string;
  category_name: string;
  transaction_count: number;
}

const Mappings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: mappings, isLoading, error } = useQuery({
    queryKey: ["description-mappings"],
    queryFn: async () => {
      const { data: mappingsData, error: fetchError } = await supabase
        .from("mapping_management")
        .select("*")
        .order('description');

      if (fetchError) {
        console.error("Error fetching mappings:", fetchError);
        throw new Error("Failed to load mappings");
      }

      return (mappingsData as MappingManagementRow[])?.map(mapping => ({
        id: crypto.randomUUID(),
        description: mapping.description,
        category_name: mapping.category_name,
        transaction_count: Number(mapping.transaction_count)
      })) || [];
    },
  });

  const filteredMappings = mappings?.filter((mapping) => 
    mapping.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-6 space-y-6">
      <MappingHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <MappingTable
        mappings={filteredMappings || []}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
      />
    </div>
  );
};

export default Mappings;