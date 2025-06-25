
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Star, History, Image, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'favorites' | 'history' | 'results';
  onAction?: () => void;
}

export const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const configs = {
    search: {
      icon: Search,
      title: "Comece sua busca",
      description: "Digite o que você está procurando ou use os filtros para encontrar roupas incríveis",
      actionText: "Explorar tendências",
    },
    favorites: {
      icon: Star,
      title: "Nenhum favorito ainda",
      description: "Adicione produtos aos favoritos clicando na estrela para encontrá-los rapidamente depois",
      actionText: "Fazer uma busca",
    },
    history: {
      icon: History,
      title: "Histórico vazio",
      description: "Suas buscas anteriores aparecerão aqui para facilitar o acesso",
      actionText: "Nova busca",
    },
    results: {
      icon: ShoppingBag,
      title: "Nenhum produto encontrado",
      description: "Tente ajustar seus filtros ou usar termos de busca diferentes",
      actionText: "Limpar filtros",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {config.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {config.description}
        </p>
        {onAction && (
          <Button onClick={onAction} variant="outline">
            {config.actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
