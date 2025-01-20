export interface Transaction {
  id: string;
  user_id: string;
  type: string;
  product: string | null;
  started_date: Date | null;
  completed_date: Date | null;
  description: string | null;
  amount: number;
  fee: number | null;
  currency: string;
  state: string | null;
  balance: number | null;
  created_at: string;
}
