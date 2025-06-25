import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Guarda a referência do evento para ser usada depois
let deferredPrompt: any;

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [forceShow, setForceShow] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsInstallable(true);
      console.log('PWA: Evento beforeinstallprompt disparado.');
    };

    const handleAppInstalled = () => {
      deferredPrompt = null;
      setIsInstallable(false);
      console.log('PWA: Aplicativo instalado com sucesso.');
    };

    const handleOnline = () => {
      setIsOffline(false);
      console.log('PWA: Aplicativo está online.');
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('PWA: Aplicativo está offline.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('PWA: Service Worker registrado com sucesso:', registration);
        }).catch(error => {
          console.error('PWA: Falha ao registrar Service Worker:', error);
        });
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerInstallPrompt = () => {
    if (!deferredPrompt) {
      alert("O app não pode ser instalado agora. Interaja um pouco mais com o site ou tente recarregar a página.");
      console.log('PWA: Tentativa de instalar, mas o prompt não está disponível.');
      return;
    }
    
    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed' }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: Usuário aceitou a instalação.');
      } else {
        console.log('PWA: Usuário recusou a instalação.');
        localStorage.setItem('pwa_install_rejected', 'true');
        localStorage.setItem('pwa_rejection_timestamp', Date.now().toString());
      }
      deferredPrompt = null;
      setIsInstallable(false);
      setForceShow(false);
    });
  };

  const hasBeenRejected = () => {
    const rejected = localStorage.getItem('pwa_install_rejected');
    const timestamp = localStorage.getItem('pwa_rejection_timestamp');

    if (rejected && timestamp) {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(timestamp, 10) > oneWeek) {
        localStorage.removeItem('pwa_install_rejected');
        localStorage.removeItem('pwa_rejection_timestamp');
        return false;
      }
      return true;
    }
    return false;
  };

  return { 
    isInstallable, 
    isOffline, 
    triggerInstallPrompt, 
    hasBeenRejected: hasBeenRejected(),
    forceShow,
    setForceShow,
  };
}; 