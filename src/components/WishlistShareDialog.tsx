import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Share2 } from "lucide-react";
import { WishlistItem } from "./Wishlist";

interface WishlistShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: WishlistItem[];
  onShared: (sharedCount: number) => void;
}

const getItemText = (item: WishlistItem) =>
  `${item.image} ${item.name} - ${item.brand} R$ ${item.price.toFixed(2).replace(".", ",")} ${item.url ? `(Veja mais: ${item.url})` : ""}`;

const WishlistShareDialog: React.FC<WishlistShareDialogProps> = ({
  open,
  onOpenChange,
  items,
  onShared
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelected(items.map(i => i.id)); // Selecionar todos ao abrir
    }
  }, [open, items]);

  const handleToggle = (id: string) => {
    setSelected(s =>
      s.includes(id) ? s.filter(i => i !== id) : [...s, id]
    );
  };

  const handleSelectAll = () => {
    setSelected(items.map(i => i.id));
  };

  const handleDeselectAll = () => {
    setSelected([]);
  };

  const handleShare = () => {
    const shareText = selected
      .map(id => {
        const item = items.find(i => i.id === id);
        return item ? getItemText(item) : "";
      })
      .filter(Boolean)
      .join("\n");
    if (shareText.trim().length > 0) {
      navigator.clipboard.writeText(shareText);
      onShared(selected.length);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar produtos selecionados</DialogTitle>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto divide-y mb-2">
          {items.map(item => (
            <label
              key={item.id}
              className="flex items-center py-2 px-1 gap-2 cursor-pointer"
              htmlFor={`share-checkbox-${item.id}`}
            >
              <Checkbox
                id={`share-checkbox-${item.id}`}
                checked={selected.includes(item.id)}
                onCheckedChange={() => handleToggle(item.id)}
                className="mr-2"
              />
              <span className="truncate flex-1 text-sm">
                {item.image} <span className="font-medium">{item.name}</span>, <span className="text-gray-500">{item.brand}</span>
                <span className="ml-2 font-semibold text-pink-600">R$ {item.price.toFixed(2).replace(".", ",")}</span>
              </span>
            </label>
          ))}
          {items.length === 0 && (
            <div className="text-gray-400 text-center py-4">Nenhum produto na lista.</div>
          )}
        </div>
        {items.length > 0 && (
          <div className="flex items-center justify-between gap-3 mb-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs underline px-1 py-0"
              type="button"
              onClick={handleSelectAll}
              disabled={selected.length === items.length}
            >
              Selecionar todos
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs underline px-1 py-0"
              type="button"
              onClick={handleDeselectAll}
              disabled={selected.length === 0}
            >
              Limpar seleção
            </Button>
            <div className="text-xs text-gray-500">
              {selected.length} selecionado{selected.length > 1 ? "s" : ""}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <div className="flex flex-col items-end">
            <Button
              type="button"
              className="bg-blue-500 text-white hover:bg-blue-600"
              disabled={selected.length === 0}
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Compartilhar selecionados
            </Button>
            <span className="text-[10px] text-gray-500 mt-1">
              Compartilhe vários itens juntos.
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistShareDialog;
