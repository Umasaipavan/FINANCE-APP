import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in browser client:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    });
    
    // Return a mock client for browser environments when env vars are missing
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase environment variables not configured') }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Authentication unavailable: Please contact administrator') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Authentication unavailable: Please contact administrator') }),
        signOut: () => Promise.resolve({ error: new Error('Authentication unavailable') }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      }
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}