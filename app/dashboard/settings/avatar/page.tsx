import Avatar from "@/components/avatar"
import { Suspense } from "react"
import AvatarUploadForm from "./components/avatar-upload-form"

export const metadata = {
  title: 'Avatar Settings',
}

export default function Page() {
  return (
    <>
      <h1 className="text-4xl font-semibold mb-8">
        Avatar
      </h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Current Avatar</h2>
        <div className="flex items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full w-16 h-16"></div>}>
            <Avatar width={128} height={128} />
          </Suspense>
        </div>
      </div>

      <AvatarUploadForm />
    </>
  )
}