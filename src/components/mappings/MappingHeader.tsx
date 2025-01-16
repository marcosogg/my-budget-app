import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { JsonMappingUpload } from "./JsonMappingUpload";

interface MappingHeaderProps {
  onAddNew: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function MappingHeader({ onAddNew, searchTerm, onSearchChange }: MappingHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Description Mappings</h1>
        <div className="flex gap-4">
          <JsonMappingUpload />
          <Button onClick={onAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Mapping
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search mappings..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </>
  );
}