import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Bell } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface MobileHeaderProps {
  user: any;
  searchesLeft: number;
  isPremium: boolean;
  onLogout: () => void;
  onUpgrade: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const MobileHeader = ({ 
  user, 
  searchesLeft, 
  isPremium, 
  onLogout, 
  onUpgrade,
  activeSection,
  onSectionChange 
}: MobileHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-soft border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo no canto esquerdo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-dark to-purple-medium rounded-xl flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-poppins font-bold bg-gradient-to-r from-purple-dark to-purple-medium bg-clip-text text-transparent">
            POZZY
          </h1>
        </div>

        {/* Espaço para centralizar */}
        <div className="flex-1" />

        {/* Sininho à esquerda do botão Upgrade */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl text-purple-dark p-2"
                aria-label="Notificações"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8}>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-800 mb-1">Notificações</span>
                <p className="text-sm text-gray-600">
                  Recomendações para você podem aparecer aqui em breve!
                </p>
              </div>
            </PopoverContent>
          </Popover>
          {!isPremium && (
            <Button 
              onClick={onUpgrade}
              className="btn-primary rounded-xl flex items-center px-2 py-1 text-xs font-medium"
            >
              <Crown className="h-4 w-4 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
