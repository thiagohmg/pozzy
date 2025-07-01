import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Palette, Shirt, Sparkles } from 'lucide-react';
import { FavoritesManager } from "./FavoritesManager";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PalettePromptModal } from "./PalettePromptModal";
import { VirtualTryOn } from "./VirtualTryOn";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Product {
  id: string;
  name?: string;
  description: string;
  price: string;
  tryOnCompatible: boolean;
  image?: string;
  paletteMatch?: number;
  category?: string;
  brand?: string;
  image_url?: string;
}

interface ProductCardProps {
  product: Product;
  onTryOn: (product: Product) => void;
  showFavorite?: boolean;
  colorPalette?: unknown;
  onDiscoverPalette?: () => void;
}

export const ProductCard = ({ 
  product, 
  onTryOn, 
  showFavorite, 
  colorPalette,
  onDiscoverPalette 
}: ProductCardProps) => {
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  
  // Combinações personalizadas por produto (localStorage)
  const storageKey = `combine-with-${product.id}`;
  const [combos, setCombos] = useState<string[]>([]);
  const [newCombo, setNewCombo] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setCombos(JSON.parse(saved));
  }, [storageKey]);

  const addCombo = () => {
    if (!newCombo.trim()) return;
    const updated = [...combos, newCombo.trim()];
    setCombos(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewCombo("");
  };

  const removeCombo = (combo: string) => {
    const updated = combos.filter(c => c !== combo);
    setCombos(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Sugestão inicial (apenas se não houver combos salvos)
  useEffect(() => {
    if (combos.length === 0) {
      setCombos(["Calça jeans", "Tênis branco", "Jaqueta leve"]);
      localStorage.setItem(storageKey, JSON.stringify(["Calça jeans", "Tênis branco", "Jaqueta leve"]));
    }
    // eslint-disable-next-line
  }, []);

  // Função para lidar com o clique no try-on
  const handleTryOnClick = () => {
    if (!colorPalette) {
      // Se não tem paleta, mostra o modal
      setShowPaletteModal(true);
    } else {
      // Se tem paleta, abre o try-on virtual
      setShowTryOn(true);
    }
  };

  // Verificar se o produto é compatível com try-on
  const isTryOnCompatible = product.tryOnCompatible || 
    ['vestidos', 'blusas', 'calças', 'saias', 'blazers', 'jaquetas', 'sapatos'].includes(
      product.category?.toLowerCase() || ''
    );

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow 
        rounded-xl mb-4 p-0
        w-full
        max-w-xs
        mx-auto
        sm:max-w-full
        ">
        <div
          className="
            aspect-square
            bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700
            flex items-center justify-center
            w-full
            h-[220px] sm:h-[280px]
          "
        >
          {product.image || product.image_url ? (
            <img
              src={product.image || product.image_url}
              alt={product.name || "Produto"}
              className="w-full h-full object-cover rounded-none"
              style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: 0 }}
            />
          ) : (
            <div className="text-gray-400 text-center">
              <div className="w-14 h-14 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center text-lg">
                👕
              </div>
              <span className="text-xs">Imagem do produto</span>
            </div>
          )}
        </div>

        <CardContent className="
          p-3 sm:p-4
          flex flex-col gap-2
        ">
          <div className="mb-1">
            <h3 className="font-medium text-xs sm:text-sm leading-tight truncate max-w-full">{product.name}</h3>
            {product.brand && (
              <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
            )}
          </div>

          {/* Badges e descrição */}
          <div className="mb-3 rounded-xl bg-purple-100 p-2 sm:p-3">
            <div className="flex flex-wrap items-center space-x-2 mb-2">
              {isTryOnCompatible && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Badge
                          variant="secondary"
                          className="bg-blue-200 text-blue-800 text-[11px] px-2 py-0.5 cursor-help"
                          tabIndex={0}
                          aria-label="Mais informações sobre Teste Virtual"
                        >
                          <Shirt className="h-3 w-3 mr-1" />
                          Try-On
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Experimente este produto virtualmente em você!
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {typeof product.paletteMatch === "number" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Badge
                          variant="secondary"
                          className={
                            "text-[11px] flex items-center px-2 py-0.5 cursor-help " +
                            (product.paletteMatch >= 90
                              ? "bg-green-100 text-green-800"
                              : product.paletteMatch >= 80
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-200 text-gray-700")
                          }
                          tabIndex={0}
                          aria-label="Ver compatibilidade da paleta de cores"
                        >
                          <Palette className="h-3 w-3 mr-1" />
                          {product.paletteMatch}%
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      Compatibilidade desta peça com sua paleta de cores.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-xs text-purple-900 dark:text-purple-200 line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-2 mb-2">
            {showFavorite && (
              <FavoritesManager
                product={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                }}
                inlineEdit={true}
              />
            )}
            
            {/* Botão Try-On Virtual */}
            {isTryOnCompatible && (
              <Dialog open={showTryOn} onOpenChange={setShowTryOn}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
                    onClick={handleTryOnClick}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Try-On
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <VirtualTryOn
                    product={product}
                    onClose={() => setShowTryOn(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base sm:text-lg text-orange-600">{product.price}</span>
          </div>

          <div className="space-y-1">
            {/* Combinações sugeridas */}
            <div className="text-xs text-gray-600">
              <span className="font-medium">Combina com:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {combos.map((combo, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-[10px] px-2 py-0.5 bg-gray-50"
                  >
                    {combo}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Adicionar nova combinação */}
            <div className="flex gap-1">
              <input
                type="text"
                value={newCombo}
                onChange={(e) => setNewCombo(e.target.value)}
                placeholder="Adicionar item..."
                className="flex-1 text-xs px-2 py-1 border rounded"
                onKeyPress={(e) => e.key === 'Enter' && addCombo()}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={addCombo}
                className="text-xs px-2"
              >
                +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Paleta */}
      <PalettePromptModal
        open={showPaletteModal}
        onOpenChange={setShowPaletteModal}
        onDiscoverPalette={onDiscoverPalette}
        featureType="try-on"
      />
    </>
  );
};
