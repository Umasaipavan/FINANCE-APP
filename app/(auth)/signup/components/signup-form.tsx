'use client'
import Input from "@/components/input";
import SubmitButton from "@/components/submit-button";
import { signUp } from "@/lib/actions";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useEffect, useRef } from "react";

const initialState = {
  message: '',
  error: false
}

export default function SignUpForm() {
  const [state, formAction] = useFormState(signUp, initialState);
  const formRef = useRef<HTMLFormElement>(null)

  // Clear form on successful signup
  useEffect(() => {
    if (state?.message && !state?.error) {
      // Don't clear immediately to show success message
    }
  }, [state])
  
  return (
    <div className="space-y-4">
      <form ref={formRef} action={formAction} className="space-y-4">
        <Input 
          type="text" 
          placeholder="Full Name (optional)"
          name="fullName"
          autoComplete="name"
        />
        <Input 
          type="email" 
          placeholder="name@example.com"
          name="email" 
          required
          autoComplete="email"
        />
        <Input 
          type="password" 
          placeholder="Password (min. 6 characters)"
          name="password" 
          required
          autoComplete="new-password"
        />
        <SubmitButton type="submit" size="sm" className="w-full">
          Create Account
        </SubmitButton>
        
        {state?.message && (
          <div className={`p-3 rounded-md text-sm text-center ${
            state?.error 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {state?.message}
          </div>
        )}
      </form>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}