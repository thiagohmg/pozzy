
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface StockFiltersProps {
  inStock: boolean;
  onSale: boolean;
  onInStockChange: (checked: boolean) => void;
  onOnSaleChange: (checked: boolean) => void;
}

export const StockFilters: React.FC<StockFiltersProps> = ({
  inStock,
  onSale,
  onInStockChange,
  onOnSaleChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={inStock}
          onCheckedChange={(checked) => onInStockChange(!!checked)}
        />
        <label htmlFor="inStock" className="text-sm">
          Produtos em estoque
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="onSale"
          checked={onSale}
          onCheckedChange={(checked) => onOnSaleChange(!!checked)}
        />
        <label htmlFor="onSale" className="text-sm">
          Produtos em promoção
        </label>
      </div>
    </div>
  );
};
