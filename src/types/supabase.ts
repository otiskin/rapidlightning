export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: { id: number; name: string; price: number; stock: number; description: string | null };
        Insert: { id?: number; name: string; price: number; stock?: number; description?: string | null };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: { id: number; customer_name?: string | null; email?: string | null; address?: string | null; quantity?: number | null; total?: number | null; status?: string | null; session_id?: string | null; created_at?: string | null };
        Insert: { id?: number; customer_name?: string | null; email?: string | null; address?: string | null; quantity?: number | null; total?: number | null; status?: string | null; session_id?: string | null; created_at?: string | null };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
    };
  };
}