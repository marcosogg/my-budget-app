export interface CategorizedTransactionTable {
  Row: {
    id: string;
    transaction_id: string;
    category_id: string;
    user_id: string;
    notes: string | null;
    created_at: string;
    updated_at: string | null;
  };
  Insert: {
    id?: string;
    transaction_id: string;
    category_id: string;
    user_id: string;
    notes?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Update: {
    id?: string;
    transaction_id?: string;
    category_id?: string;
    user_id?: string;
    notes?: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
  Relationships: [
    {
      foreignKeyName: "categorized_transactions_category_id_fkey";
      columns: ["category_id"];
      isOneToOne: false;
      referencedRelation: "categories";
      referencedColumns: ["id"];
    },
    {
      foreignKeyName: "categorized_transactions_transaction_id_fkey";
      columns: ["transaction_id"];
      isOneToOne: false;
      referencedRelation: "transactions";
      referencedColumns: ["id"];
    }
  ];
}