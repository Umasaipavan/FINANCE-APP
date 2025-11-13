import { Database } from './supabase';

export type Tables = Database['public']['Tables'];

export type Transaction = Tables['transactions']['Row'];
export type TransactionInsert = Tables['transactions']['Insert'];
export type TransactionUpdate = Tables['transactions']['Update'];

export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type Category = 'housing' | 'food' | 'transportation' | 'entertainment' | 'utilities' | 'other';

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type User = {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: Record<string, any>;
}

export type Session = {
  user: User;
  access_token: string;
  expires_at?: number;
}

export type SupabaseClient = any; // Replace with proper types when you install @supabase/supabase-js