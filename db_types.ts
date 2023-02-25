export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      songs: {
        Row: {
          created_at: string
          id: string
          key: string
          lyrics: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          lyrics: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          lyrics?: string
          title?: string
          updated_at?: string
        }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
