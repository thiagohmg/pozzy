import React, { useState } from "react";
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

// Supondo que você use Supabase Auth
import { supabase } from "../../integrations/supabase/client";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}
export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onOpenChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validação simples
  const isValid = newPassword.length >= 8 && newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!isValid) {
      setError("A nova senha deve ter pelo menos 8 caracteres e coincidir com a confirmação.");
      return;
    }
    setLoading(true);
    // Supabase não exige senha atual, mas você pode validar no backend se quiser
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setError(error.message || "Erro ao alterar senha.");
    } else {
      setSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => onOpenChange(false), 1500);
    }
  };

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogDescription>
            Defina uma nova senha para sua conta.
        </DialogDescription>
      </DialogHeader>
        <form className="py-4 space-y-3" onSubmit={handleChangePassword}>
          {/* Campo de senha atual (opcional, pode remover se não quiser) */}
          {/*
          <div>
            <label className="block text-sm mb-1">Senha atual</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          */}
          <div>
            <label className="block text-sm mb-1">Nova senha</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirmar nova senha</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-500 text-xs py-1">{error}</div>}
          {success && <div className="text-green-600 text-xs py-1">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading || !isValid}>
            {loading ? "Salvando..." : "Salvar Senha"}
          </Button>
        </form>
      <DialogClose asChild>
        <Button variant="outline" className="w-full">Fechar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
};
