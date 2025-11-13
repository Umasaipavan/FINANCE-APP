import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            There was a problem with the authentication process.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              Possible Issues:
            </h3>
            <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
              <li>Invalid or expired authentication code</li>
              <li>Supabase configuration issues</li>
              <li>Network connectivity problems</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/login" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Login Again
            </Link>
            
            <Link 
              href="/signup" 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}