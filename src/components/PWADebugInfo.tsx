import React from 'react';
import { Button } from './ui/button';

interface PWADebugInfoProps {
  setForceShow: (force: boolean) => void;
}

export const PWADebugInfo: React.FC<PWADebugInfoProps> = ({ setForceShow }) => {
  // Não renderiza em produção
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-[100]">
      <h4 className="font-bold mb-2 text-sm">PWA Debug</h4>
      <Button
        onClick={() => setForceShow(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white w-full"
        size="sm"
      >
        Forçar Banner PWA
      </Button>
    </div>
  );
}; 