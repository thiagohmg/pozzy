import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Search, Sparkles } from 'lucide-react';
import { SearchHistory } from "./SearchHistory";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  searchesLeft: number;
  isPremium: boolean;
  loading: boolean;
  results: any[];
  user: { uid: string; email: string };
  onProductTryOn?: (product: any) => void;
  colorPalette?: any;
}

export const SearchInterface = ({
  onSearch,
  searchesLeft,
  isPremium,
  loading,
  results,
  user,
  onProductTryOn,
  colorPalette
}: SearchInterfaceProps) => {
  const [query, setQuery] = useState('');
  const searchHistoryRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchQuery = query.trim();
      onSearch(searchQuery);
      
      // Add to search history
      const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const newHistory = [searchQuery, ...savedHistory.filter((item: string) => item !== searchQuery)].slice(0, 15);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Clear input after search
      setQuery('');
    }
  };

  const handleHistorySelect = (historicalQuery: string) => {
    setQuery('');
    onSearch(historicalQuery);
  };

  return (
    <div className="space-y-6">
      {/* Header da Busca */}
      <div className="text-center">
        <h2 className="subtitle-section">
          Busca Livre
        </h2>
        <p className="subtitle-description mx-auto max-w-xl">
          Descreva o que você procura e a IA encontra os melhores looks!
        </p>
      </div>

      {/* Info da Paleta */}
      {colorPalette && (
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-4 flex items-center space-x-3">
          <Palette className="h-5 w-5 text-purple-500" />
          <div className="flex-1">
            <h3 className="font-medium text-purple-800">
              Sua Paleta: {colorPalette.season} - {colorPalette.undertone}
            </h3>
            <p className="text-sm text-purple-600">
              Produtos recomendados serão filtrados pelas suas cores ideais
            </p>
          </div>
          <div className="flex space-x-1">
            {colorPalette.colors?.ideal?.slice(0, 4).map((color: string, index: number) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border border-white"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search History Component */}
      <SearchHistory onSearchSelect={handleHistorySelect} />

      {/* Busca por Texto */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder={colorPalette
              ? "Ex: vestido nas minhas cores, blazer para trabalho..."
              : "Ex: vestido floral para casamento, blazer executivo..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || (!isPremium && searchesLeft <= 0)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {loading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Estado Vazio */}
      {!loading && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {colorPalette ? "Busca personalizada pronta" : "Comece sua busca"}
          </h3>
          <p className="text-gray-500">
            {colorPalette
              ? "Digite o que você procura e encontraremos opções nas suas cores ideais"
              : "Digite o que você procura para encontrar produtos incríveis"
            }
          </p>
        </div>
      )}
    </div>
  );
};
