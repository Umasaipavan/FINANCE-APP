import { redirect } from 'next/navigation'

export default async function Home() {
  // Always redirect to dashboard - let the dashboard handle auth state
  redirect('/dashboard')
}
