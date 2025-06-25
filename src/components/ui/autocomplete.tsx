
import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AutocompleteProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

export function Autocomplete({
  options,
  value,
  onChange,
  placeholder = "Digite para buscar...",
  emptyText = "Nenhum resultado encontrado.",
  className
}: AutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleSelect = (selectedValue: string) => {
    if (!value.includes(selectedValue)) {
      onChange([...value, selectedValue])
    }
    setInputValue("")
    setOpen(false)
  }

  const handleRemove = (itemToRemove: string) => {
    onChange(value.filter(item => item !== itemToRemove))
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && inputValue.trim() && !options.find(option => 
      option.toLowerCase() === inputValue.toLowerCase()
    )) {
      // Adiciona o valor personalizado se não existe nas opções
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()])
      }
      setInputValue("")
      setOpen(false)
      event.preventDefault()
    }
  }

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(option)
  )

  return (
    <div className={cn("w-full", className)}>
      {/* Itens selecionados */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item) => (
            <Badge key={item} variant="secondary" className="flex items-center gap-1">
              {item}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleRemove(item)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Campo de busca */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {inputValue || placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput 
              placeholder={placeholder}
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue.trim() ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-muted-foreground mb-2">{emptyText}</p>
                    <p className="text-xs text-muted-foreground">
                      Pressione Enter para adicionar "{inputValue}"
                    </p>
                  </div>
                ) : (
                  emptyText
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                    className="cursor-pointer"
                  >
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
