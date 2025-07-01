import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Palette, 
  Heart, 
  Camera, 
  Loader2,
  Shirt,
  Zap,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { realAPIs } from '@/integrations/realAPIs';

interface Outfit {
  id: string;
  name: string;
  description: string;
  items: OutfitItem[];
  totalPrice: number;
  style: string;
  occasion: string;
  confidence: number;
  image_url?: string;
}

interface OutfitItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image_url: string;
  url: string;
}

export const RealOutfitGenerator: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [colorPalette, setColorPalette] = useState<any>(null);

  const { toast } = useToast();

  const styles = [
    'Casual', 'Elegante', 'Esportivo', 'Romântico', 'Vintage', 'Minimalista'
  ];

  const occasions = [
    'Trabalho', 'Encontro', 'Festa', 'Viagem', 'Dia a dia', 'Especial'
  ];

  const generateOutfit = async () => {
    if (!selectedStyle || !selectedOccasion) {
      toast({
        title: "Selecione estilo e ocasião",
        description: "Escolha um estilo e uma ocasião para gerar looks",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Simular geração de outfit com IA
      const mockOutfit: Outfit = {
        id: Date.now().toString(),
        name: `Look ${selectedStyle} para ${selectedOccasion}`,
        description: `Perfeito para ${selectedOccasion.toLowerCase()} com estilo ${selectedStyle.toLowerCase()}`,
        items: [
          {
            id: '1',
            name: 'Blazer Clássico',
            brand: 'Zara',
            price: 299.90,
            category: 'blazer',
            image_url: 'https://via.placeholder.com/300x400/7c3aed/ffffff?text=Blazer',
            url: '#'
          },
          {
            id: '2',
            name: 'Camisa Básica',
            brand: 'H&M',
            price: 89.90,
            category: 'camisa',
            image_url: 'https://via.placeholder.com/300x400/7c3aed/ffffff?text=Camisa',
            url: '#'
          },
          {
            id: '3',
            name: 'Calça Jeans',
            brand: 'Levi\'s',
            price: 199.90,
            category: 'calça',
            image_url: 'https://via.placeholder.com/300x400/7c3aed/ffffff?text=Calça',
            url: '#'
          }
        ],
        totalPrice: 589.70,
        style: selectedStyle,
        occasion: selectedOccasion,
        confidence: 85
      };

      setOutfits(prev => [mockOutfit, ...prev]);
      
      toast({
        title: "Look gerado com sucesso!",
        description: `Criamos um look ${selectedStyle.toLowerCase()} para ${selectedOccasion.toLowerCase()}`
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar look",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Gerador de Looks Inteligente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seleção de Estilo */}
          <div>
            <h4 className="font-semibold mb-2">Estilo</h4>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <Button
                  key={style}
                  variant={selectedStyle === style ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStyle(style)}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          {/* Seleção de Ocasião */}
          <div>
            <h4 className="font-semibold mb-2">Ocasião</h4>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occasion) => (
                <Button
                  key={occasion}
                  variant={selectedOccasion === occasion ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedOccasion(occasion)}
                >
                  {occasion}
                </Button>
              ))}
            </div>
          </div>

          {/* Botão Gerar */}
          <Button
            onClick={generateOutfit}
            disabled={loading || !selectedStyle || !selectedOccasion}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Gerar Look Personalizado
          </Button>
        </CardContent>
      </Card>

      {/* Looks Gerados */}
      {outfits.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Looks Gerados</h3>
          {outfits.map((outfit) => (
            <Card key={outfit.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{outfit.name}</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {outfit.confidence}% match
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{outfit.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {outfit.items.map((item) => (
                    <div key={item.id} className="text-center">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <h5 className="font-medium text-sm">{item.name}</h5>
                      <p className="text-xs text-gray-600">{item.brand}</p>
                      <p className="text-sm font-semibold text-purple-600">
                        R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Total do Look</p>
                    <p className="text-lg font-bold text-purple-600">
                      R$ {outfit.totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      Salvar
                    </Button>
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-1" />
                      Comprar Tudo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 