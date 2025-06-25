
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AppUser {
  uid: string;
  email: string;
  searchesUsed: number;
  isPremium: boolean;
}

export const useAuthHandlers = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    console.log('Tentando fazer login...');
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('Login realizado com sucesso');
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao POZZY",
      });
    }
    
    setLoading(false);
  };

  const handleRegister = async (email: string, password: string) => {
    console.log('Tentando registrar usuário...');
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } else {
      console.log('Cadastro realizado com sucesso');
      toast({
        title: "Conta criada!",
        description: "Verifique seu email para ativar a conta",
      });
    }
    
    setLoading(false);
  };

  const handleLogout = async () => {
    console.log('Fazendo logout...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro no logout:', error);
    }
    toast({
      title: "Logout realizado",
      description: "Até a próxima!",
    });
  };

  return {
    handleLogin,
    handleRegister,
    handleLogout,
    loading
  };
};
