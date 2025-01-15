export interface UncategorizedDescriptionsView {
  Row: {
    description: string | null;
    occurrence_count: number | null;
    user_id: string | null;
  };
  Relationships: [];
}

export interface UncategorizedSummaryView {
  Row: {
    total_transactions: number | null;
    unique_description_count: number | null;
    user_id: string | null;
  };
  Relationships: [];
}