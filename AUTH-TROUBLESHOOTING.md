# Authentication Troubleshooting Guide

## "Invalid login credentials" Error

This error typically occurs when:

### 1. **User hasn't signed up yet**
- **Solution**: First create an account using the signup form, then try signing in.

### 2. **Email confirmation required**
- **Check**: Go to your Supabase dashboard → Authentication → Settings
- **Look for**: "Enable email confirmations" setting
- **If enabled**: Users must click the confirmation link in their email before they can sign in
- **Solution**: Either disable email confirmation for testing, or check your email for the confirmation link

### 3. **Database not set up**
- **Solution**: Run the `supabase-setup.sql` script in your Supabase SQL editor

## Steps to Fix:

### Step 1: Set up your Supabase database
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `hbuqtohiwmvvykdmyqae`
3. Go to "SQL Editor" 
4. Copy and paste the contents of `supabase-setup.sql`
5. Click "Run"

### Step 2: Configure Authentication Settings
1. Go to Authentication → Settings
2. **For testing**: Disable "Enable email confirmations" 
3. **For production**: Keep it enabled but check your email

### Step 3: Test the Flow
1. **First**: Go to `/signup` and create a new account
2. **If email confirmation disabled**: You'll be automatically logged in
3. **If email confirmation enabled**: Check your email and click the confirmation link
4. **Then**: Try signing in with the same credentials

## Quick Test:
```
Email: test@example.com
Password: test123
```

1. Go to `/signup`
2. Create account with above credentials
3. Go to `/login` 
4. Sign in with same credentials

## Still Having Issues?

Check the browser console (F12) for detailed error messages. The improved error handling will show more specific messages about what's going wrong.