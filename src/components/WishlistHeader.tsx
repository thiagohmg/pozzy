
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from 'lucide-react';

interface WishlistHeaderProps {
  selectedWishlist: {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
    items: any[];
    createdAt: Date;
  };
  countGostei: number;
  countQueroComprar: number;
  onSaleItems: number;
  shareWishlist: () => void;
}

const WishlistHeader = ({
  selectedWishlist,
  countGostei,
  countQueroComprar,
  onSaleItems,
  shareWishlist
}: WishlistHeaderProps) => (
  <CardHeader>
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
      <div className="w-full min-w-0">
        <CardTitle className="flex items-center space-x-2 text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="block truncate">{selectedWishlist.name}</span>
        </CardTitle>
        <div className="flex flex-col mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {/* Cada informação em sua linha */}
          {countGostei > 0 && (
            <div>
              {countGostei} item{countGostei > 1 ? 's' : ''} gostei
            </div>
          )}
          {countQueroComprar > 0 && (
            <div>
              {countQueroComprar} item{countQueroComprar > 1 ? 's' : ''} quero comprar
            </div>
          )}
          {onSaleItems > 0 && (
            <div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {onSaleItems} em promoção!
              </Badge>
            </div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 flex md:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={shareWishlist}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Compartilhar
        </Button>
      </div>
    </div>
  </CardHeader>
);

export default WishlistHeader;

