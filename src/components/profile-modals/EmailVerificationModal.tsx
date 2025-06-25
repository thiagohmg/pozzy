import React, { useEffect, useState } from "react";
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

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}
export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setFeedback("");
    setError("");
    setLoading(true);
    supabase.auth.getUser().then(({ data, error }) => {
      setLoading(false);
      if (error || !data?.user) {
        setError("Não foi possível obter o status do e-mail.");
        setIsVerified(null);
        setEmail("");
        return;
      }
      setEmail(data.user.email || "");
      setIsVerified(!!data.user.email_confirmed_at);
    });
  }, [open]);

  const handleResend = async () => {
    setFeedback("");
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.resend({ type: 'signup', email });
    setLoading(false);
    if (error) {
      setError(error.message || "Erro ao reenviar verificação.");
    } else {
      setFeedback("E-mail de verificação reenviado! Verifique sua caixa de entrada.");
    }
  };

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Verificação de E-mail</DialogTitle>
        <DialogDescription>
            Veja o status do seu e-mail e reenvie a verificação se necessário.
        </DialogDescription>
      </DialogHeader>
        <div className="py-4 space-y-3">
          <div>
            <div className="mb-1 text-sm text-gray-600">E-mail</div>
            <div className="font-medium text-gray-900">{email || '-'}</div>
          </div>
          <div>
            <span className={`text-sm font-medium ${isVerified ? 'text-green-600' : 'text-red-600'}`}>Status: {isVerified === null ? '...' : isVerified ? 'Verificado' : 'Não verificado'}</span>
          </div>
          {!isVerified && (
            <Button variant="secondary" className="mt-2" onClick={handleResend} disabled={loading}>
              {loading ? 'Enviando...' : 'Reenviar verificação'}
            </Button>
          )}
          {feedback && <div className="text-green-600 text-xs py-1">{feedback}</div>}
          {error && <div className="text-red-500 text-xs py-1">{error}</div>}
      </div>
      <DialogClose asChild>
        <Button variant="outline" className="w-full">Fechar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
};
