import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Auth Error</h1>
        <p className="text-red-500">{error.message}</p>
      </div>
    }

    return <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">Supabase Connection Test</h1>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">User Status:</h2>
        {user ? (
          <div className="text-green-600">
            <p>✅ User authenticated</p>
            <p>Email: {user.email}</p>
            <p>User ID: {user.id}</p>
          </div>
        ) : (
          <p className="text-yellow-600">⚠️ No user authenticated</p>
        )}
      </div>
    </div>
  } catch (error) {
    return <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Connection Error</h1>
      <p className="text-red-500">{error.message}</p>
    </div>
  }
}