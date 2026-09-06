export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      gallery_images: {
        Row: {
          id: string;
          url: string;
          storage_path: string;
          caption: string | null;
          sort_order: number | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          url: string;
          storage_path: string;
          caption?: string | null;
          sort_order?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          url?: string;
          storage_path?: string;
          caption?: string | null;
          sort_order?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      naqoot_entries: {
        Row: {
          id: string;
          donor_name: string;
          amount: number;
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_name: string;
          amount: number;
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_name?: string;
          amount?: number;
          message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      naqoot_leaderboard: {
        Row: {
          donor_name: string;
          total_amount: number;
          entries_count: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
