
import React from 'react';
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  value: number[];
  onChange: (value: number[]) => void;
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  value,
  onChange
}) => {
  const formatPriceRange = () => {
    if (value[1] >= 1000) {
      return `R$ ${value[0]} - Acima de R$ 1.000`;
    }
    return `R$ ${value[0]} - R$ ${value[1]}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Faixa de preço: {formatPriceRange()}
      </label>
      <Slider
        value={value}
        onValueChange={onChange}
        max={1000}
        min={0}
        step={50}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>R$ 0</span>
        <span>R$ 1.000+</span>
      </div>
    </div>
  );
};
