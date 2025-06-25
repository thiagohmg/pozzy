import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { AuthForm } from '@/components/AuthForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLogin: (data: any) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  loading: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onOpenChange,
  onLogin,
  onRegister,
  loading
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md w-full overflow-hidden">
        <div className="relative">
          <DialogClose asChild>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-800 transition-colors z-10"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
          
          <AuthForm onLogin={onLogin} onRegister={onRegister} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}; 