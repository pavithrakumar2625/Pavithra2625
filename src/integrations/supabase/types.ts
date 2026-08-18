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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          sort_order: number
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          year?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          id: string
          is_published: boolean
          issued_on: string
          issuer: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          id?: string
          is_published?: boolean
          issued_on?: string
          issuer?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          id?: string
          is_published?: boolean
          issued_on?: string
          issuer?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          details: string
          id: string
          institution: string
          is_published: boolean
          location: string
          period: string
          score: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          details?: string
          id?: string
          institution: string
          is_published?: boolean
          location?: string
          period?: string
          score?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          details?: string
          id?: string
          institution?: string
          is_published?: boolean
          location?: string
          period?: string
          score?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          highlights: string[]
          id: string
          is_published: boolean
          location: string
          period: string
          role_title: string
          sort_order: number
          summary: string
          tech: string[]
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          highlights?: string[]
          id?: string
          is_published?: boolean
          location?: string
          period?: string
          role_title: string
          sort_order?: number
          summary?: string
          tech?: string[]
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          highlights?: string[]
          id?: string
          is_published?: boolean
          location?: string
          period?: string
          role_title?: string
          sort_order?: number
          summary?: string
          tech?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          email: string
          id: string
          is_read: boolean
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          name: string
          subject?: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          about: string
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          headline: string
          id: string
          location: string
          phone: string
          stat_certifications: string
          stat_cgpa: string
          stat_internships: string
          stat_projects: string
          tagline: string
          updated_at: string
        }
        Insert: {
          about?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          headline?: string
          id?: string
          location?: string
          phone?: string
          stat_certifications?: string
          stat_cgpa?: string
          stat_internships?: string
          stat_projects?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          about?: string
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          headline?: string
          id?: string
          location?: string
          phone?: string
          stat_certifications?: string
          stat_cgpa?: string
          stat_internships?: string
          stat_projects?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          caption: string
          created_at: string
          id: string
          is_published: boolean
          media_type: string
          project_id: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          is_published?: boolean
          media_type?: string
          project_id: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          is_published?: boolean
          media_type?: string
          project_id?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          demo_url: string | null
          features: string[]
          full_description: string
          github_url: string | null
          id: string
          implementation: string
          is_featured: boolean
          is_published: boolean
          outcome: string
          period: string
          problem: string
          short_description: string
          slug: string
          solution: string
          sort_order: number
          tech_stack: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          demo_url?: string | null
          features?: string[]
          full_description?: string
          github_url?: string | null
          id?: string
          implementation?: string
          is_featured?: boolean
          is_published?: boolean
          outcome?: string
          period?: string
          problem?: string
          short_description?: string
          slug: string
          solution?: string
          sort_order?: number
          tech_stack?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          demo_url?: string | null
          features?: string[]
          full_description?: string
          github_url?: string | null
          id?: string
          implementation?: string
          is_featured?: boolean
          is_published?: boolean
          outcome?: string
          period?: string
          problem?: string
          short_description?: string
          slug?: string
          solution?: string
          sort_order?: number
          tech_stack?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          created_at: string
          file_url: string
          id: string
          is_active: boolean
          label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_enabled: boolean
          created_at: string
          default_theme: string
          id: string
          meta_description: string
          site_title: string
          updated_at: string
        }
        Insert: {
          contact_enabled?: boolean
          created_at?: string
          default_theme?: string
          id?: string
          meta_description?: string
          site_title?: string
          updated_at?: string
        }
        Update: {
          contact_enabled?: boolean
          created_at?: string
          default_theme?: string
          id?: string
          meta_description?: string
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          created_at: string
          description: string
          id: string
          is_published: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_published: boolean
          name: string
          proficiency: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          name: string
          proficiency?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          proficiency?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          platform: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
