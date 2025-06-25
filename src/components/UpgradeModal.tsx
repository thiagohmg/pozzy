
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onOpenChange,
  onUpgrade,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 justify-center">
          <Crown className="h-5 w-5 text-orange-500" />
          Experimente o Premium Pozzy
        </DialogTitle>
        <DialogDescription>
          <div className="flex flex-col gap-3 mt-2 items-center">
            <span className="text-lg font-bold text-purple-dark">R$19,90/mês</span>
            <span className="text-xs text-gray-500">Assinatura sem fidelidade, cancele quando quiser.</span>
          </div>
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-3 my-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-gray-700 text-sm">Acesso ilimitado a buscas personalizadas</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-gray-700 text-sm">Prioridade em novas funcionalidades</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span className="text-gray-700 text-sm">Suporte e consultoria exclusiva</span>
        </div>
      </div>
      <Button 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold"
        onClick={onUpgrade}
      >
        Fazer upgrade para Premium
      </Button>
      <DialogClose asChild>
        <Button variant="outline" className="w-full mt-2">Fechar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
