
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp } from 'lucide-react';
import { FavoritesManager } from './FavoritesManager';
import { ProductComparison } from './ProductComparison';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useSearchTracking } from '@/hooks/useSearchTracking';

interface RecommendationsProps {
  userId?: string;
}

export const Recommendations = ({ userId }: RecommendationsProps) => {
  const { recommendations, isLoading, loadMoreRecommendations, hasMore } = useRecommendations(userId);
  const { trackInteraction } = useSearchTracking();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Mostra só a quantidade atual carregada, sempre em múltiplos de 3
  const [visibleCount, setVisibleCount] = useState(3);

  const handleProductClick = (productId: string) => {
    if (userId) {
      trackInteraction(userId, productId, 'click');
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    // Se já carregou todos os recommendations possíveis visíveis, tenta carregar mais recommendations da api/hook
    if (visibleCount >= recommendations.length && hasMore) {
      await loadMoreRecommendations();
    }
    setVisibleCount(prev => prev + 3);
    setIsLoadingMore(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  // Mostra só os recommendations carregados, até o limite do visibleCount
  const displayedRecommendations = recommendations.slice(0, visibleCount);

  return (
    <div className="section-spacing">
      {/* Título principal e descrição */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" style={{ color: '#A883B7' }} />
          <h2 className="title-primary text-lg md:text-xl font-semibold">
            Recomendado para você
          </h2>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-7 md:ml-8">
          Esses produtos foram recomendados especialmente para você, com base nas buscas que você realiza na plataforma.
        </p>
      </div>

      {/* Cards de recomendação */}
      <div className="space-y-4">
        {displayedRecommendations.map((item) => (
          <Card key={item.id} className="card-standard hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              {/* Imagem do produto */}
              <div className="bg-gray-100 h-48 rounded-xl flex items-center justify-center mb-4">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <CardContent className="p-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 pr-2">
                    <h4 className="subtitle mb-2 leading-tight">{item.name}</h4>
                    <p className="text-small text-gray-600 mb-3 leading-relaxed">{item.description}</p>
                  </div>
                  <FavoritesManager 
                    product={{
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      price: `R$ ${item.price.toFixed(2).replace('.', ',')}`
                    }} 
                  />
                </div>
                <div className="mb-4">
                  <span className="title-primary" style={{ color: '#A883B7' }}>
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="space-y-3">
                  <ProductComparison 
                    product={{
                      id: item.id,
                      name: item.name,
                      description: item.description,
                      price: `R$ ${item.price.toFixed(2).replace('.', ',')}`
                    }} 
                  />
                  <Button 
                    className="w-full btn-standard"
                    variant="outline"
                    onClick={() => handleProductClick(item.id)}
                    style={{ 
                      height: '44px',
                      borderRadius: '12px',
                      borderColor: '#4C1F4B',
                      color: '#4C1F4B'
                    }}
                  >
                    Ver Produto
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      {/* Botão Ver Mais */}
      {(visibleCount < recommendations.length || hasMore) && (
        <div className="flex justify-center mt-6">
          <Button 
            type="button"
            className="text-base px-6 py-3 rounded-xl border border-[#A883B7]"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Carregando..." : "Ver mais"}
          </Button>
        </div>
      )}
    </div>
  );
};

