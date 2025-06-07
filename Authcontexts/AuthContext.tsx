'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    username: string,
    role: string,
    name: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await createClient()
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data?.role || null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange(async (event: string, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch user role after setting user
        setTimeout(async () => {
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
          setLoading(false);
        }, 0);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    // Check for existing session
    createClient().auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then((role) => {
          setUserRole(role);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    username: string,
    role: string,
    name: string
  ) => {
    try {
      const { data, error } = await createClient().auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
            name, // Pass name to Supabase auth options
          },
        },
      });

      if (error) throw error;

      // After successful Supabase auth signup, insert into public.users table
      if (data.user) {
        const { error: insertError } = await createClient().from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: username,
          role: role,
          name: name, // Insert the name into your public.users table
        });

        if (insertError) {
          console.error('Error inserting user into public.users:', insertError);
          // Optionally, you might want to roll back the auth.users entry or handle this error differently
          throw new Error(
            `Failed to create user profile: ${insertError.message}`
          );
        }
      }

      toast({
        title: 'Account created successfully!',
        description: 'You can now sign in with your credentials.',
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
