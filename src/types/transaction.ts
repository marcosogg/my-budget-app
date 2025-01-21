export interface Transaction {
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
  categorized_transactions?: {
    id: string;
    transaction_id: string;
    category_id: string;
    user_id: string;
    notes: string | null;
    created_at: string;
    updated_at: string | null;
  }[];
}