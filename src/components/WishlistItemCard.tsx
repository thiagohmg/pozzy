import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { X, Bell, ShoppingBag, Share2 } from 'lucide-react';
import { WishlistItem } from './Wishlist';
import { useToast } from '@/hooks/use-toast';

// Cores padronizadas para os rótulos
const labelColor = (favoriteType?: 'gostei' | 'quero_comprar') => {
  if (favoriteType === 'gostei') {
    // Agora azul!
    return 'bg-blue-500 text-white';
  }
  if (favoriteType === 'quero_comprar') {
    // Agora verde!
    return 'bg-green-500 text-white';
  }
  return 'bg-gray-100 text-gray-700';
};

// Labels padronizados
const getPriorityLabel = (priority: string, favoriteType?: 'gostei' | 'quero_comprar') => {
  if (favoriteType === 'gostei') return 'Gostei';
  if (favoriteType === 'quero_comprar') return 'quero comprar'; // minúsculo!
  switch (priority) {
    case 'high': return 'Gostei';
    case 'medium': return 'Quero comprar';
    case 'low': return 'Talvez';
    default: return '';
  }
};

interface WishlistItemCardProps {
  item: WishlistItem;
  removeFromWishlist: (itemId: string) => void;
  priceAlerts: string[];
  togglePriceAlert: (itemId: string) => void;
}

const WishlistItemCard = ({
  item,
  removeFromWishlist,
  priceAlerts,
  togglePriceAlert
}: WishlistItemCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAlertClick = () => {
    if (priceAlerts.includes(item.id)) {
      togglePriceAlert(item.id);
    } else {
      setDialogOpen(true);
    }
  };

  const handleConfirm = () => {
    togglePriceAlert(item.id);
    setDialogOpen(false);
  };

  // Novo: Compartilhar produto
  const handleShareProduct = () => {
    const shareText = `${item.image} Produto: ${item.name} - ${item.brand} R$ ${item.price.toFixed(2).replace('.', ',')} (Veja mais: ${item.url})`;
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Produto copiado!",
      description: "As informações deste produto estão prontas para compartilhar."
    });
  };

  return (
    <div
      className="
        flex flex-col items-center
        transition-all duration-150
        p-3 pb-5 md:pb-3
        mx-auto
        max-w-xs
        w-full
      "
      style={{ minWidth: 0 }}
    >
      <div className="rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-6xl min-h-[190px] mb-2 transition-all duration-200 w-full">
        {item.image}
      </div>
      <div className="flex-1 flex flex-col gap-2 w-full items-center text-center">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 min-w-0 text-left">
            <h3 className="font-medium text-sm truncate">{item.name}</h3>
            <p className="text-xs text-gray-500 truncate">{item.brand}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromWishlist(item.id)}
            className="text-gray-300 hover:text-red-500 px-1 py-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between w-full">
          <div>
            {item.onSale && item.originalPrice && (
              <span className="text-xs text-gray-400 line-through mr-1">
                R$ {item.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className={`font-bold ${item.onSale ? 'text-orange-600' : 'text-pink-600'} text-base`}>
              R$ {item.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <Badge
            className={
              `text-xs font-semibold px-3 py-1 border-0
              ${labelColor(item.favoriteType)}
              ${
                item.favoriteType === 'quero_comprar' || item.favoriteType === 'gostei'
                  ? 'rounded-md lowercase !rounded !px-4 !py-1.5 min-w-[90px] max-w-[110px] text-center whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center'
                  : 'rounded-full'
              }`
            }
            variant="secondary"
            style={{ letterSpacing: 0 }}
          >
            {getPriorityLabel(item.priority, item.favoriteType)}
          </Badge>
        </div>
        {item.onSale && (
          <Badge className="bg-orange-100 text-orange-700 text-xs font-semibold border-0 px-2 py-0.5 mt-1 mb-2 w-max mx-auto">
            🔥 Em Promoção!
          </Badge>
        )}
        {/* Centralizar os botões */}
        <div className="flex justify-center gap-2 mt-2 mb-0 w-full">
          <Button
            variant={priceAlerts.includes(item.id) ? 'secondary' : 'outline'}
            size="sm"
            className={`flex-1 text-xs py-2 rounded ${priceAlerts.includes(item.id) ? 'bg-blue-50 border-blue-400 text-blue-700' : ''}`}
            onClick={handleAlertClick}
          >
            <Bell className={`h-3 w-3 mr-1 ${priceAlerts.includes(item.id) ? 'text-blue-500' : ''}`} />
            {priceAlerts.includes(item.id) ? 'Alertando' : 'Alerta Preço'}
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-xs py-2 rounded"
          >
            <ShoppingBag className="h-3 w-3 mr-1" />
            Comprar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-0 text-gray-400 hover:text-blue-500 py-2 px-2 rounded"
            onClick={handleShareProduct}
            aria-label="Compartilhar produto"
            type="button"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Dialog de confirmação para ativar alerta */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ativar alerta de preço?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600 py-2">
            Você deseja ser avisada caso o preço deste produto mude?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleConfirm}
            >
              Quero ser avisada!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WishlistItemCard;
