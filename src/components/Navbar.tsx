import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { NotificationCenter } from './NotificationCenter';
import { WebProfileMenu } from './WebProfileMenu';

interface User {
  uid: string;
  email: string;
  isPremium?: boolean;
}

interface NavbarProps {
  user: User | null;
  searchesLeft: number;
  isPremium: boolean;
  onLogout: () => void;
  onUpgrade: () => void;
  userId: string;
  onAuthClick: () => void;
}

export const Navbar = ({ 
  user, 
  searchesLeft, 
  isPremium, 
  onLogout, 
  onUpgrade, 
  userId,
  onAuthClick
}: NavbarProps) => {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-soft border-b border-gray-100 sticky top-0 z-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo estilizado à esquerda */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-dark to-purple-medium rounded-2xl flex items-center justify-center shadow-soft">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-poppins font-bold bg-gradient-to-r from-purple-dark to-purple-medium bg-clip-text text-transparent">
                POZZY
              </h1>
            </div>
          </div>
          
          {/* Status e ações à direita */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                
                {/* --- Ações e Menu de Perfil para Desktop --- */}
                <div className="hidden md:flex items-center space-x-4">
                  {isPremium ? (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-lilac-light rounded-2xl shadow-soft">
                      <Crown className="h-4 w-4 text-purple-dark" />
                      <span className="font-medium text-purple-dark">Premium</span>
                    </div>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-2xl shadow-soft">
                      <span className="font-medium text-gray-700">Restantes: <strong className="text-purple-dark">{searchesLeft}</strong></span>
                    </div>
                  )}
                  <div className="hidden md:block">
                    <WebProfileMenu
                      userId={userId}
                      userEmail={user?.email}
                      onLogout={onLogout}
                    />
                  </div>
                </div>

                {/* --- Botão de Upgrade visível em mobile também --- */}
                {!isPremium && (
                  <Button 
                    onClick={onUpgrade}
                    className="btn-primary text-sm font-medium"
                  >
                    <Crown className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Upgrade</span>
                  </Button>
                )}
              </>
            ) : (
               <Button onClick={onAuthClick} className="btn-primary text-sm font-medium">
                  Entrar / Cadastrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
