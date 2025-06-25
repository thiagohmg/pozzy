import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ProfileSection = () => {
  // Estado para notificações por e-mail
  const [emailNotifEnabled, setEmailNotifEnabled] = React.useState(() => {
    return localStorage.getItem('pozzy-email-notif-enabled') === 'true';
  });

  const toggleEmailNotif = () => {
    const newValue = !emailNotifEnabled;
    setEmailNotifEnabled(newValue);
    localStorage.setItem('pozzy-email-notif-enabled', newValue ? 'true' : 'false');
    toast({
      title: newValue ? 'Notificações por e-mail ativadas!' : 'Notificações por e-mail desativadas.',
      description: newValue ? 'Você receberá notificações importantes por e-mail (simulado).' : 'Você não receberá mais notificações por e-mail.',
    });
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button variant={emailNotifEnabled ? 'secondary' : 'outline'} size="sm" onClick={toggleEmailNotif}>
        {emailNotifEnabled ? 'E-mail ativado' : 'Ativar notificações por e-mail'}
      </Button>
      <span className="text-xs text-gray-500">(simulado)</span>
    </div>
  );
};

export default ProfileSection; 