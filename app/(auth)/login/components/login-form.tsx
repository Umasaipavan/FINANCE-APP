'use client'
import Input from "@/components/input";
import SubmitButton from "@/components/submit-button";
import { login } from "@/lib/actions";
import { useFormState } from "react-dom"

const initialState = {
  message: '',
  error: false
}

export default function LoginForm() {
  const [state, formAction] = useFormState(login, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <Input 
        type="email" 
        placeholder="name@example.com"
        name="email" 
        required 
        autoComplete="email"
      />
      <Input 
        type="password" 
        placeholder="Password"
        name="password" 
        required 
        autoComplete="current-password"
      />
      <SubmitButton type="submit" size="sm" className="w-full">
        Sign in
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
  )
}