import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { JsonMappingUpload } from "./JsonMappingUpload";
import { Toggle } from "@/components/ui/toggle";

interface MappingHeaderProps {
  onAddNew: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showActiveOnly: boolean;
  onShowActiveChange: (value: boolean) => void;
  showUncategorizedOnly: boolean;
  onShowUncategorizedChange: (value: boolean) => void;
}

export function MappingHeader({ 
  onAddNew, 
  searchTerm, 
  onSearchChange,
  showActiveOnly,
  onShowActiveChange,
  showUncategorizedOnly,
  onShowUncategorizedChange
}: MappingHeaderProps) {
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mappings..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex gap-4">
          <Toggle
            pressed={showActiveOnly}
            onPressedChange={onShowActiveChange}
            className="gap-2"
            aria-label="Toggle active mappings"
          >
            <span className="text-sm">Show Active Only</span>
          </Toggle>
          <Toggle
            pressed={showUncategorizedOnly}
            onPressedChange={onShowUncategorizedChange}
            className="gap-2"
            aria-label="Toggle uncategorized mappings"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Show Uncategorized Only</span>
          </Toggle>
        </div>
      </div>
    </>
  );
}