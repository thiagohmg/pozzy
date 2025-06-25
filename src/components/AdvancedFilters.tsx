import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search, Filter, X } from 'lucide-react';
import { SearchAutocomplete } from './filters/SearchAutocomplete';
import { PriceRangeFilter } from './filters/PriceRangeFilter';
import { CheckboxGroup } from './filters/CheckboxGroup';
import { StockFilters } from './filters/StockFilters';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const AdvancedFilters = ({ onFiltersChange }: AdvancedFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);

  const brands = ['Zara', 'H&M', 'Nike', 'Adidas', 'Forever 21', 'Mango', 'Uniqlo', 'Gap', 'C&A', 'Renner', 'Riachuelo', 'Farm', 'Osklen', 'Colcci'];
  const colors = ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde', 'Rosa', 'Amarelo', 'Cinza', 'Marrom', 'Roxo', 'Laranja', 'Bege', 'Azul Marinho', 'Verde Escuro'];
  const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];
  const categories = ['Vestidos', 'Blusas', 'Calças', 'Saias', 'Blazers', 'Jaquetas', 'Acessórios', 'Sapatos', 'Bolsas', 'Bijuterias', 'Óculos', 'Lingerie'];

  const searchSuggestions = [
    'vestido floral',
    'blazer executivo',
    'calça jeans',
    'blusa social',
    'saia midi',
    'jaqueta de couro',
    'vestido de festa',
    'camisa branca',
    'tênis casual',
    'bolsa de mão',
    'sapato social',
    'óculos de sol',
    'relógio',
    'colar',
    'brincos',
    'pulseira'
  ];

  const handleArrayChange = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    checked: boolean
  ) => {
    if (checked) {
      setArray([...array, item]);
    } else {
      setArray(array.filter(i => i !== item));
    }
  };

  const handleApplyFilters = () => {
    const filters = {
      searchQuery: searchQuery.join(' '),
      priceRange,
      brands: selectedBrands,
      colors: selectedColors,
      sizes: selectedSizes,
      categories: selectedCategories,
      inStock,
      onSale
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchQuery([]);
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setInStock(false);
    setOnSale(false);
  };

  const hasActiveFilters = searchQuery.length > 0 || selectedBrands.length > 0 || 
    selectedColors.length > 0 || selectedSizes.length > 0 || selectedCategories.length > 0 || 
    inStock || onSale || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <div>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <span className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <Filter className="h-5 w-5" />
          Filtros Avançados
        </span>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      <div className="space-y-6 px-6 pb-6">
        <SearchAutocomplete
          value={searchQuery}
          onChange={setSearchQuery}
          suggestions={[]}
          placeholder="Digite livremente o que você procura..."
          emptyText="Digite qualquer termo de busca."
          label="Buscar produtos"
        />

        <PriceRangeFilter
          value={priceRange}
          onChange={setPriceRange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorias
            </label>
            <SearchAutocomplete
              value={selectedCategories}
              onChange={setSelectedCategories}
              suggestions={categories}
              placeholder="Digite ou selecione categorias..."
              emptyText="Nenhuma categoria encontrada."
              showLabel={false}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marcas
            </label>
            <SearchAutocomplete
              value={selectedBrands}
              onChange={setSelectedBrands}
              suggestions={brands}
              placeholder="Digite ou selecione marcas..."
              emptyText="Nenhuma marca encontrada."
              showLabel={false}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cores
          </label>
          <SearchAutocomplete
            value={selectedColors}
            onChange={setSelectedColors}
            suggestions={colors}
            placeholder="Digite ou selecione cores..."
            emptyText="Nenhuma cor encontrada."
            showLabel={false}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Tamanhos
          </label>
          <ToggleGroup
            type="multiple"
            value={selectedSizes}
            onValueChange={setSelectedSizes}
            className="justify-start flex-wrap gap-2"
          >
            {sizes.map((size) => (
              <ToggleGroupItem
                key={size}
                value={size}
                variant="outline"
                className="px-4 py-2 min-w-[60px] data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {size}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <StockFilters
          inStock={inStock}
          onSale={onSale}
          onInStockChange={setInStock}
          onOnSaleChange={setOnSale}
        />

        {/* Botões de ação melhor alinhados para mobile */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleApplyFilters} className="flex-1 h-10">
            <Search className="h-4 w-4 mr-2" />
            Aplicar Filtros
          </Button>
          <Button onClick={clearFilters} variant="outline" disabled={!hasActiveFilters} className="flex-1 h-10">
            <Filter className="h-4 w-4 mr-2" />
            Limpar Tudo
          </Button>
        </div>
      </div>
    </div>
  );
};
