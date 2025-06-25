
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

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}
export const NotificationsModal: React.FC<NotificationsModalProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Notificações</DialogTitle>
        <DialogDescription>
          Exemplo: configure notificações.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-purple-600" /> Notificações por e-mail
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" className="accent-purple-600" /> Notificações push
        </label>
      </div>
      <DialogClose asChild>
        <Button variant="outline" className="w-full">Fechar</Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);
