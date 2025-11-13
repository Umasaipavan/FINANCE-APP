export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string | null
          email: string | null
          avatar_url: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          email?: string | null
          avatar_url?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          email?: string | null
          avatar_url?: string | null
          full_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          amount: number
          category: string
          date: string
          description: string
          type: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          amount: number
          category: string
          date: string
          description: string
          type: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          amount?: number
          category?: string
          date?: string
          description?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}