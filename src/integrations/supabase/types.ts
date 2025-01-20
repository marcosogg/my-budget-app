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
      bill_reminders: {
        Row: {
          amount: number | null
          created_at: string
          due_date: string
          id: string
          image_url: string | null
          is_paid: boolean | null
          is_recurring_instance: boolean | null
          name: string
          notification_types: Database["public"]["Enums"]["notification_type"][]
          parent_reminder_id: string | null
          recurrence_end_date: string | null
          recurrence_frequency:
            | Database["public"]["Enums"]["recurrence_frequency"]
            | null
          reminder_days_before: number[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          due_date: string
          id?: string
          image_url?: string | null
          is_paid?: boolean | null
          is_recurring_instance?: boolean | null
          name: string
          notification_types: Database["public"]["Enums"]["notification_type"][]
          parent_reminder_id?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?:
            | Database["public"]["Enums"]["recurrence_frequency"]
            | null
          reminder_days_before: number[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          due_date?: string
          id?: string
          image_url?: string | null
          is_paid?: boolean | null
          is_recurring_instance?: boolean | null
          name?: string
          notification_types?: Database["public"]["Enums"]["notification_type"][]
          parent_reminder_id?: string | null
          recurrence_end_date?: string | null
          recurrence_frequency?:
            | Database["public"]["Enums"]["recurrence_frequency"]
            | null
          reminder_days_before?: number[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_reminders_parent_reminder_id_fkey"
            columns: ["parent_reminder_id"]
            isOneToOne: false
            referencedRelation: "bill_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
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
      category_tags: {
        Row: {
          category_id: string
          created_at: string
          tag_id: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          tag_id: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          tag_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_tags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
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
      mappings_backup: {
        Row: {
          category_name: string | null
          description: string | null
          user_id: string | null
        }
        Insert: {
          category_name?: string | null
          description?: string | null
          user_id?: string | null
        }
        Update: {
          category_name?: string | null
          description?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      reminder_notifications: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          notification_content: string | null
          notification_title: string | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority: string | null
          read_at: string | null
          reminder_id: string
          scheduled_for: string
          sent_at: string | null
          status: Database["public"]["Enums"]["reminder_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_content?: string | null
          notification_title?: string | null
          notification_type: Database["public"]["Enums"]["notification_type"]
          priority?: string | null
          read_at?: string | null
          reminder_id: string
          scheduled_for: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["reminder_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          notification_content?: string | null
          notification_title?: string | null
          notification_type?: Database["public"]["Enums"]["notification_type"]
          priority?: string | null
          read_at?: string | null
          reminder_id?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["reminder_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_notifications_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "bill_reminders"
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
      mapping_management: {
        Row: {
          category_id: string | null
          category_name: string | null
          description: string | null
          is_mapped: boolean | null
          last_transaction_date: string | null
          total_amount: number | null
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
          type: Database["public"]["Enums"]["category_type"] | null
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
      notification_type: "whatsapp" | "email" | "in_app"
      recurrence_frequency: "none" | "monthly"
      reminder_status: "pending" | "sent" | "failed" | "read"
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
