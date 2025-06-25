import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { supabase } from "../../integrations/supabase/client";

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}
export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ open, onOpenChange }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onOpenChange(false);
    // (Opcional) Redirecionar para tela de login, se necessário
    // window.location.href = '/login';
  };

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Excluir Conta</DialogTitle>
        <DialogDescription>
            Escolha se deseja apenas sair do app ou excluir sua conta permanentemente.
        </DialogDescription>
      </DialogHeader>
        <div className="py-4 flex flex-col gap-3">
        <Button variant="destructive" className="w-full">Excluir definitivamente</Button>
          <Button variant="secondary" className="w-full" onClick={handleLogout}>Sair do App</Button>
      </div>
      <DialogClose asChild>
        <Button variant="outline" className="w-full mt-2">Cancelar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
};
