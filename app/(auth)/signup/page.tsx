import SignUpForm from './components/signup-form';

export const metadata = {
  title: 'Sign Up',
};

export default function SignUpPage() {
  return (
    <main className="max-w-xs mx-auto">
      <h1 className="text-center text-2xl font-semibold mb-8">Create Account</h1>
      <SignUpForm />
    </main>
  );
}