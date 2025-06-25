
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (value: string, checked: boolean) => void;
  columns?: number;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  columns = 2
}) => {
  const getFlexClass = () => {
    switch(columns) {
      case 1: return 'flex-col';
      case 3: return 'flex-wrap';
      case 4: return 'flex-wrap';
      case 6: return 'flex-wrap';
      default: return 'flex-wrap';
    }
  };

  const getItemWidth = () => {
    switch(columns) {
      case 1: return 'w-full';
      case 2: return 'w-1/2';
      case 3: return 'w-1/3';
      case 4: return 'w-1/4';
      case 6: return 'w-1/6';
      default: return 'w-1/2';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className={`flex ${getFlexClass()} gap-2`}>
        {options.map((option) => (
          <div key={option} className={`flex items-center space-x-2 ${getItemWidth()} pr-2 mb-2`}>
            <Checkbox
              id={`${label.toLowerCase().replace(/\s+/g, '-')}-${option.toLowerCase().replace(/\s+/g, '-')}`}
              checked={selectedValues.includes(option)}
              onCheckedChange={(checked) => onChange(option, !!checked)}
            />
            <label 
              htmlFor={`${label.toLowerCase().replace(/\s+/g, '-')}-${option.toLowerCase().replace(/\s+/g, '-')}`} 
              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
