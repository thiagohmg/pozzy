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

interface PlanModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}
export const PlanModal: React.FC<PlanModalProps> = ({ open, onOpenChange }) => {
  // MOCK: dados fictícios, depois integrar com backend
  const [plan] = useState("Premium");
  const [status] = useState("Ativo");
  const [expiration] = useState("2024-12-31");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleUpgrade = () => {
    setFeedback("Funcionalidade de upgrade em breve!");
  };

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Plano/Assinatura</DialogTitle>
        <DialogDescription>
            Veja detalhes do seu plano e faça upgrade quando disponível.
        </DialogDescription>
      </DialogHeader>
        <div className="py-4 space-y-3">
          <div>
            <span className="text-sm text-gray-600">Plano atual:</span>
            <span className="ml-2 font-bold text-purple-700">{plan}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`ml-2 font-bold ${status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>{status}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Expira em:</span>
            <span className="ml-2 font-medium text-gray-900">{expiration}</span>
          </div>
          <Button variant="secondary" className="mt-2 w-full" onClick={handleUpgrade} disabled={loading}>
            Fazer Upgrade
          </Button>
          {feedback && <div className="text-blue-600 text-xs py-1">{feedback}</div>}
      </div>
      <DialogClose asChild>
        <Button variant="outline" className="w-full">Fechar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
};
