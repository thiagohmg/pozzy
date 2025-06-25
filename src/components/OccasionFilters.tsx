import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Heart, Coffee, Plane, PartyPopper, Calendar, Search, Filter } from 'lucide-react';

interface Occasion {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  searchQuery: string;
}

const occasions: Occasion[] = [
  {
    id: 'trabalho',
    name: 'Trabalho',
    icon: <Briefcase className="h-4 w-4" />,
    description: 'Looks profissionais',
    searchQuery: 'blazer social formal escritório camisa alfaiataria'
  },
  {
    id: 'encontro',
    name: 'Encontro',
    icon: <Heart className="h-4 w-4" />,
    description: 'Looks românticos',
    searchQuery: 'vestido romântico feminino delicado renda'
  },
  {
    id: 'casual',
    name: 'Casual',
    icon: <Coffee className="h-4 w-4" />,
    description: 'Dia a dia confortável',
    searchQuery: 'jeans casual confortável básica tênis'
  },
  {
    id: 'viagem',
    name: 'Viagem',
    icon: <Plane className="h-4 w-4" />,
    description: 'Prático e versátil',
    searchQuery: 'prático versátil confortável viagem básicas'
  },
  {
    id: 'festa',
    name: 'Festa',
    icon: <PartyPopper className="h-4 w-4" />,
    description: 'Glamour e sofisticação',
    searchQuery: 'festa glamour sofisticado noite vestido festa'
  },
  {
    id: 'casamento',
    name: 'Casamento',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Elegante e apropriado',
    searchQuery: 'casamento elegante formal cerimônia vestido midi'
  }
];

interface OccasionFiltersProps {
  onOccasionSelect: (occasion: Occasion) => void;
  selectedOccasion?: string;
}

export const OccasionFilters = ({ onOccasionSelect, selectedOccasion }: OccasionFiltersProps) => {
  const handleOccasionClick = (occasion: Occasion) => {
    onOccasionSelect(occasion);
  };

  return (
    <div className="space-y-4">
      {/* Header simples */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Buscar por Ocasião</h3>
        <p className="text-sm text-gray-600">
          Clique na ocasião para encontrar looks ideais
        </p>
      </div>

      {/* Grid simplificado de ocasiões */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {occasions.map(occasion => (
          <Button
            key={occasion.id}
            variant={selectedOccasion === occasion.id ? "default" : "outline"}
            className={`h-auto p-4 flex flex-col items-center space-y-2 ${
              selectedOccasion === occasion.id 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleOccasionClick(occasion)}
          >
            <div className={`p-2 rounded-full ${
              selectedOccasion === occasion.id 
                ? 'bg-white/20' 
                : 'bg-gray-100'
            }`}>
              {occasion.icon}
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{occasion.name}</div>
              <div className="text-xs opacity-75">{occasion.description}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Feedback quando uma ocasião é selecionada */}
      {selectedOccasion && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Buscando looks para{' '}
                {occasions.find(o => o.id === selectedOccasion)?.name.toLowerCase()}...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botões de ação melhor alinhados para mobile */}
      <div className="flex gap-2 mt-4">
        <Button 
          className="flex-1 h-9 text-sm px-3"
          onClick={() => {/* lógica de aplicar */}}
        >
          <Search className="h-4 w-4 mr-2" />
          Aplicar Filtros
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 h-9 text-sm px-3"
          onClick={() => {/* lógica de limpar */}}
        >
          <Filter className="h-4 w-4 mr-2" />
          Limpar Tudo
        </Button>
      </div>
    </div>
  );
};
