import { Json } from "../../utils/type-helpers";

export interface DescriptionCategoryMappingTable {
  Row: {
    id: string;
    description: string;
    category_id: string;
    user_id: string;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    description: string;
    category_id: string;
    user_id: string;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    description?: string;
    category_id?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "description_category_mappings_category_id_fkey";
      columns: ["category_id"];
      isOneToOne: false;
      referencedRelation: "categories";
      referencedColumns: ["id"];
    }
  ];
}