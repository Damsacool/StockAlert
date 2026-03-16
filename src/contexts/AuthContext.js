import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

 const loadProfile = async (userId) => {
  try {
    console.log('Loading profile for user:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Profile load error:', error);
      setProfile(null);
      setLoading(false);
      return null;
    }

    console.log('Profile loaded:', data);
    setProfile(data);
    setLoading(false);
    return data;
  } catch (err) {
    console.error('Profile fetch failed:', err);
    setProfile(null);
    setLoading(false);
    return null;
  }
};


  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signUp = async (email, password, fullName, role = 'owner', extra = {}) => {
  try {
    console.log('Creating account with role:', role); 

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...extra
        }
      }
    });

    if (error) return { data: null, error };

    if (authData.user) {
      const userId = authData.user.id;
      
      // Force confirm email
      await supabase.rpc('confirm_user_email', { user_id: userId });

      const profileData = {
        id: userId,
        email,
        full_name: fullName,
        role: role, 
        tenant_id: userId, 
        created_by: userId
      };

      console.log('Creating profile:', profileData); 

      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([profileData]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return { data: null, error: profileError };
      }
    }

    return { data: authData, error: null };
  } catch (err) {
    console.error('Signup error:', err);
    return { data: null, error: err };
  }
};

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    return { error };
  };

  const isOwner = profile?.role === 'owner';
  const isWorker = profile?.role === 'worker';

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isOwner,
    isWorker
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};