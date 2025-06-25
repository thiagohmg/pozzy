import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Definindo o tipo de usuário que vamos usar na aplicação
interface AppUser {
  uid: string;
  email: string | undefined;
}

// Definindo a forma do nosso contexto
interface AuthContextType {
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (redirectSection?: string) => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
}

// Criando o contexto com um valor padrão undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Criando o provedor do contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [redirectSection, setRedirectSection] = useState<string | undefined>(undefined);

  useEffect(() => {
    // 1. Busca a sessão inicial para evitar flicker
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSupabaseUser(session.user);
        setUser({ uid: session.user.id, email: session.user.email });
      }
      setLoading(false);
    });

    // 2. Ouve por mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
      setUser(session?.user ? { uid: session.user.id, email: session.user.email } : null);
      
      // Se o usuário fez login com sucesso, fecha o modal e redireciona se necessário
      if (session?.user && isAuthModalOpen) {
        setIsAuthModalOpen(false);
        if (redirectSection && localStorage) {
          localStorage.setItem('activeSection', redirectSection);
          // Forçar um reload pode ser uma forma simples de garantir que o estado da UI atualize
          window.location.reload(); 
        }
      }
    });

    // Limpeza da inscrição ao desmontar o componente
    return () => {
      subscription.unsubscribe();
    };
  }, [isAuthModalOpen, redirectSection]);

  const openAuthModal = (section?: string) => {
    if (section) {
      setRedirectSection(section);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setRedirectSection(undefined);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  };

  const value = {
    user,
    supabaseUser,
    loading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 