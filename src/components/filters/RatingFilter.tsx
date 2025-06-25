
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from 'lucide-react';

interface RatingFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export const RatingFilter: React.FC<RatingFilterProps> = ({
  value,
  onChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Avaliação mínima
      </label>
      <Select 
        value={value?.toString() || 'none'} 
        onValueChange={(value) => onChange(value === 'none' ? null : parseInt(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a avaliação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Qualquer avaliação</SelectItem>
          <SelectItem value="5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1">5 estrelas</span>
            </div>
          </SelectItem>
          <SelectItem value="4">
            <div className="flex items-center">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              <Star className="h-3 w-3 text-gray-300" />
              <span className="ml-1">4+ estrelas</span>
            </div>
          </SelectItem>
          <SelectItem value="3">
            <div className="flex items-center">
              {[...Array(3)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
              {[...Array(2)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-gray-300" />
              ))}
              <span className="ml-1">3+ estrelas</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
