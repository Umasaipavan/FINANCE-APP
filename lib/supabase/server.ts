import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CookieOptions } from '@supabase/ssr';

export function createClient() {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', { 
      url: !!supabaseUrl, 
      key: !!supabaseAnonKey,
      urlValue: supabaseUrl ? 'SET' : 'MISSING',
      keyValue: supabaseAnonKey ? 'SET' : 'MISSING'
    });
    
    // Return a mock client that will provide more helpful error messages
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Environment variables not configured on Vercel. Please check your deployment settings.') }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Authentication unavailable: Supabase environment variables missing in production deployment.') }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Authentication unavailable: Supabase environment variables missing in production deployment.') }),
        signOut: () => Promise.resolve({ error: new Error('Authentication unavailable: Supabase not configured') }),
        updateUser: () => Promise.resolve({ data: { user: null }, error: new Error('Authentication unavailable: Supabase not configured') })
      },
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ range: () => Promise.resolve({ data: [], error: new Error('Database unavailable: Supabase not configured') }) }) }) }),
        insert: () => Promise.resolve({ error: new Error('Database unavailable: Supabase not configured') }),
        update: () => ({ eq: () => Promise.resolve({ error: new Error('Database unavailable: Supabase not configured') }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: new Error('Database unavailable: Supabase not configured') }) })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: new Error('Storage unavailable: Supabase not configured') }),
          remove: () => Promise.resolve({ error: new Error('Storage unavailable: Supabase not configured') })
        })
      }
    } as any;
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}