
import React from 'react';
import WishlistItemCard from './WishlistItemCard';
import { WishlistItem } from './Wishlist';
import { Separator } from "@/components/ui/separator";

interface WishlistItemsGridProps {
  items: WishlistItem[];
  removeFromWishlist: (itemId: string) => void;
  priceAlerts: string[];
  togglePriceAlert: (itemId: string) => void;
  // Removido props que agora controlamos no componente pai.
}

const WishlistItemsGrid = ({
  items,
  removeFromWishlist,
  priceAlerts,
  togglePriceAlert
}: WishlistItemsGridProps) => (
  <div className="p-6 pt-0">
    {items.length === 0 ? (
      <div className="text-center py-8">
        {/* Empty State */}
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24"><path d="M12 21c-6.075 0-11-4.925-11-11S5.925-1 12-1s11 4.925 11 11-4.925 11-11 11zm0-2c4.963 0 9-4.037 9-9s-4.037-9-9-9-9 4.037-9 9 4.037 9 9 9z" /></svg>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sua lista de desejos está vazia. Que tal adicionar alguns desejos?
        </p>
      </div>
    ) : (
      <div className="flex flex-col gap-1">
        {items.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx !== 0 && (
              <Separator className="my-3 bg-gray-200 dark:bg-gray-700 opacity-60" />
            )}
            <WishlistItemCard
              item={item}
              removeFromWishlist={removeFromWishlist}
              priceAlerts={priceAlerts}
              togglePriceAlert={togglePriceAlert}
            />
          </React.Fragment>
        ))}
      </div>
    )}
  </div>
);

export default WishlistItemsGrid;
