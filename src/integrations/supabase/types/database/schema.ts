import { CategoryTable } from "./tables/categories";
import { TransactionTable } from "./tables/transactions";
import { DescriptionCategoryMappingTable } from "./tables/mappings";
import { ProfileTable } from "./tables/profiles";
import { CategorizedTransactionTable } from "./tables/categorized-transactions";
import {
  MonthlyTotalSpendingView,
  MonthlyCategorySpendingView,
} from "./views/monthly-spending";
import {
  UncategorizedDescriptionsView,
  UncategorizedSummaryView,
} from "./views/uncategorized";

export interface Database {
  public: {
    Tables: {
      categories: CategoryTable;
      transactions: TransactionTable;
      description_category_mappings: DescriptionCategoryMappingTable;
      profiles: ProfileTable;
      categorized_transactions: CategorizedTransactionTable;
    };
    Views: {
      monthly_total_spending: MonthlyTotalSpendingView;
      monthly_category_spending: MonthlyCategorySpendingView;
      uncategorized_descriptions: UncategorizedDescriptionsView;
      uncategorized_summary: UncategorizedSummaryView;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}