import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WishlistItemsGrid from './WishlistItemsGrid';
import WishlistGiftSuggestion from './WishlistGiftSuggestion';
import WishlistHeader from './WishlistHeader';
import WishlistShareDialog from './WishlistShareDialog';

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  url: string;
  addedAt: Date;
  inStock: boolean;
  onSale: boolean;
  priority: 'low' | 'medium' | 'high';
  favoriteType?: 'gostei' | 'quero_comprar';
}

// Mock de produtos (no real seria um banco/api)
const allProducts: Record<string, WishlistItem> = {
  '1': {
    id: '1',
    name: 'Vestido Midi Floral',
    brand: 'Zara',
    price: 159.90,
    originalPrice: 199.90,
    image: '👗',
    url: '#',
    addedAt: new Date(),
    inStock: true,
    onSale: true,
    priority: 'high'
  },
  '2': {
    id: '2',
    name: 'Bolsa Hobo Couro',
    brand: 'Coach',
    price: 899.90,
    image: '👜',
    url: '#',
    addedAt: new Date(),
    inStock: true,
    onSale: false,
    priority: 'medium'
  },
  '3': {
    id: '3',
    name: 'Sandália Plataforma',
    brand: 'Arezzo',
    price: 229.90,
    originalPrice: 299.90,
    image: '👡',
    url: '#',
    addedAt: new Date(),
    inStock: true,
    onSale: true,
    priority: 'medium'
  },
  '4': {
    id: '4',
    name: 'Blazer Alfaiataria',
    brand: 'Renner',
    price: 299.90,
    image: '🧥',
    url: '#',
    addedAt: new Date(),
    inStock: true,
    onSale: false,
    priority: 'low'
  },
  '5': {
    id: '5',
    name: 'Calça Wide Jeans',
    brand: 'Levi’s',
    price: 259.90,
    originalPrice: 329.90,
    image: '👖',
    url: '#',
    addedAt: new Date(),
    inStock: true,
    onSale: true,
    priority: 'medium'
  }
};

const wishlistExamples: WishlistItem[] = [
  {
    ...allProducts['1'],
    favoriteType: 'quero_comprar',
    // priority: 'high', // a label é ignorada, usamos favoriteType agora.
  },
  {
    ...allProducts['2'],
    favoriteType: 'gostei',
    // priority: 'medium',
  },
  {
    ...allProducts['3'],
    favoriteType: 'quero_comprar',
    // priority: 'medium',
  },
];

const Wishlist = () => {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  // Monta wishlist com base nos favoritos do localStorage (ou exemplos fictícios)
  const syncWishlistFromFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites_v2') || '{}');
    const items: WishlistItem[] = [];
    Object.entries(favorites).forEach(([productId, favType]) => {
      const p = allProducts[productId];
      if (p) {
        items.push({ ...p, favoriteType: favType as 'gostei' | 'quero_comprar' });
      }
    });
    // Se não houver favoritos salvos, mostrar exemplos fictícios
    if (items.length === 0) {
      setWishlistItems(wishlistExamples);
    } else {
      setWishlistItems(items);
    }
  };

  useEffect(() => {
    syncWishlistFromFavorites();
    window.addEventListener('favorites-updated', syncWishlistFromFavorites);
    return () => {
      window.removeEventListener('favorites-updated', syncWishlistFromFavorites);
    }
  }, []);

  // Remove item do favoritos
  const removeFromWishlist = (itemId: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites_v2') || '{}');
    delete favorites[itemId];
    localStorage.setItem('favorites_v2', JSON.stringify(favorites));
    syncWishlistFromFavorites();
    toast({
      title: "Item removido",
      description: "Produto removido da sua lista de desejos"
    });
    window.dispatchEvent(new Event('favorites-updated'));
  };

  // Toggle alerta de preço
  const togglePriceAlert = (itemId: string) => {
    if (priceAlerts.includes(itemId)) {
      setPriceAlerts(priceAlerts.filter(id => id !== itemId));
      toast({
        title: "Alerta desativado",
        description: "Você não receberá mais notificações de preço"
      });
    } else {
      setPriceAlerts([...priceAlerts, itemId]);
      toast({
        title: "Alerta ativado! 🔔",
        description: "Te avisaremos quando o preço baixar"
      });
    }
  };

  // Filtro por categoria ('gostei', 'quero_comprar', 'all')
  const filteredItems = wishlistItems.filter(item => {
    if (categoryFilter === 'all') return true;
    return item.favoriteType === categoryFilter;
  });
  const gridItems = showAll ? filteredItems : filteredItems.slice(0, 3);

  // NOVO: Contagem separada para "gostei" e "quero_comprar"
  const countGostei = wishlistItems.filter(item => item.favoriteType === 'gostei').length;
  const countQueroComprar = wishlistItems.filter(item => item.favoriteType === 'quero_comprar').length;

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const onSaleItems = wishlistItems.filter(item => item.onSale).length;

  return (
    <div className="space-y-6">
      <Card>
        {/* Filtro por categoria - AGORA no topo do card */}
        <div className="flex flex-col md:flex-row gap-2 md:items-center px-6 mt-4">
          <label htmlFor="wishlist-category" className="text-sm text-gray-500 mr-2">Filtrar por:</label>
          <select
            id="wishlist-category"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-40"
          >
            <option value="all">Todos</option>
            <option value="gostei">Gostei</option>
            <option value="quero_comprar">Quero comprar</option>
          </select>
        </div>
        <WishlistHeader
          selectedWishlist={{
            id: 'unique-list',
            name: 'Minha Lista de Desejos',
            description: '',
            isPublic: false,
            items: wishlistItems,
            createdAt: new Date()
          }}
          countGostei={countGostei}
          countQueroComprar={countQueroComprar}
          onSaleItems={onSaleItems}
          shareWishlist={() => setShareDialogOpen(true)}
        />
        <WishlistItemsGrid
          items={gridItems}
          removeFromWishlist={
            // Caso esteja mostrando exemplos, esconder a função de remover
            wishlistItems === wishlistExamples
              ? () => {}
              : (itemId) => {
                const favorites = JSON.parse(localStorage.getItem('favorites_v2') || '{}');
                delete favorites[itemId];
                localStorage.setItem('favorites_v2', JSON.stringify(favorites));
                syncWishlistFromFavorites();
                toast({
                  title: "Item removido",
                  description: "Produto removido da sua lista de desejos"
                });
                window.dispatchEvent(new Event('favorites-updated'));
              }
          }
          priceAlerts={priceAlerts}
          togglePriceAlert={togglePriceAlert}
        />
        {filteredItems.length > 3 && (
          <div className="flex justify-center py-3">
            <button
              className="px-4 py-1 rounded bg-pink-100 text-pink-700 hover:bg-pink-200 text-sm font-medium transition"
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? "Ver menos" : `Ver mais (${filteredItems.length - 3})`}
            </button>
          </div>
        )}
      </Card>
      {/* Diálogo de compartilhamento de produtos */}
      <WishlistShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        items={wishlistItems}
        onShared={(amount) => toast({
          title: "Lista copiada!",
          description: `Informações de ${amount} produto${amount > 1 ? 's' : ''} prontas para compartilhar!`
        })}
      />
      {/* Banner presente apenas se quisermos ativar sugestões de presentes */}
      {/* <WishlistGiftSuggestion /> */}
    </div>
  );
};

export default Wishlist;
