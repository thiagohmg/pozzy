import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Search, Sparkles, Loader2 } from 'lucide-react';
import { SearchHistory } from "./SearchHistory";
import { useProductSearch } from "@/hooks/useProductSearch";
import { ProductCard } from "./ProductCard";

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
  loading: externalLoading,
  results: externalResults,
  user,
  onProductTryOn,
  colorPalette
}: SearchInterfaceProps) => {
  const [query, setQuery] = useState('');
  const searchHistoryRef = useRef<any>(null);
  
  // Usar o novo hook de busca
  const {
    products,
    loading: searchLoading,
    error,
    search,
    hasMore,
    loadMore
  } = useProductSearch();

  // Determinar se deve usar busca externa ou interna
  const useInternalSearch = true; // Por enquanto, usar sempre busca interna
  const loading = useInternalSearch ? searchLoading : externalLoading;
  const results = useInternalSearch ? products : externalResults;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchQuery = query.trim();
      
      if (useInternalSearch) {
        // Usar busca interna
        await search(searchQuery, {
          category: colorPalette?.category,
          priceRange: colorPalette?.priceRange,
          colors: colorPalette?.colors?.ideal
        });
      } else {
        // Usar busca externa (original)
        onSearch(searchQuery);
      }
      
      // Add to search history
      const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      const newHistory = [searchQuery, ...savedHistory.filter((item: string) => item !== searchQuery)].slice(0, 15);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Clear input after search
      setQuery('');
    }
  };

  const handleHistorySelect = async (historicalQuery: string) => {
    setQuery('');
    
    if (useInternalSearch) {
      await search(historicalQuery, {
        category: colorPalette?.category,
        priceRange: colorPalette?.priceRange,
        colors: colorPalette?.colors?.ideal
      });
    } else {
      onSearch(historicalQuery);
    }
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
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {results.length} produto(s) encontrado(s)
            </h3>
            {useInternalSearch && (
              <span className="text-sm text-gray-500">
                Buscando em múltiplas lojas...
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onTryOn={onProductTryOn}
                user={user}
              />
            ))}
          </div>

          {/* Botão "Carregar Mais" */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={loadMore}
                disabled={loading}
                variant="outline"
                className="w-full max-w-xs"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Carregar Mais Produtos
              </Button>
            </div>
          )}
        </div>
      )}

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
