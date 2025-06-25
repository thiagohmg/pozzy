import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name?: string;
  description: string;
  price: string;
}

type FavoriteType = "gostei" | "quero_comprar" | null;

interface FavoritesManagerProps {
  product: Product;
  inlineEdit?: boolean;
}

type FavoriteEntry = {
  type: FavoriteType;
  customName?: string;
};

export const FavoritesManager = ({ product, inlineEdit = false }: FavoritesManagerProps) => {
  const [favoriteType, setFavoriteType] = useState<FavoriteType>(null);
  const [customName, setCustomName] = useState<string>('');
  const [showCustomNameInput, setShowCustomNameInput] = useState<boolean>(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const favorites: Record<string, FavoriteEntry> =
      JSON.parse(localStorage.getItem('favorites_v2') || '{}');
    const entry = favorites[product.id];
    setFavoriteType(entry?.type || null);
    setCustomName(entry?.customName ?? product.name ?? '');
    setShowCustomNameInput(!!entry?.type);
  }, [product.id, product.name]);

  const handleSetFavorite = (type: FavoriteType) => {
    const favorites: Record<string, FavoriteEntry> =
      JSON.parse(localStorage.getItem('favorites_v2') || '{}');
    if (type) {
      favorites[product.id] = {
        type,
        customName: favorites[product.id]?.customName || product.name || "",
      };
      localStorage.setItem('favorites_v2', JSON.stringify(favorites));
      setFavoriteType(type);
      setCustomName(favorites[product.id].customName || product.name || "");
      setShowCustomNameInput(true);
      setTimeout(() => inputRef.current?.focus(), 150);
      toast({
        title: type === "gostei" ? "Adicionado como 'Gostei'" : "Adicionado como 'Quero comprar'",
        description: type === "gostei"
          ? "Produto salvo na seção Gostei"
          : "Produto salvo em Quero comprar"
      });
    } else {
      delete favorites[product.id];
      localStorage.setItem('favorites_v2', JSON.stringify(favorites));
      setFavoriteType(null);
      setCustomName('');
      setShowCustomNameInput(false);
      toast({
        title: "Removido dos favoritos",
        description: "Produto removido das suas opções"
      });
      window.dispatchEvent(new Event('favorites-updated'));
    }
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const saveCustomName = (name: string) => {
    setCustomName(name);
    const favorites: Record<string, FavoriteEntry> =
      JSON.parse(localStorage.getItem('favorites_v2') || '{}');
    if (favorites[product.id]) {
      favorites[product.id].customName = name.trim() || product.name || "";
      localStorage.setItem('favorites_v2', JSON.stringify(favorites));
      window.dispatchEvent(new Event('favorites-updated'));
    }
  };

  const handleCustomNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    saveCustomName(e.target.value);
  };

  const handleCustomNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveCustomName((e.target as HTMLInputElement).value);
      inputRef.current?.blur();
    }
  };

  if (inlineEdit) {
    return (
      <div className="flex flex-col items-start space-y-1 w-full">
        <div className="flex gap-2 mb-1">
          <Button
            type="button"
            variant={favoriteType === "gostei" ? "secondary" : "ghost"}
            size="sm"
            className={`h-6 text-xs px-2 ${favoriteType === "gostei" ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
            onClick={() =>
              favoriteType === "gostei"
                ? handleSetFavorite(null)
                : handleSetFavorite("gostei")
            }
            aria-pressed={favoriteType === "gostei"}
          >
            Gostei
          </Button>
          <Button
            type="button"
            variant={favoriteType === "quero_comprar" ? "secondary" : "ghost"}
            size="sm"
            className={`h-6 text-xs px-2 ${favoriteType === "quero_comprar" ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
            onClick={() =>
              favoriteType === "quero_comprar"
                ? handleSetFavorite(null)
                : handleSetFavorite("quero_comprar")
            }
            aria-pressed={favoriteType === "quero_comprar"}
          >
            Quero comprar
          </Button>
        </div>
        {favoriteType && (
          <Input
            ref={inputRef}
            type="text"
            maxLength={32}
            className="w-full text-xs py-1 px-2 border rounded bg-gray-50 focus:bg-white"
            placeholder="Nome personalizado (opcional)"
            value={customName}
            onBlur={handleCustomNameBlur}
            onChange={e => setCustomName(e.target.value)}
            onKeyDown={handleCustomNameKeyDown}
            aria-label="Editar nome do favorito"
            style={{ fontSize: 13, marginTop: 4 }}
          />
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              favoriteType
                ? "fill-current"
                : ""
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="z-50 bg-white">
        <DropdownMenuItem
          onClick={() => handleSetFavorite("gostei")}
          className={favoriteType === "gostei" ? "font-bold text-yellow-600" : ""}
        >
          {favoriteType === "gostei" && (
            <span className="mr-2">★</span>
          )}
          Gostei
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetFavorite("quero_comprar")}
          className={favoriteType === "quero_comprar" ? "font-bold text-pink-600" : ""}
        >
          {favoriteType === "quero_comprar" && (
            <span className="mr-2">★</span>
          )}
          Quero comprar
        </DropdownMenuItem>
        {(favoriteType !== null) && (
          <>
            <div className="border-t my-2" />
            <div className="px-2 pb-2 w-full">
              <Input
                ref={inputRef}
                type="text"
                maxLength={32}
                className="w-full text-xs py-1 px-2 border rounded shadow-none bg-gray-50 focus:bg-white"
                placeholder="Nome personalizado (opcional)"
                value={customName}
                onBlur={handleCustomNameBlur}
                onChange={e => setCustomName(e.target.value)}
                onKeyDown={handleCustomNameKeyDown}
                style={{ fontSize: 13 }}
              />
            </div>
            <DropdownMenuItem
              onClick={() => handleSetFavorite(null)}
              className="text-gray-500"
            >
              Remover opção
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
