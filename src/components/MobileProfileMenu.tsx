import React, { useState } from "react";
import { Menu, UserCog, KeyRound, MailCheck, CreditCard, Bell, Trash2, MessageSquare, Crown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EditProfileModal } from "@/components/profile-modals/EditProfileModal";
import { ChangePasswordModal } from "@/components/profile-modals/ChangePasswordModal";
import { EmailVerificationModal } from "@/components/profile-modals/EmailVerificationModal";
import { PlanModal } from "@/components/profile-modals/PlanModal";
import { NotificationsModal } from "@/components/profile-modals/NotificationsModal";
import { DeleteAccountModal } from "@/components/profile-modals/DeleteAccountModal";
import { FeedbackModal } from "@/components/FeedbackModal";

interface MobileProfileMenuProps {
  userId: string;
}

export const MobileProfileMenu: React.FC<MobileProfileMenuProps> = ({ userId }) => {
  const { toast } = useToast();

  // Modal state for each menu (could be refactored to useReducer if grows)
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [emailVerificationOpen, setEmailVerificationOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-0 flex-1 touch-target text-gray-500"
            style={{ backgroundColor: "transparent" }}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium truncate">Menu</span>
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="p-2 w-60 max-w-xs z-50">
          <ul className="flex flex-col gap-2">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2"
                onClick={() => setEditProfileOpen(true)}
              >
                <UserCog className="h-4 w-4 text-purple-600" />
                <span className="truncate text-left">Editar Perfil</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2"
                onClick={() => setChangePasswordOpen(true)}
              >
                <KeyRound className="h-4 w-4 text-indigo-600" />
                <span className="truncate text-left">Alterar Senha</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2"
                onClick={() => setEmailVerificationOpen(true)}
              >
                <MailCheck className="h-4 w-4 text-blue-600" />
                <span className="truncate text-left">Verificação de E-mail</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2"
                onClick={() => setPlanOpen(true)}
              >
                <CreditCard className="h-4 w-4 text-teal-600" />
                <span className="truncate text-left">Ver Plano/Assinatura</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-4 w-4 text-orange-500" />
                <span className="whitespace-normal break-words text-left text-sm leading-tight">Configurações de Notificações</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2"
                onClick={() => setFeedbackOpen(true)}
              >
                <MessageSquare className="h-4 w-4 text-purple-600" />
                <span className="truncate text-left">Enviar Feedback</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2 hover:bg-red-100"
                onClick={() => setDeleteAccountOpen(true)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                <span className="truncate text-left">Sair ou Excluir Conta</span>
              </Button>
            </li>
          </ul>
        </PopoverContent>
      </Popover>

      {/* Modais para cada item */}
      <EditProfileModal open={editProfileOpen} onOpenChange={setEditProfileOpen} userId={userId} />
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <EmailVerificationModal open={emailVerificationOpen} onOpenChange={setEmailVerificationOpen} />
      <PlanModal open={planOpen} onOpenChange={setPlanOpen} />
      <NotificationsModal open={notificationsOpen} onOpenChange={setNotificationsOpen} />
      <DeleteAccountModal open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen} />
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
};
