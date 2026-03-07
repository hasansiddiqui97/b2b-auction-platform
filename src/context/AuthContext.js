'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    async function checkSession() {
      if (!isSupabaseConfigured()) {
        // Fallback: check localStorage (for demo mode)
        const savedUserId = localStorage.getItem('hw_user_id');
        if (savedUserId) {
          // Fetch user profile
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', savedUserId)
            .single();
          
          if (data) {
            setUser({
              id: data.id,
              email: data.email,
              full_name: data.full_name,
              role: data.role,
              is_verified: data.is_verified,
            });
          }
        }
      }
      setLoading(false);
    }

    checkSession();
  }, []);

  // Sign in with email/password
  const signIn = async (email, password) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('No account found with this email');
    }

    // Verify password (simple comparison for demo)
    if (data.password !== password) {
      throw new Error('Incorrect password');
    }

    // Save to localStorage
    localStorage.setItem('hw_user_id', data.id);
    
    setUser({
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_verified: data.is_verified,
    });

    return data;
  };

  // Sign up
  const signUp = async (email, password, fullName, role = 'buyer') => {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email,
        password, // In production, hash this!
        full_name: fullName,
        role,
      })
      .select()
      .single();

    if (error) throw error;

    localStorage.setItem('hw_user_id', data.id);
    
    setUser({
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_verified: data.is_verified,
    });

    return data;
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem('hw_user_id');
    setUser(null);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
