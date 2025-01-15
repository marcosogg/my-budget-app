export interface ProfileTable {
  Row: {
    id: string;
    created_at: string;
  };
  Insert: {
    id: string;
    created_at?: string;
  };
  Update: {
    id?: string;
    created_at?: string;
  };
  Relationships: [];
}