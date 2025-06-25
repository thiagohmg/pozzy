import React, { useState } from "react";
import { UserCog, KeyRound, MailCheck, CreditCard, Bell, Trash2, LogOut, ChevronDown, MessageSquare } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { EditProfileModal } from "@/components/profile-modals/EditProfileModal";
import { ChangePasswordModal } from "@/components/profile-modals/ChangePasswordModal";
import { EmailVerificationModal } from "@/components/profile-modals/EmailVerificationModal";
import { PlanModal } from "@/components/profile-modals/PlanModal";
import { NotificationsModal } from "@/components/profile-modals/NotificationsModal";
import { DeleteAccountModal } from "@/components/profile-modals/DeleteAccountModal";
import { FeedbackModal } from "@/components/FeedbackModal";

interface WebProfileMenuProps {
  userId: string;
  userEmail?: string;
  onLogout: () => void;
}

export const WebProfileMenu: React.FC<WebProfileMenuProps> = ({ 
  userId, 
  userEmail = "",
  onLogout 
}) => {
  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [emailVerificationOpen, setEmailVerificationOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="rounded-2xl border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 shadow-soft flex items-center space-x-2 bg-white"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-purple-100 text-purple-700 font-semibold">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{userEmail.split('@')[0]}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          side="bottom" 
          align="end" 
          className="p-2 w-64 bg-white border border-gray-200 shadow-xl"
        >
          <div className="flex flex-col gap-1">
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-gray-100 mb-1">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-sm bg-purple-100 text-purple-700 font-semibold">
                    {getInitials(userEmail)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userEmail.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-purple-50"
              onClick={() => setEditProfileOpen(true)}
            >
              <UserCog className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Editar Perfil</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-indigo-50"
              onClick={() => setChangePasswordOpen(true)}
            >
              <KeyRound className="h-4 w-4 text-indigo-600" />
              <span className="text-sm">Alterar Senha</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-blue-50"
              onClick={() => setEmailVerificationOpen(true)}
            >
              <MailCheck className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Verificação de E-mail</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-teal-50"
              onClick={() => setPlanOpen(true)}
            >
              <CreditCard className="h-4 w-4 text-teal-600" />
              <span className="text-sm">Ver Plano/Assinatura</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-orange-50"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Configurações de Notificações</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-purple-50"
              onClick={() => setFeedbackOpen(true)}
            >
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Enviar Feedback</span>
            </Button>

            {/* Separator */}
            <div className="h-px bg-gray-200 my-1" />

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-red-50"
              onClick={() => setDeleteAccountOpen(true)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">Excluir Conta</span>
            </Button>

            {/* Separator */}
            <div className="h-px bg-gray-200 my-1" />

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 h-auto text-left hover:bg-gray-50"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 text-gray-600" />
              <span className="text-sm">Sair</span>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* All Modals */}
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
