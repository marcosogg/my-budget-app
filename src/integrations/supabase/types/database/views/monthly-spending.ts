export interface MonthlyTotalSpendingView {
  Row: {
    user_id: string | null;
    month: string | null;
    total_amount: number | null;
  };
  Relationships: [];
}

export interface MonthlyCategorySpendingView {
  Row: {
    category_name: string | null;
    month: string | null;
    total_amount: number | null;
    transaction_count: number | null;
    user_id: string | null;
  };
  Relationships: [];
}