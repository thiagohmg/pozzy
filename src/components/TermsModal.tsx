
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

export const TermsModal: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Termos de Uso e Política de Privacidade</DialogTitle>
        <DialogDescription>
          Bem-vindo(a) à plataforma Fashion Finder!
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto text-sm">
        <p>
          Ao criar uma conta, você concorda com os seguintes termos:
        </p>
        <ol className="list-decimal pl-4 space-y-2">
          <li>Suas informações são usadas apenas para acesso e personalização da experiência.</li>
          <li>Não compartilhamos seus dados pessoais com terceiros, exceto para cumprir obrigações legais.</li>
          <li>Você pode acessar, corrigir ou excluir seus dados a qualquer momento entrando em contato conosco.</li>
          <li>O uso do sistema é destinado a fins pessoais. Não utilize a plataforma para fins ilícitos.</li>
          <li>Sujeito a alterações a qualquer momento, consulte sempre as versões mais recentes.</li>
        </ol>
        <p>
          Para mais informações, leia nossa{" "}
          <a
            href="#"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade
          </a>.
        </p>
        <p>
          Em caso de dúvidas, entre em contato pelo e-mail: suporte@fashionfinder.com
        </p>
      </div>
      <DialogClose asChild>
        <Button variant="outline" className="w-full mt-2">Fechar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
