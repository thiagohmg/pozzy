import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Search, Sparkles } from 'lucide-react';

const occasionSuggestions = [
  // Trabalho
  'trabalho', 'reunião importante', 'apresentação', 'primeiro dia de trabalho', 
  'entrevista de emprego', 'conferência', 'networking', 'escritório casual',
  
  // Social Casual
  'encontro romântico', 'primeiro encontro', 'jantar a dois', 'almoço casual',
  'happy hour', 'encontro com amigos', 'cinema', 'shopping',
  
  // Festas e Eventos
  'festa de aniversário', 'festa em casa', 'balada', 'bar', 'festa na piscina',
  'festa junina', 'reveillon', 'carnaval', 'festa à fantasia',
  
  // Formal
  'casamento', 'formatura', 'gala', 'ópera', 'teatro', 'cerimônia',
  'evento corporativo', 'premiação', 'coquetel', 'jantar formal',
  
  // Viagem
  'viagem de negócios', 'férias na praia', 'viagem de montanha',
  'city tour', 'viagem internacional', 'fim de semana', 'hotel',
  
  // Esportes e Lazer
  'academia', 'corrida', 'yoga', 'pilates', 'natação', 'tênis',
  'futebol', 'caminhada', 'parque', 'piquenique',
  
  // Família
  'almoço em família', 'visita aos pais', 'churrasco', 'aniversário criança',
  'reunião família', 'domingo em casa',
  
  // Especiais
  'dia das mães', 'dia dos pais', 'natal', 'páscoa', 'dia dos namorados',
  'halloween', 'ano novo'
];

interface SmartOccasionSearchProps {
  onOccasionSearch: (query: string) => void;
  loading?: boolean;
}

export const SmartOccasionSearch = ({ onOccasionSearch, loading }: SmartOccasionSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  const handleSearch = () => {
    let finalQuery = '';
    
    if (selectedOccasions.length > 0) {
      finalQuery = selectedOccasions.join(', ');
    } else if (searchQuery.trim()) {
      finalQuery = searchQuery.trim();
    }
    
    if (finalQuery) {
      onOccasionSearch(`[Busca por ocasião] ${finalQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="subtitle-section">
          Buscar por Ocasião
        </h3>
        <p className="subtitle-description">
          Digite ou selecione ocasiões para encontrar looks ideais
        </p>
      </div>

      {/* Autocomplete para ocasiões */}
      <div className="p-4 border border-gray-200 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selecione ocasiões (opcional)
          </label>
          <Autocomplete
            options={occasionSuggestions}
            value={selectedOccasions}
            onChange={setSelectedOccasions}
            placeholder="Ex: casamento, trabalho, festa..."
            emptyText="Nenhuma ocasião encontrada"
          />
        </div>

        {/* Campo de busca livre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ou descreva livremente
          </label>
          <div className="flex space-x-2">
            <Input
              placeholder="Ex: evento formal no verão, look confortável para viajar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={loading || (!selectedOccasions.length && !searchQuery.trim())}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {loading ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Dica */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          💡 Dica: Você pode selecionar várias ocasiões ou descrever livremente o que procura
        </div>
      </div>
    </div>
  );
};
