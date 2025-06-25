import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Palette } from 'lucide-react';
import { FavoritesManager } from "./FavoritesManager";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PalettePromptModal } from "./PalettePromptModal";

interface ProductCardProps {
  product: {
    id: string;
    name?: string;
    description: string;
    price: string;
    tryOnCompatible: boolean;
    image?: string;
    paletteMatch?: number;
  };
  onTryOn: (product: any) => void;
  showFavorite?: boolean;
  colorPalette?: any;
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
      // Se tem paleta, executa o try-on normal
      onTryOn(product);
    }
  };

  return (
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
        {product.image ? (
          <img
            src={product.image}
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
        </div>

        {/* Badges e descrição */}
        <div className="mb-3 rounded-xl bg-purple-100 p-2 sm:p-3">
          <div className="flex flex-wrap items-center space-x-2 mb-2">
            {product.tryOnCompatible && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-200 text-purple-800 text-[11px] px-2 py-0.5 cursor-help"
                        tabIndex={0}
                        aria-label="Mais informações sobre Teste Virtual"
                      >
                        Teste Virtual
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Permite experimentar a peça virtualmente.
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

        {/* Botões Gostei e Quero comprar */}
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
          {/* Aqui você pode adicionar o botão 'Quero comprar' se existir */}
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-base sm:text-lg text-orange-600">{product.price}</span>
        </div>

        <div className="space-y-1">
          <Button
            variant="outline"
            className="w-full text-xs h-8 sm:h-9 py-0 sm:py-2"
          >
            Ver Detalhes
          </Button>

          {product.tryOnCompatible && (
            <Button
              onClick={handleTryOnClick}
              className="w-full bg-purple-500 hover:bg-purple-600 text-xs h-8 sm:h-9 py-0 sm:py-2"
            >
              <Camera className="h-3 w-3 mr-1" />
              Experimentar em Mim
            </Button>
          )}
        </div>
        {/* Combine com... editável */}
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Combine com:</div>
          <div className="flex gap-2 flex-wrap mb-2">
            {combos.map((combo, idx) => (
              <span key={combo+idx} className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 border flex items-center gap-1">
                {combo}
                <button
                  type="button"
                  className="ml-1 text-gray-400 hover:text-red-500 text-xs"
                  onClick={() => removeCombo(combo)}
                  aria-label="Remover combinação"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCombo}
              onChange={e => setNewCombo(e.target.value)}
              className="border rounded px-2 py-1 text-xs flex-1"
              placeholder="Adicionar peça..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCombo(); } }}
            />
            <button
              type="button"
              className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-3 py-1 rounded"
              onClick={addCombo}
            >
              Adicionar
            </button>
          </div>
        </div>
      </CardContent>

      {/* Modal de prompt para paleta */}
      <PalettePromptModal
        open={showPaletteModal}
        onOpenChange={setShowPaletteModal}
        onDiscoverPalette={onDiscoverPalette || (() => {})}
        featureType="try-on"
      />
    </Card>
  );
};
