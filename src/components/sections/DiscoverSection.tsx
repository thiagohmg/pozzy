import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SearchInterface } from "@/components/SearchInterface";
import { AdvancedFilters } from "@/components/AdvancedFilters";
import { SmartOccasionSearch } from "@/components/SmartOccasionSearch";
import { ImageSearch } from "@/components/ImageSearch";
import { Recommendations } from "@/components/Recommendations";
import { ColorPaletteAnalyzer } from "@/components/ColorPaletteAnalyzer";
import { PaletteResults } from "@/components/PaletteResults";
import { Palette, Search, Filter, Sparkles, Image } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTrends } from "@/hooks/useTrends";

interface DiscoverSectionProps {
  colorPalette: any;
  onSectionChange: (section: string) => void;
  onSearch: (query: string) => void;
  searchesLeft: number;
  isPremium: boolean;
  loading: boolean;
  searchResults: any[];
  user: { uid: string; email: string } | null;
  onProductTryOn: (product: any) => void;
  activeSubSection?: string;
}

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({
  colorPalette,
  onSectionChange,
  onSearch,
  searchesLeft,
  isPremium,
  loading,
  searchResults,
  user,
  onProductTryOn,
  activeSubSection
}) => {
  const [searchMode, setSearchMode] = useState<'text' | 'filters' | 'occasions' | 'image' | 'trends'>('text');
  const isMobile = useIsMobile();
  const { trends, isLoading: trendsLoading, error: trendsError, refreshTrends } = useTrends();

  const handleTrendClick = (trend: any) => {
    onSearch(`[Busca por tendência] ${trend.searchQuery}`);
  };

  const handleAnalyzePalette = () => {
    const paletteSection = document.getElementById('palette-section');
    if (paletteSection) {
      paletteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      localStorage.setItem('discover-lastResults', JSON.stringify(searchResults));
    }
    localStorage.setItem('discover-searchMode', searchMode);
  }, [searchResults, searchMode]);

  useEffect(() => {
    const savedResults = localStorage.getItem('discover-lastResults');
    if (savedResults && searchResults.length === 0) {
      try {
        // setSearchResults não está disponível aqui, mas pode ser passado como prop se necessário
      } catch {}
    }
    const savedMode = localStorage.getItem('discover-searchMode');
    if (savedMode && searchMode !== savedMode) {
      setSearchMode(savedMode as any);
    }
  }, []);

  const handlePaletteAnalyzed = (palette: any) => {
    console.log('Paleta analisada:', palette);
  };

  const handleFiltersChange = (filters: any) => {
    const filterTerms = [];
    
    if (filters.searchQuery && filters.searchQuery.trim()) {
      filterTerms.push(filters.searchQuery.trim());
    }
    
    if (filters.priceRange) {
      filterTerms.push(`preço entre R$ ${filters.priceRange[0]} e R$ ${filters.priceRange[1]}`);
    }
    
    if (filters.brands && filters.brands.length > 0) {
      filterTerms.push(`marcas: ${filters.brands.join(', ')}`);
    }
    
    if (filters.colors && filters.colors.length > 0) {
      filterTerms.push(`cores: ${filters.colors.join(', ')}`);
    }
    
    if (filters.rating) {
      filterTerms.push(`avaliação mínima: ${filters.rating} estrelas`);
    }
    
    if (filters.inStock) {
      filterTerms.push('apenas em estoque');
    }

    const searchQuery = filterTerms.length > 0 
      ? `[Busca por filtros] ${filterTerms.join(' | ')}`
      : '[Busca por filtros vazia]';
    onSearch(searchQuery);
  };

  const handleImageSearch = (imageData: string) => {
    onSearch(`[Busca por imagem] ${imageData.substring(0, 50)}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 md:p-6">

      {/* Análise de Paleta de Cores */}
      <div id="palette-section">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-4">
            {/* Esconda o título externo no mobile */}
            <div className="hidden md:flex items-center space-x-2 mb-3">
              <Palette className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Análise de Paleta de Cores</h2>
            </div>
            
            <ColorPaletteAnalyzer onPaletteAnalyzed={handlePaletteAnalyzed} />
            
            {colorPalette && (
              <div className="mt-4">
                <PaletteResults palette={colorPalette} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Interface de Busca com Modos */}
      <div id="search-section">
        <div className="p-4">
          {/* TÍTULO INFORMANDO SOBRE A BUSCA */}
          <div className="mb-4">
            <h2 className="text-center text-base md:text-lg font-semibold text-black">
              Compare preços, encontre lojas e descubra as melhores opções para comprar online
            </h2>
          </div>
          {/* Modos de busca reorganizados para mobile */}
          <div className="mb-6">
            {/* Mobile: 2x2 grid */}
            <div className="grid grid-cols-2 gap-2 md:hidden">
              <Button
                variant={searchMode === 'text' ? 'default' : 'outline'}
                onClick={() => setSearchMode('text')}
                className="flex items-center justify-center space-x-1 h-10"
                size="sm"
              >
                <Search className="h-4 w-4" />
                <span className="text-xs">Busca Livre</span>
              </Button>
              <Button
                variant={searchMode === 'filters' ? 'default' : 'outline'}
                onClick={() => setSearchMode('filters')}
                className="flex items-center justify-center space-x-1 h-10"
                size="sm"
              >
                <Filter className="h-4 w-4" />
                <span className="text-xs">Filtros</span>
              </Button>
              <Button
                variant={searchMode === 'occasions' ? 'default' : 'outline'}
                onClick={() => setSearchMode('occasions')}
                className="flex items-center justify-center space-x-1 h-10"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-xs">Por Ocasião</span>
              </Button>
              <Button
                variant={searchMode === 'image' ? 'default' : 'outline'}
                onClick={() => setSearchMode('image')}
                className="flex items-center justify-center space-x-1 h-10"
                size="sm"
              >
                <Image className="h-4 w-4" />
                <span className="text-xs">Por Imagem</span>
              </Button>
              <Button
                variant={searchMode === 'trends' ? 'default' : 'outline'}
                onClick={() => setSearchMode('trends')}
                className="flex items-center justify-center space-x-1 h-10"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-xs">Tendências</span>
              </Button>
            </div>

            {/* Desktop: linha horizontal */}
            <div className="hidden md:flex items-center justify-center space-x-2 flex-wrap gap-2">
              <Button
                variant={searchMode === 'text' ? 'default' : 'outline'}
                onClick={() => setSearchMode('text')}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Search className="h-4 w-4" />
                <span>Busca Livre</span>
              </Button>
              <Button
                variant={searchMode === 'occasions' ? 'default' : 'outline'}
                onClick={() => setSearchMode('occasions')}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Por Ocasião</span>
              </Button>
              <Button
                variant={searchMode === 'filters' ? 'default' : 'outline'}
                onClick={() => setSearchMode('filters')}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Filter className="h-4 w-4" />
                <span>Filtros Avançados</span>
              </Button>
              <Button
                variant={searchMode === 'image' ? 'default' : 'outline'}
                onClick={() => setSearchMode('image')}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Image className="h-4 w-4" />
                <span>Busca por Imagem</span>
              </Button>
              <Button
                variant={searchMode === 'trends' ? 'default' : 'outline'}
                onClick={() => setSearchMode('trends')}
                className="flex items-center space-x-2"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                <span>Tendências</span>
              </Button>
            </div>
          </div>

          {/* Conteúdo baseado no modo selecionado */}
          {searchMode === 'text' && (
            <SearchInterface
              onSearch={onSearch}
              searchesLeft={searchesLeft}
              isPremium={isPremium}
              loading={loading}
              results={searchResults}
              user={user}
              onProductTryOn={onProductTryOn}
              colorPalette={colorPalette}
            />
          )}

          {searchMode === 'occasions' && (
            <SmartOccasionSearch
              onOccasionSearch={onSearch}
              loading={loading}
            />
          )}

          {searchMode === 'filters' && (
            <AdvancedFilters onFiltersChange={handleFiltersChange} />
          )}

          {searchMode === 'image' && (
            <ImageSearch 
              onImageSearch={handleImageSearch}
              colorPalette={colorPalette}
              onDiscoverPalette={handleAnalyzePalette}
            />
          )}

          {searchMode === 'trends' && (
            <div className="py-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Tendências do Momento</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Clique em uma tendência para descobrir produtos incríveis que estão em alta agora!
                </p>
              </div>
              
              {trendsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando tendências...</p>
                  </div>
                </div>
              ) : trendsError ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-red-700 text-sm mb-3">{trendsError}</p>
                    <Button 
                      onClick={refreshTrends}
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                    {trends.map((trend) => (
                      <div
                        key={trend.id}
                        onClick={() => handleTrendClick(trend)}
                        className={`
                          rounded-xl border p-6 bg-gradient-to-br ${trend.gradient} 
                          cursor-pointer transition-all duration-300 transform hover:scale-105 
                          hover:shadow-lg active:scale-95 group
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{trend.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className={`font-semibold text-${trend.color} group-hover:underline`}>
                                {trend.name}
                              </h4>
                              {/* Badge indicando o tipo da tendência */}
                              <span className={`
                                text-xs px-2 py-1 rounded-full font-medium
                                ${trend.type === 'fixed' ? 'bg-gray-100 text-gray-600' : ''}
                                ${trend.type === 'seasonal' ? 'bg-orange-100 text-orange-600' : ''}
                                ${trend.type === 'viral' ? 'bg-purple-100 text-purple-600' : ''}
                              `}>
                                {trend.type === 'fixed' && 'Atemporal'}
                                {trend.type === 'seasonal' && 'Sazonal'}
                                {trend.type === 'viral' && 'Viral'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              {trend.description}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Clique para explorar
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Botão para atualizar tendências */}
                  <div className="mt-8 text-center">
                    <Button
                      onClick={refreshTrends}
                      variant="outline"
                      size="sm"
                      className="text-purple-600 border-purple-300 hover:bg-purple-50"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Atualizar Tendências
                    </Button>
                  </div>

                  {/* Dica adicional */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-700">
                        💡 Dica: As buscas são personalizadas com base na sua paleta de cores
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Resultados da busca - APENAS PRODUTOS ENCONTRADOS */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">
                Produtos Encontrados ({searchResults.length})
                {colorPalette && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    • Baseado na sua paleta de cores
                  </span>
                )}
              </h4>

              {/* MOBILE: Carrossel (um card por vez, swipe ou setas) */}
              {isMobile ? (
                <div className="relative">
                  <Carousel
                    className="w-full max-w-xs mx-auto sm:max-w-full"
                    opts={{
                      // Torna o carrossel bem ágil, igual Tinder
                      loop: true,
                      dragFree: false, // snap em cada card!
                      slidesToScroll: 1,
                      skipSnaps: false,
                      // Outras opções do embla-carousel podem ser incluídas aqui se desejar afinar mais ainda.
                    }}
                  >
                    <CarouselContent>
                      {searchResults.map((product, index) => (
                        <CarouselItem key={product.id || index} className="p-0">
                          <ProductCard
                            product={product}
                            onTryOn={onProductTryOn}
                            showFavorite={true}
                            colorPalette={colorPalette}
                            onDiscoverPalette={handleAnalyzePalette}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {/* Setas de navegação sobre o carrossel */}
                    <CarouselPrevious className="left-2 md:left-2" />
                    <CarouselNext className="right-2 md:right-2" />
                  </Carousel>
                </div>
              ) : (
                // DESKTOP: Mantém grid original
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.slice(0, 4).map((product, index) => (
                    <ProductCard
                      key={product.id || index}
                      product={product}
                      onTryOn={onProductTryOn}
                      showFavorite={true}
                      colorPalette={colorPalette}
                      onDiscoverPalette={handleAnalyzePalette}
                    />
                  ))}
                  {searchResults.length < 4 && (
                    <div className="bg-gray-50 rounded-lg h-[420px] border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                      Produto
                    </div>
                  )}
                </div>
              )}
              {searchResults.length > 4 && (
                <div className="flex justify-center mt-4">
                  <button className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">Ver mais</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
