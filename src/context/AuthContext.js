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
      try {
        // Check localStorage first - try to get stored user info
        const savedUserInfo = localStorage.getItem('hw_user_info');
        const savedUserId = localStorage.getItem('hw_user_id');
        
        if (savedUserInfo) {
          // Use stored user info directly
          const userInfo = JSON.parse(savedUserInfo);
          setUser(userInfo);
        } else if (savedUserId) {
          // Fallback: try to fetch from Supabase
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', savedUserId)
            .single();
          
          if (data) {
            const userInfo = {
              id: data.id,
              email: data.email,
              full_name: data.full_name,
              role: data.role,
              is_verified: data.is_verified,
            };
            setUser(userInfo);
            // Store for future use
            localStorage.setItem('hw_user_info', JSON.stringify(userInfo));
          }
        }
      } catch (err) {
        console.log('Session check error:', err);
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

    // Verify password (bcrypt compare)
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.default.compare(password, data.password);
    if (!isValid) {
      throw new Error('Incorrect password');
    }

    // Save user ID AND info to localStorage
    const userInfo = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_verified: data.is_verified,
    };
    localStorage.setItem('hw_user_id', data.id);
    localStorage.setItem('hw_user_info', JSON.stringify(userInfo));
    
    setUser(userInfo);

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

    const userInfo = {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_verified: data.is_verified,
    };
    localStorage.setItem('hw_user_id', data.id);
    localStorage.setItem('hw_user_info', JSON.stringify(userInfo));
    
    setUser(userInfo);

    return data;
  };

  // Sign out
  const signOut = () => {
    localStorage.removeItem('hw_user_id');
    localStorage.removeItem('hw_user_info');
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
