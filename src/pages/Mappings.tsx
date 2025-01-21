import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MappingTable } from "@/components/mappings/MappingTable";
import { MappingHeader } from "@/components/mappings/MappingHeader";

type Mapping = {
  id: string;
  description: string;
  category_name: string;
};

const Mappings = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: mappings, isLoading, error } = useQuery({
    queryKey: ["description-mappings"],
    queryFn: async () => {
      const { data, error: fetchError } = await supabase
        .from("mapping_management")
        .select("*")
        .order('description');

      if (fetchError) throw new Error('Failed to load mappings');

      return (data as any[])?.map(mapping => ({
        id: crypto.randomUUID(),
        description: mapping.description,
        category_name: mapping.category_name,
      })) || [];
    },
  });

  const filteredMappings = mappings?.filter(mapping => 
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