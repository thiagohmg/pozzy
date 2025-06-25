
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shuffle, Heart, Share2, Download, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface OutfitPiece {
  id: string;
  type: 'top' | 'bottom' | 'dress' | 'shoes' | 'accessory';
  name: string;
  image: string;
  color: string;
  brand: string;
  price: string;
  occasion: string[];
  style: string[];
}

const mockPieces: OutfitPiece[] = [
  {
    id: '1',
    type: 'top',
    name: 'Blusa de Seda Rosa',
    image: '👚',
    color: 'rosa',
    brand: 'Zara',
    price: 'R$ 89,90',
    occasion: ['trabalho', 'encontro'],
    style: ['romantic', 'feminine']
  },
  {
    id: '2',
    type: 'bottom',
    name: 'Calça Alfaiataria Preta',
    image: '👖',
    color: 'preto',
    brand: 'Mango',
    price: 'R$ 159,90',
    occasion: ['trabalho', 'formal'],
    style: ['classic', 'professional']
  },
  {
    id: '3',
    type: 'shoes',
    name: 'Scarpin Nude',
    image: '👠',
    color: 'nude',
    brand: 'Arezzo',
    price: 'R$ 199,90',
    occasion: ['trabalho', 'encontro', 'formal'],
    style: ['classic', 'feminine']
  },
  {
    id: '4',
    type: 'dress',
    name: 'Vestido Midi Floral',
    image: '👗',
    color: 'floral',
    brand: 'Farm',
    price: 'R$ 219,90',
    occasion: ['casual', 'encontro'],
    style: ['romantic', 'boho']
  },
  {
    id: '5',
    type: 'accessory',
    name: 'Bolsa Pequena Preta',
    image: '👜',
    color: 'preto',
    brand: 'Coach',
    price: 'R$ 899,90',
    occasion: ['trabalho', 'encontro', 'formal'],
    style: ['classic', 'minimalist']
  }
];

interface GeneratedOutfit {
  id: string;
  pieces: OutfitPiece[];
  occasion: string;
  style: string;
  totalPrice: number;
  rating: number;
}

export const OutfitGenerator = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [generatedOutfits, setGeneratedOutfits] = useState<GeneratedOutfit[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [favoriteOutfits, setFavoriteOutfits] = useState<string[]>([]);
  const { toast } = useToast();

  const occasions = [
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'encontro', label: 'Encontro' },
    { value: 'casual', label: 'Casual' },
    { value: 'festa', label: 'Festa' },
    { value: 'formal', label: 'Formal' },
    { value: 'viagem', label: 'Viagem' }
  ];

  const styles = [
    { value: 'romantic', label: 'Romântico' },
    { value: 'classic', label: 'Clássico' },
    { value: 'boho', label: 'Boho' },
    { value: 'minimalist', label: 'Minimalista' },
    { value: 'trendy', label: 'Moderno' }
  ];

  const generateOutfits = async () => {
    if (!selectedOccasion) {
      toast({
        title: "Selecione uma ocasião",
        description: "Escolha para qual ocasião você quer o look",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simular geração de looks
    setTimeout(() => {
      const filteredPieces = mockPieces.filter(piece => 
        piece.occasion.includes(selectedOccasion) &&
        (!selectedStyle || piece.style.includes(selectedStyle))
      );

      const newOutfits: GeneratedOutfit[] = [];

      // Gerar 3 looks diferentes
      for (let i = 0; i < 3; i++) {
        const outfit: OutfitPiece[] = [];
        const usedTypes = new Set<string>();

        // Adicionar vestido OU (top + bottom)
        const dresses = filteredPieces.filter(p => p.type === 'dress');
        const tops = filteredPieces.filter(p => p.type === 'top');
        const bottoms = filteredPieces.filter(p => p.type === 'bottom');

        if (Math.random() > 0.5 && dresses.length > 0) {
          // Look com vestido
          outfit.push(dresses[Math.floor(Math.random() * dresses.length)]);
          usedTypes.add('dress');
        } else if (tops.length > 0 && bottoms.length > 0) {
          // Look com top + bottom
          outfit.push(tops[Math.floor(Math.random() * tops.length)]);
          outfit.push(bottoms[Math.floor(Math.random() * bottoms.length)]);
          usedTypes.add('top');
          usedTypes.add('bottom');
        }

        // Adicionar sapatos
        const shoes = filteredPieces.filter(p => p.type === 'shoes');
        if (shoes.length > 0) {
          outfit.push(shoes[Math.floor(Math.random() * shoes.length)]);
        }

        // Adicionar acessório
        const accessories = filteredPieces.filter(p => p.type === 'accessory');
        if (accessories.length > 0) {
          outfit.push(accessories[Math.floor(Math.random() * accessories.length)]);
        }

        if (outfit.length > 0) {
          const totalPrice = outfit.reduce((sum, piece) => {
            const price = parseFloat(piece.price.replace('R$ ', '').replace(',', '.'));
            return sum + price;
          }, 0);

          newOutfits.push({
            id: `outfit-${i + 1}`,
            pieces: outfit,
            occasion: selectedOccasion,
            style: selectedStyle || 'mixed',
            totalPrice,
            rating: Math.floor(Math.random() * 5) + 1
          });
        }
      }

      setGeneratedOutfits(newOutfits);
      setIsGenerating(false);

      toast({
        title: `${newOutfits.length} looks gerados! ✨`,
        description: `Looks perfeitos para ${selectedOccasion}`
      });
    }, 2000);
  };

  const toggleFavorite = (outfitId: string) => {
    setFavoriteOutfits(prev => 
      prev.includes(outfitId) 
        ? prev.filter(id => id !== outfitId)
        : [...prev, outfitId]
    );

    toast({
      title: favoriteOutfits.includes(outfitId) ? "Removido dos favoritos" : "Adicionado aos favoritos! 💕",
      description: "Seus looks favoritos ficam salvos para você"
    });
  };

  const shareOutfit = (outfit: GeneratedOutfit) => {
    const text = `Confira este look incrível que o POZZY gerou para ${outfit.occasion}! Total: R$ ${outfit.totalPrice.toFixed(2).replace('.', ',')}`;
    navigator.clipboard.writeText(text);
    
    toast({
      title: "Look compartilhado! 📱",
      description: "Link copiado para a área de transferência"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Gerador de Looks ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Crie looks completos para qualquer ocasião em segundos
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>Personalizar Look</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ocasião *</label>
              <Select value={selectedOccasion} onValueChange={setSelectedOccasion}>
                <SelectTrigger>
                  <SelectValue placeholder="Para qual ocasião?" />
                </SelectTrigger>
                <SelectContent>
                  {occasions.map(occasion => (
                    <SelectItem key={occasion.value} value={occasion.value}>
                      {occasion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Estilo (Opcional)</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Que estilo você prefere?" />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(style => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateOutfits} 
            disabled={isGenerating || !selectedOccasion}
            className="w-full bg-purple-500 hover:bg-purple-600"
          >
            {isGenerating ? (
              <>
                <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                Gerando looks incríveis...
              </>
            ) : (
              <>
                <Shuffle className="h-4 w-4 mr-2" />
                Gerar Looks
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Looks Gerados */}
      {generatedOutfits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Seus Looks para {occasions.find(o => o.value === selectedOccasion)?.label}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {generatedOutfits.map(outfit => (
              <Card key={outfit.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        Look {outfit.id.split('-')[1]}
                      </Badge>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < outfit.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(outfit.id)}
                        className={favoriteOutfits.includes(outfit.id) ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${favoriteOutfits.includes(outfit.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareOutfit(outfit)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Peças do Look */}
                  <div className="grid grid-cols-2 gap-2">
                    {outfit.pieces.map(piece => (
                      <div key={piece.id} className="text-center space-y-1">
                        <div className="text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          {piece.image}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{piece.name}</p>
                          <p className="text-xs text-gray-500">{piece.brand}</p>
                          <p className="text-xs text-purple-600">{piece.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-lg text-purple-600">
                        R$ {outfit.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Salvar Look
                    </Button>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600" size="sm">
                      Ver Produtos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estado Vazio */}
      {generatedOutfits.length === 0 && !isGenerating && (
        <div className="text-center py-12">
          <Shuffle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            Pronta para criar looks incríveis?
          </h3>
          <p className="text-gray-500">
            Selecione uma ocasião e deixe nossa IA criar looks perfeitos para você
          </p>
        </div>
      )}
    </div>
  );
};
