import { createClient } from "@/lib/supabase/server"
import SettingsForm from "./components/settings-form"

export default async function Page() {
  try {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // Provide default values for demo mode
    const defaults = user?.user_metadata || {
      fullName: 'Demo User',
      defaultView: 'dashboard'
    }
    
    return (<>
      <h1 className="text-4xl font-semibold mb-8">
        Settings
      </h1>
      <SettingsForm defaults={defaults} />
    </>)
  } catch (error) {
    // Fallback for demo mode
    const defaults = {
      fullName: 'Demo User',
      defaultView: 'dashboard'
    }
    
    return (<>
      <h1 className="text-4xl font-semibold mb-8">
        Settings
      </h1>
      <SettingsForm defaults={defaults} />
    </>)
  }
}