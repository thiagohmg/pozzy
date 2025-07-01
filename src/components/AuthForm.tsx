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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Função para validar senha forte
  function isStrongPassword(pw: string) {
    return pw.length >= 8 && /[A-Za-z]/.test(pw) && /[0-9]/.test(pw);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      await onLogin({ email, password });
    } else {
      if (!isStrongPassword(password)) {
        setPasswordError('A senha deve ter pelo menos 8 caracteres, incluindo letras e números.');
        return;
      } else {
        setPasswordError('');
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError('As senhas não coincidem.');
        return;
      } else {
        setConfirmPasswordError('');
      }
      await onRegister({ name, phone, email, password });
    }
  };

  return (
    <Card className="w-full max-w-md p-4 border-0 shadow-none mt-12">
      <CardHeader className="text-center pt-8 pb-2">
        <CardTitle className="text-2xl mb-2">
          {isLoginView ? 'Bem-vindo(a) de volta!' : 'Crie sua conta'}
        </CardTitle>
        <CardDescription className="mb-2">
          {isLoginView ? 'Acesse para descobrir seu estilo.' : 'Cadastre-se para uma experiência completa.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isLoginView && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(99) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                  pattern="\(\d{2}\) \d{5}-\d{4}|\d{11}|\d{2} \d{5}-\d{4}|\d{10,11}"
                />
              </div>
            </>
          )}
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
            {!isLoginView && passwordError && (
              <div className="text-sm text-red-600 mt-1">{passwordError}</div>
            )}
          </div>
          {!isLoginView && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Repetir senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              {confirmPasswordError && (
                <div className="text-sm text-red-600 mt-1">{confirmPasswordError}</div>
              )}
            </div>
          )}
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
