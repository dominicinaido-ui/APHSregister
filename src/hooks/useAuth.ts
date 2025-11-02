import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  username: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      // Handle refresh token errors by clearing the session
      if (error && error.message.includes('refresh_token_not_found')) {
        await supabase.auth.signOut();
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        window.location.reload();
        return;
      }

      if (session?.user && !error) {
        const username = session.user.email?.split('@')[0] || 'User';
        setUser({
          username: username.charAt(0).toUpperCase() + username.slice(1),
          email: session.user.email || ''
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const username = session.user.email?.split('@')[0] || 'User';
          setUser({
            username: username.charAt(0).toUpperCase() + username.slice(1),
            email: session.user.email || ''
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = () => {
    // Login is handled by the LoginForm component
    // This function is kept for compatibility
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };
};