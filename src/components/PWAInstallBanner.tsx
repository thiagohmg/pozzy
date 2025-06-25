import React from 'react';
import { Button } from './ui/button';
import { Download, X } from 'lucide-react';

interface PWAInstallBannerProps {
  isInstallable: boolean;
  triggerInstallPrompt: () => void;
  hasBeenRejected: boolean;
  forceShow: boolean;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  isInstallable,
  triggerInstallPrompt,
  hasBeenRejected,
  forceShow,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (forceShow || (isInstallable && !hasBeenRejected)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isInstallable, hasBeenRejected, forceShow]);

  const handleInstallClick = () => {
    triggerInstallPrompt();
    setIsVisible(false);
  };

  const handleDismissClick = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_install_rejected', 'true');
    localStorage.setItem('pwa_rejection_timestamp', Date.now().toString());
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-gradient-to-r from-purple-dark to-purple-medium text-white p-4 rounded-2xl shadow-lg z-50 animate-fade-in-up">
      <button
        onClick={handleDismissClick}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
        aria-label="Dispensar"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4 shrink-0">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div className="flex-grow">
          <h4 className="font-bold">Instale o Pozzy</h4>
          <p className="text-sm opacity-90 leading-tight">Acesso rápido, notificações e uso offline.</p>
        </div>
        <Button
          onClick={handleInstallClick}
          className="bg-white text-purple-dark hover:bg-gray-100 h-9 ml-4 shrink-0"
        >
          Instalar
        </Button>
      </div>
    </div>
  );
}; 