import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { SocialAuthButtons } from './SocialAuthButtons';

interface AuthFormProps {
  onLogin: (data: any) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  loading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, loading }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      await onLogin({ email, password });
    } else {
      await onRegister({ email, password });
    }
  };

  return (
    <Card className="w-full max-w-md p-4 border-0 shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isLoginView ? 'Bem-vindo(a) de volta!' : 'Crie sua conta'}
        </CardTitle>
        <CardDescription>
          {isLoginView ? 'Acesse para descobrir seu estilo.' : 'Cadastre-se para uma experiência completa.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full btn-primary" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              isLoginView ? 'Entrar' : 'Criar conta'
            )}
          </Button>
          <SocialAuthButtons />
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};
