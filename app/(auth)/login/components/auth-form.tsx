'use client';

import { useState } from 'react';
import Input from "@/components/input";
import Button from "@/components/button";
import { createClient } from '@/lib/supabase/client';

interface AuthFormProps {
  onSuccess?: () => void;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  mode: 'signin' | 'signup';
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const [state, setState] = useState<AuthState>({
    loading: false,
    error: null,
    message: null,
    mode: 'signin'
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setState(prev => ({ ...prev, error: 'Email and password are required' }));
      return;
    }

    if (state.mode === 'signup') {
      if (password !== confirmPassword) {
        setState(prev => ({ ...prev, error: 'Passwords do not match' }));
        return;
      }
      
      if (password.length < 6) {
        setState(prev => ({ ...prev, error: 'Password must be at least 6 characters' }));
        return;
      }

      if (!fullName.trim()) {
        setState(prev => ({ ...prev, error: 'Full name is required' }));
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null, message: null }));

    try {
      const supabase = createClient();
      
      if (state.mode === 'signup') {
        // Sign up new user
        console.log('Attempting to sign up with:', { email, fullName });
        
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: undefined, // Disable email confirmation
          }
        });

        console.log('Sign up result:', { data, error });

        if (error) {
          console.error('Sign up error details:', error);
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: `Sign up failed: ${error.message}` 
          }));
        } else if (data.user) {
          console.log('Sign up successful:', data.user.email);
          
          // Check if email confirmation is required
          if (data.user && !data.session) {
            setState(prev => ({ 
              ...prev, 
              loading: false, 
              message: 'Account created! Please check your email for a confirmation link before signing in.' 
            }));
          } else {
            setState(prev => ({ 
              ...prev, 
              loading: false, 
              message: 'Account created successfully! You can now sign in.' 
            }));
            
            // Switch to sign in mode after successful signup
            setTimeout(() => {
              setState(prev => ({ 
                ...prev, 
                mode: 'signin',
                message: null 
              }));
              setPassword('');
              setConfirmPassword('');
              setFullName('');
            }, 2000);
          }
        } else {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Sign up failed: Account creation was not successful. Please try again.' 
          }));
        }
      } else {
        // Sign in existing user
        console.log('Attempting to sign in with:', { email });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        console.log('Sign in result:', { data, error });

        if (error) {
          console.error('Sign in error details:', error);
          let errorMessage = 'Sign in failed: ';
          
          if (error.message.includes('Invalid login credentials')) {
            errorMessage += 'Either the email/password is wrong, or the account needs email confirmation. ';
            errorMessage += 'If you just signed up, please check if email confirmation is required in Supabase settings.';
          } else {
            errorMessage += error.message;
          }
          
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: errorMessage
          }));
        } else if (data.user && data.session) {
          console.log('Sign in successful:', data.user.email);
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            message: 'Successfully signed in!' 
          }));
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        } else {
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Sign in failed: No session created. Please check your credentials.' 
          }));
        }
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'An unexpected error occurred. Please try again.' 
      }));
    }
  };

  const toggleMode = () => {
    setState(prev => ({ 
      ...prev, 
      mode: prev.mode === 'signin' ? 'signup' : 'signin',
      error: null,
      message: null 
    }));
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">
          {state.mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {state.mode === 'signin' 
            ? 'Sign in to your account' 
            : 'Create a new account to get started'
          }
        </p>
      </div>

      {/* Error/Success Messages */}
      {state.error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:text-red-400 dark:border-red-800">
          {state.error}
        </div>
      )}
      
      {state.message && (
        <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/10 dark:text-green-400 dark:border-green-800">
          {state.message}
        </div>
      )}

      {/* Authentication Form */}
      <form onSubmit={handleAuth} className="space-y-4">
        {state.mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={state.loading}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={state.loading}
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={state.loading}
            minLength={6}
            autoComplete={state.mode === 'signup' ? 'new-password' : 'current-password'}
          />
          {state.mode === 'signup' && (
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        {state.mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={state.loading}
              minLength={6}
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={state.loading}
        >
          {state.loading 
            ? (state.mode === 'signin' ? 'Signing in...' : 'Creating account...') 
            : (state.mode === 'signin' ? 'Sign In' : 'Create Account')
          }
        </Button>
      </form>

      {/* Toggle Mode */}
      <div className="text-center text-sm">
        <span className="text-gray-500">
          {state.mode === 'signin' ? "Don&apos;t have an account? " : "Already have an account? "}
        </span>
        <button
          type="button"
          onClick={toggleMode}
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:underline"
          disabled={state.loading}
        >
          {state.mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}