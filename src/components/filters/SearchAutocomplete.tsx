
import React from 'react';
import { Autocomplete } from "@/components/ui/autocomplete";

interface SearchAutocompleteProps {
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  placeholder?: string;
  emptyText?: string;
  showLabel?: boolean;
  label?: string;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  value,
  onChange,
  suggestions,
  placeholder = "Digite o que você procura...",
  emptyText = "Nenhuma sugestão encontrada.",
  showLabel = true,
  label = "Buscar produtos"
}) => {
  return (
    <div>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <Autocomplete
        options={suggestions}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        emptyText={emptyText}
        className="w-full"
      />
    </div>
  );
};
