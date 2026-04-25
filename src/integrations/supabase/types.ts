export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      archetype_selections: {
        Row: {
          archetype_id: string
          created_at: string
          features_enabled: Json
          id: string
          user_id: string
          weight: number
        }
        Insert: {
          archetype_id: string
          created_at?: string
          features_enabled?: Json
          id?: string
          user_id: string
          weight?: number
        }
        Update: {
          archetype_id?: string
          created_at?: string
          features_enabled?: Json
          id?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      drafts: {
        Row: {
          agnic_message_id: string | null
          body_long: string | null
          body_short_1: string | null
          body_short_2: string | null
          created_at: string
          hook_carousel: string | null
          id: string
          parent_draft_id: string | null
          status: Database["public"]["Enums"]["draft_status"]
          topic_id: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          agnic_message_id?: string | null
          body_long?: string | null
          body_short_1?: string | null
          body_short_2?: string | null
          created_at?: string
          hook_carousel?: string | null
          id?: string
          parent_draft_id?: string | null
          status?: Database["public"]["Enums"]["draft_status"]
          topic_id?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          agnic_message_id?: string | null
          body_long?: string | null
          body_short_1?: string | null
          body_short_2?: string | null
          created_at?: string
          hook_carousel?: string | null
          id?: string
          parent_draft_id?: string | null
          status?: Database["public"]["Enums"]["draft_status"]
          topic_id?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "drafts_parent_draft_id_fkey"
            columns: ["parent_draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drafts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      edit_requests: {
        Row: {
          agnic_message_id: string | null
          created_at: string
          draft_id: string
          id: string
          instruction_text: string
          processed_at: string | null
          regen_draft_id: string | null
          user_id: string
        }
        Insert: {
          agnic_message_id?: string | null
          created_at?: string
          draft_id: string
          id?: string
          instruction_text: string
          processed_at?: string | null
          regen_draft_id?: string | null
          user_id: string
        }
        Update: {
          agnic_message_id?: string | null
          created_at?: string
          draft_id?: string
          id?: string
          instruction_text?: string
          processed_at?: string | null
          regen_draft_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "edit_requests_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edit_requests_regen_draft_id_fkey"
            columns: ["regen_draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_emails: {
        Row: {
          agnic_message_id: string
          id: string
          processed_at: string
        }
        Insert: {
          agnic_message_id: string
          id?: string
          processed_at?: string
        }
        Update: {
          agnic_message_id?: string
          id?: string
          processed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agent_email_alias: string | null
          agent_name: string | null
          agnic_agent_id: number | null
          agnic_sub: string | null
          created_at: string
          id: string
          kya_status: Database["public"]["Enums"]["kya_status"]
          onboarding_completed: boolean
          primary_email: string | null
          updated_at: string
        }
        Insert: {
          agent_email_alias?: string | null
          agent_name?: string | null
          agnic_agent_id?: number | null
          agnic_sub?: string | null
          created_at?: string
          id: string
          kya_status?: Database["public"]["Enums"]["kya_status"]
          onboarding_completed?: boolean
          primary_email?: string | null
          updated_at?: string
        }
        Update: {
          agent_email_alias?: string | null
          agent_name?: string | null
          agnic_agent_id?: number | null
          agnic_sub?: string | null
          created_at?: string
          id?: string
          kya_status?: Database["public"]["Enums"]["kya_status"]
          onboarding_completed?: boolean
          primary_email?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          content: string
          created_at: string
          id: string
          source: Database["public"]["Enums"]["topic_source"]
          status: Database["public"]["Enums"]["topic_status"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          source?: Database["public"]["Enums"]["topic_source"]
          status?: Database["public"]["Enums"]["topic_status"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          source?: Database["public"]["Enums"]["topic_source"]
          status?: Database["public"]["Enums"]["topic_status"]
          user_id?: string
        }
        Relationships: []
      }
      voice_dna: {
        Row: {
          created_at: string
          dna_json: Json
          id: string
          summary: string | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          dna_json: Json
          id?: string
          summary?: string | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          dna_json?: Json
          id?: string
          summary?: string | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      voice_samples: {
        Row: {
          content: string
          created_at: string
          id: string
          title: string | null
          type: Database["public"]["Enums"]["sample_type"]
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          title?: string | null
          type: Database["public"]["Enums"]["sample_type"]
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          title?: string | null
          type?: Database["public"]["Enums"]["sample_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      draft_status:
        | "drafting"
        | "awaiting_edits"
        | "approved"
        | "archived"
        | "cancelled"
      kya_status: "none" | "pending" | "active"
      sample_type: "best_of" | "story" | "bio" | "long_form"
      topic_source: "in_app" | "inbound_email"
      topic_status: "pending" | "generating" | "done" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      draft_status: [
        "drafting",
        "awaiting_edits",
        "approved",
        "archived",
        "cancelled",
      ],
      kya_status: ["none", "pending", "active"],
      sample_type: ["best_of", "story", "bio", "long_form"],
      topic_source: ["in_app", "inbound_email"],
      topic_status: ["pending", "generating", "done", "failed"],
    },
  },
} as const
