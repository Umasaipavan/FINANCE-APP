import LoginForm from './components/login-form';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In',
};

interface PageProps {
  searchParams?: {
    error?: string;
    details?: string;
  };
}

export default function LoginPage({ searchParams }: PageProps) {
  return (
    <main className="max-w-xs mx-auto">
      <h1 className="text-center text-2xl font-semibold mb-8">Sign In</h1>
      <div className="space-y-4">
        <LoginForm />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}