export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_system: boolean
          name: string
          type: Database["public"]["Enums"]["category_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_system?: boolean
          name: string
          type?: Database["public"]["Enums"]["category_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_system?: boolean
          name?: string
          type?: Database["public"]["Enums"]["category_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      categorized_transactions: {
        Row: {
          category_id: string
          created_at: string
          id: string
          notes: string | null
          transaction_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          notes?: string | null
          transaction_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          transaction_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorized_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categorized_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      description_category_mappings: {
        Row: {
          category_id: string
          created_at: string
          description: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "description_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          total_monthly_income: number
        }
        Insert: {
          created_at?: string
          id: string
          total_monthly_income?: number
        }
        Update: {
          created_at?: string
          id?: string
          total_monthly_income?: number
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      transaction_tags: {
        Row: {
          created_at: string
          tag_id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          tag_id: string
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          tag_id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_tags_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance: number
          completed_date: string | null
          created_at: string
          currency: string
          description: string | null
          fee: number | null
          id: string
          product: string | null
          started_date: string | null
          state: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance: number
          completed_date?: string | null
          created_at?: string
          currency: string
          description?: string | null
          fee?: number | null
          id?: string
          product?: string | null
          started_date?: string | null
          state?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance?: number
          completed_date?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          fee?: number | null
          id?: string
          product?: string | null
          started_date?: string | null
          state?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      mapping_statistics: {
        Row: {
          category_id: string | null
          category_name: string | null
          description: string | null
          id: string | null
          last_used_date: string | null
          transaction_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "description_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_category_spending: {
        Row: {
          category_name: string | null
          month: string | null
          total_amount: number | null
          transaction_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      monthly_total_spending: {
        Row: {
          month: string | null
          total_amount: number | null
          user_id: string | null
        }
        Relationships: []
      }
      uncategorized_descriptions: {
        Row: {
          description: string | null
          occurrence_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      uncategorized_summary: {
        Row: {
          total_transactions: number | null
          unique_description_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      category_type: "expense" | "uncategorized"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
