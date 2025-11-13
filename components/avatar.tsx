import { createClient } from "@/lib/supabase/server"
import { CircleUser } from 'lucide-react'
import Image from 'next/image'

export default async function Avatar({ width = 32, height = 32 }) {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // If no user (demo mode) or user has no avatar, show default icon
    if (userError || !user || !user.user_metadata?.avatar) {
      return <CircleUser className="w-6 h-6" />
    }

    // Check if avatar is stored as base64 (fallback mode)
    if (user.user_metadata.avatarBase64) {
      return (
        <Image 
          src={user.user_metadata.avatarBase64} 
          width={width} 
          height={height} 
          alt="User avatar" 
          className="rounded-full object-cover"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      )
    }

    // Check if avatar filename indicates fallback mode
    if (user.user_metadata.avatar.startsWith('fallback_')) {
      return <CircleUser className="w-6 h-6" />
    }

    // Try to get signed URL from Supabase Storage
    const { data: imageData, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(user.user_metadata.avatar, 60 * 60) // 1 hour expiry

    if (error || !imageData?.signedUrl) {
      console.log('Error creating signed URL for avatar:', error)
      return <CircleUser className="w-6 h-6" />
    }

    return (
      <Image 
        src={imageData.signedUrl} 
        width={width} 
        height={height} 
        alt="User avatar" 
        className="rounded-full object-cover"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    )
  } catch (error) {
    // Fallback for any errors (like in demo mode)
    console.log('Avatar component fallback to default icon:', error)
    return <CircleUser className="w-6 h-6" />
  }
}