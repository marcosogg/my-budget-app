import { Json } from "../../utils/type-helpers";

export interface CategoryTable {
  Row: {
    created_at: string;
    display_order: number | null;
    id: string;
    is_system: boolean;
    name: string;
    user_id: string | null;
  };
  Insert: {
    created_at?: string;
    display_order?: number | null;
    id?: string;
    is_system?: boolean;
    name: string;
    user_id?: string | null;
  };
  Update: {
    created_at?: string;
    display_order?: number | null;
    id?: string;
    is_system?: boolean;
    name?: string;
    user_id?: string | null;
  };
  Relationships: [];
}