
import React from 'react';
import { Loader2, Search, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  stage: 'analyzing' | 'searching' | 'processing';
}

export const LoadingState = ({ stage }: LoadingStateProps) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'analyzing':
        return {
          icon: <Sparkles className="h-6 w-6" />,
          title: "Analisando sua busca...",
          description: "Processando suas preferências com IA"
        };
      case 'searching':
        return {
          icon: <Search className="h-6 w-6" />,
          title: "Buscando produtos...",
          description: "Vasculhando milhares de produtos para você"
        };
      case 'processing':
        return {
          icon: <Loader2 className="h-6 w-6 animate-spin" />,
          title: "Organizando resultados...",
          description: "Selecionando as melhores opções"
        };
    }
  };

  const { icon, title, description } = getStageInfo();

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="flex items-center space-x-3 text-orange-500">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
      <div className="w-64 bg-gray-200 rounded-full h-2">
        <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
      </div>
    </div>
  );
};
