import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  hasRole: (role: "admin" | "vendor" | "customer") => Promise<boolean>;
  getUserRole: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: error.message,
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error.message,
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في إنشاء الحساب",
          description: error.message,
        });
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يمكنك الآن تسجيل الدخول",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ في إنشاء الحساب",
        description: error.message,
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clear local state first
      setUser(null);
      setSession(null);
      
      // Sign out from Supabase (ignore errors if session is already gone)
      const { error } = await supabase.auth.signOut();
      
      if (error && !error.message.includes("Session not found")) {
        console.error("Sign out error:", error);
      }
      
      toast({
        title: "تم تسجيل الخروج بنجاح",
      });
      
      // Navigate to home page
      navigate("/");
      
      // Force reload to clear any cached state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error: any) {
      console.error("Unexpected sign out error:", error);
      // Still clear local state and navigate even if there's an error
      setUser(null);
      setSession(null);
      navigate("/");
      window.location.reload();
    }
  };

  const hasRole = async (role: "admin" | "vendor" | "customer") => {
    if (!user) return false;
    
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", role)
      .maybeSingle();
    
    return !!data;
  };

  const getUserRole = async () => {
    if (!user) return null;
    
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    
    return data?.role || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        signIn,
        signUp,
        signOut,
        loading,
        hasRole,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
