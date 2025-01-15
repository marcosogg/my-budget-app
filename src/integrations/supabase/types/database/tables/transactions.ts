import { Json } from "../../utils/type-helpers";

export interface TransactionTable {
  Row: {
    id: string;
    user_id: string;
    type: string;
    product: string | null;
    started_date: string | null;
    completed_date: string | null;
    description: string | null;
    amount: number;
    fee: number | null;
    currency: string;
    state: string | null;
    balance: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    type: string;
    product?: string | null;
    started_date?: string | null;
    completed_date?: string | null;
    description?: string | null;
    amount: number;
    fee?: number | null;
    currency: string;
    state?: string | null;
    balance: number;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    type?: string;
    product?: string | null;
    started_date?: string | null;
    completed_date?: string | null;
    description?: string | null;
    amount?: number;
    fee?: number | null;
    currency?: string;
    state?: string | null;
    balance?: number;
    created_at?: string;
  };
  Relationships: [];
}