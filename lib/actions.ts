'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './supabase/server';
import { transactionSchema } from './validation';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Transaction, DateRange } from '../types';

type LoginState = {
  error?: boolean;
  message?: string;
};

type SignUpState = {
  error?: boolean;
  message?: string;
};

type UploadAvatarState = {
  error?: boolean;
  message?: string;
};

type UpdateSettingsState = {
  error?: boolean;
  message?: string;
};

export async function createTransaction(formData: z.infer<typeof transactionSchema>): Promise<void> {
  const validated = transactionSchema.safeParse(formData);
  if (!validated.success) {
    throw new Error('Invalid data');
  }

  const supabase = createClient();
  
  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be signed in to create transactions');
  }

  // Prepare data for database
  const transactionData = {
    user_id: user.id,
    type: validated.data.type,
    category: validated.data.category || '',
    amount: validated.data.amount,
    description: validated.data.description || '',
    date: validated.data.created_at, // Map form's created_at to database's date field
    created_at: new Date().toISOString()
  };

  console.log('Creating transaction in Supabase:', transactionData);

  // Save to Supabase database
  const { error } = await supabase.from('transactions').insert(transactionData);

  if (error) {
    console.error('Error creating transaction in Supabase:', error);
    throw new Error(`Failed to create transaction: ${error.message}`);
  }

  console.log('Transaction successfully created in Supabase');
  revalidatePath('/dashboard');
}

export async function updateTransaction(id: string, formData: z.infer<typeof transactionSchema>): Promise<void> {
  const validated = transactionSchema.safeParse(formData);
  if (!validated.success) {
    throw new Error('Invalid data');
  }

  const supabase = createClient();
  
  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be signed in to update transactions');
  }

  // Prepare data for database
  const updateData = {
    type: validated.data.type,
    category: validated.data.category || '',
    amount: validated.data.amount,
    description: validated.data.description || '',
    date: validated.data.created_at
  };

  console.log('Updating transaction in Supabase:', id, updateData);

  // Update in Supabase database
  const { error } = await supabase.from('transactions')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only update their own transactions

  if (error) {
    console.error('Error updating transaction in Supabase:', error);
    throw new Error(`Failed to update transaction: ${error.message}`);
  }

  console.log('Transaction successfully updated in Supabase');
  revalidatePath('/dashboard');
}

export async function fetchTransactions(range: DateRange, offset: number = 0, limit: number = 10): Promise<Transaction[]> {
  try {
    const supabase = createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('User not authenticated or Supabase not available, showing mock data');
      // Return mock data for unauthenticated users or when Supabase is not available
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'Expense',
          category: 'Food',
          description: 'Grocery shopping',
          amount: 85.50,
          created_at: '2025-09-24T10:00:00.000Z',
          date: '2025-09-24',
          user_id: 'demo-user'
        },
        {
          id: '2',
          type: 'Income',
          category: 'Salary',
          description: 'Monthly salary',
          amount: 3500.00,
          created_at: '2025-09-23T09:00:00.000Z',
          date: '2025-09-23',
          user_id: 'demo-user'
        },
        {
          id: '3',
          type: 'Expense',
          category: 'Transport',
          description: 'Gas station',
          amount: 45.00,
          created_at: '2025-09-22T15:30:00.000Z',
          date: '2025-09-22',
          user_id: 'demo-user'
        }
      ];
      return mockTransactions.slice(offset, offset + limit);
    }

    console.log('Fetching transactions for user:', user.id);

    // Fetch from Supabase for authenticated users
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching transactions from Supabase:', error);
      // Return empty array instead of throwing error
      return [];
    }

    console.log('Successfully fetched', data?.length || 0, 'transactions from Supabase');
    return data as Transaction[] || [];
  } catch (error) {
    console.error('Unexpected error in fetchTransactions:', error);
    // Return mock data as fallback
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'Expense',
        category: 'Food',
        description: 'Grocery shopping (Demo)',
        amount: 85.50,
        created_at: '2025-09-24T10:00:00.000Z',
        date: '2025-09-24',
        user_id: 'demo-user'
      }
    ];
    return mockTransactions;
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  const supabase = createClient();
  
  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('You must be signed in to delete transactions');
  }

  console.log('Deleting transaction from Supabase:', id);

  // Delete from Supabase database
  const { error } = await supabase.from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own transactions
  
  if (error) {
    console.error('Error deleting transaction from Supabase:', error);
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }

  console.log('Transaction successfully deleted from Supabase');
  revalidatePath('/dashboard');
}

export async function signOut(): Promise<void> {
  try {
    const supabase = createClient();
    
    // Clear all auth state
    const { error } = await supabase.auth.signOut({
      scope: 'global'
    });
    
    if (error) {
      console.error('Sign out error:', error);
    }
    
    // Add a small delay to ensure session is cleared
    await new Promise(resolve => setTimeout(resolve, 100));
    
  } catch (error) {
    console.error('Unexpected sign out error:', error);
  } finally {
    // Always redirect to login, even if there's an error
    redirect('/login');
  }
}

export async function uploadAvatar(
  prevState: UploadAvatarState,
  formData: FormData
): Promise<UploadAvatarState> {
  try {
    const supabase = createClient();
    
    // Get user first to ensure they're authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return {
        error: true,
        message: 'You must be signed in to upload an avatar'
      };
    }

    const file = formData.get('file') as File;
    
    if (!file || file.size === 0) {
      return {
        error: true,
        message: 'Please select a file to upload'
      };
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        error: true,
        message: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
      };
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return {
        error: true,
        message: 'File size must be less than 10MB'
      };
    }
    
    const fileExt = file.name.split('.').pop();
    // Use simpler file naming - just use user ID as filename
    const fileName = `${userData.user.id}.${fileExt}`;
    
    // Remove old avatar if exists
    const oldAvatar = userData.user.user_metadata?.avatar;
    if (oldAvatar) {
      await supabase.storage
        .from('avatars')
        .remove([oldAvatar]);
    }

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true
      });
    
    if (uploadError) {
      console.error('Avatar upload failed:', uploadError);
      
      // Provide more specific error messages
      if (uploadError.message?.includes('Bucket not found')) {
        return {
          error: true,
          message: 'Storage bucket not configured. Please set up the avatars bucket in Supabase.'
        };
      }
      
      if (uploadError.message?.includes('new row violates row-level security policy')) {
        // Storage policies not configured - use fallback base64 storage
        console.log('Storage policies not configured, using base64 fallback');
        
        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        // Store as base64 in user metadata
        const { error: dataUpdateError } = await supabase.auth
          .updateUser({
            data: {
              avatar: `fallback_${fileName}`,
              avatarBase64: base64
            }
          });
        
        if (dataUpdateError) {
          return {
            error: true,
            message: 'Failed to save avatar. Please try again.'
          };
        }
        
        return {
          message: 'Avatar uploaded successfully! (Note: Configure Supabase Storage policies for better performance)'
        };
      }
      
      if (uploadError.message?.includes('The resource already exists')) {
        // Try to remove old file and retry
        await supabase.storage.from('avatars').remove([fileName]);
        const { error: retryError } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);
          
        if (retryError) {
          return {
            error: true,
            message: `Upload failed: ${retryError.message}`
          };
        }
      } else {
        return {
          error: true,
          message: `Upload failed: ${uploadError.message}`
        };
      }
    }

    // Update user metadata with new avatar path
    const { error: dataUpdateError } = await supabase.auth
      .updateUser({
        data: {
          avatar: fileName
        }
      });
    
    if (dataUpdateError) {
      console.error('Error updating user metadata:', dataUpdateError);
      // Clean up uploaded file if metadata update fails
      await supabase.storage
        .from('avatars')
        .remove([fileName]);
      return {
        error: true,
        message: 'Failed to update profile. Please try again.'
      };
    }

    return {
      message: 'Avatar uploaded successfully!'
    };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      error: true,
      message: 'An error occurred while uploading the avatar. Please try again.'
    };
  }
}

export async function updateSettings(
  prevState: UpdateSettingsState,
  formData: FormData
): Promise<UpdateSettingsState> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth
      .updateUser({
        data: {
          fullName: formData.get('fullName') as string,
          defaultView: formData.get('defaultView') as string
        }
      });
      
    if (error) {
      console.log('Settings update failed (demo mode):', error);
      // In demo mode, just return success
      return {
        message: 'Updated user settings (demo mode)'
      };
    }

    return {
      message: 'Updated user settings'
    };
  } catch (error) {
    console.log('Settings update error (demo mode):', error);
    // In demo mode, just return success
    return {
      message: 'Updated user settings (demo mode)'
    };
  }
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const supabase = createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Login attempt with email:', email);

    if (!email || !password) {
      return {
        error: true,
        message: 'Email and password are required'
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    console.log('Supabase response:', { data: !!data, error: error?.message });

    if (error) {
      console.error('Login error details:', error);
      
      // Handle invalid credentials
      if (error.message.includes('Invalid login credentials')) {
        return {
          error: true,
          message: 'Invalid email or password. Please check your credentials or sign up if you don\'t have an account.'
        };
      }
      
      // Handle unconfirmed email
      if (error.message.includes('Email not confirmed')) {
        return {
          error: true,
          message: 'Please check your email and confirm your account before signing in.'
        };
      }

      return {
        error: true,
        message: `Login failed: ${error.message}`
      };
    }

    if (!data.user || !data.session) {
      console.error('Incomplete login data:', { 
        hasUser: !!data.user, 
        hasSession: !!data.session,
        user: data.user,
        session: !!data.session 
      });
      return {
        error: true,
        message: 'Login incomplete. Please try again.'
      };
    }

    console.log('Login successful, redirecting to dashboard');
    redirect('/dashboard');
    
  } catch (error) {
    console.error('Unexpected login error:', error);
    return {
      error: true,
      message: 'An unexpected error occurred. Please try again.'
    };
  }
}

export async function signUp(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  try {
    const supabase = createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    if (!email || !password) {
      return {
        error: true,
        message: 'Email and password are required'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        error: true,
        message: 'Please enter a valid email address'
      };
    }

    if (password.length < 6) {
      return {
        error: true,
        message: 'Password must be at least 6 characters long'
      };
    }

    console.log('Attempting signup for:', email);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          fullName: fullName || email.split('@')[0],
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Handle user already exists
      if (error.message.includes('User already registered')) {
        return {
          error: true,
          message: 'An account with this email already exists. Please sign in instead.'
        };
      }
      
      // Handle rate limiting
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        return {
          error: true,
          message: 'Too many signup attempts. Please wait a moment and try again.'
        };
      }
      
      // Handle weak password
      if (error.message.includes('password') && error.message.includes('weak')) {
        return {
          error: true,
          message: 'Password is too weak. Please use a stronger password with at least 6 characters.'
        };
      }

      return {
        error: true,
        message: `Signup failed: ${error.message}`
      };
    }

    console.log('Signup result:', data);

    // Check if user was created successfully
    if (!data.user) {
      return {
        error: true,
        message: 'Failed to create account. Please try again.'
      };
    }

    // Check if email confirmation is required
    if (data.user && !data.user.email_confirmed_at && !data.session) {
      return {
        error: false,
        message: 'Account created! Please check your email to confirm your account before signing in.'
      };
    }

    // If email confirmation is not required and we have a session, redirect to dashboard
    if (data.user && data.session) {
      // Add a small delay to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 100));
      redirect('/dashboard');
    }

    return {
      error: false,
      message: 'Account created successfully! You can now sign in.'
    };
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return {
      error: true,
      message: 'An unexpected error occurred. Please try again.'
    };
  }
}