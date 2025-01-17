export interface Category {
  id: string;
  name: string;
  user_id: string | null;
  is_system: boolean;
  display_order: number | null;
  created_at: string;
  type: 'expense' | 'uncategorized';
}
  
export interface CategorizedTransaction {
  id: string;
  transaction_id: string;
  category_id: string;
  user_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}