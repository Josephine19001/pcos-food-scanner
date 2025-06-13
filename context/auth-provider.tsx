import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { router } from 'expo-router';
import { toast } from 'sonner-native';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  isSubscribed: boolean;
  subscriptionPlan: 'free' | 'pro' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'pro' | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { session: restored },
      } = await supabase.auth.getSession();
      setSession(restored);
      setUser(restored?.user ?? null);
      setLoading(false);
      if (restored) await loadSubscriptionStatus();
      else router.replace('/');
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          if (event === 'SIGNED_IN') {
            router.replace('/(tabs)/explore');
          }
          await loadSubscriptionStatus();
        } else {
          setIsSubscribed(false);
          setSubscriptionPlan('free');
          if (event === 'SIGNED_OUT') {
            router.replace('/');
          }
        }
        setLoading(false);
      }
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  const loadSubscriptionStatus = async () => {
    const { data, error } = (await supabase.rpc('get_account_for_user')) as {
      data: { subscription_status: string; subscription_plan: string } | null;
      error: Error | null;
    };
    if (!error && data) {
      setIsSubscribed(data.subscription_status === 'active');
      setSubscriptionPlan(data.subscription_plan as 'free' | 'pro');
    } else {
      setIsSubscribed(false);
      setSubscriptionPlan('free');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;
    // onAuthStateChange will handle the rest
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName },
      },
    });
    setLoading(false);
    if (error) throw error;

    if (!data.session) {
      toast.success('Check your email to verify your account');
    }
    // after email-verify and SIGNED_IN, onAuthStateChange and loadSubscriptionStatus will fire
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
    router.replace('/auth?mode=signin');
  };

  const value = {
    session,
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isSubscribed,
    subscriptionPlan,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
