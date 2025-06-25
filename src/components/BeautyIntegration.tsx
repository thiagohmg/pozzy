
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Sparkles, Eye, Smile, Star } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MakeupSuggestion {
  category: 'eyes' | 'lips' | 'face' | 'nails';
  products: {
    name: string;
    brand: string;
    shade: string;
    price: string;
    description: string;
    image: string;
  }[];
}

interface BeautyMatch {
  outfitColor: string;
  outfitStyle: string;
  makeup: MakeupSuggestion[];
  hairstyle: {
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    timeNeeded: string;
    image: string;
  };
  nails: {
    color: string;
    design: string;
    description: string;
  };
}

export const BeautyIntegration = () => {
  const [selectedOutfit, setSelectedOutfit] = useState<any>(null);
  const [beautyMatch, setBeautyMatch] = useState<BeautyMatch | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const mockOutfits = [
    {
      id: '1',
      name: 'Look Romântico Rosa',
      colors: ['rosa', 'nude'],
      style: 'romantic',
      image: '👗',
      description: 'Vestido floral delicado'
    },
    {
      id: '2',
      name: 'Look Profissional',
      colors: ['preto', 'branco'],
      style: 'classic',
      image: '💼',
      description: 'Blazer preto + calça social'
    },
    {
      id: '3',
      name: 'Look Festa Glamour',
      colors: ['preto', 'dourado'],
      style: 'glamorous',
      image: '✨',
      description: 'Vestido preto com detalhes dourados'
    }
  ];

  const analyzeBeautyMatch = (outfit: any) => {
    setIsAnalyzing(true);
    setSelectedOutfit(outfit);

    // Simular análise de beleza
    setTimeout(() => {
      const beautyData: BeautyMatch = {
        outfitColor: outfit.colors[0],
        outfitStyle: outfit.style,
        makeup: [
          {
            category: 'eyes',
            products: [
              {
                name: 'Paleta de Sombras',
                brand: 'MAC',
                shade: outfit.style === 'romantic' ? 'Tons Rosados' : outfit.style === 'glamorous' ? 'Smokey Eyes' : 'Neutros',
                price: 'R$ 189,00',
                description: 'Perfeita para o seu look',
                image: '🎨'
              },
              {
                name: 'Delineador',
                brand: 'Maybelline',
                shade: 'Preto',
                price: 'R$ 24,90',
                description: 'Para definir o olhar',
                image: '✏️'
              }
            ]
          },
          {
            category: 'lips',
            products: [
              {
                name: 'Batom',
                brand: 'Ruby Rose',
                shade: outfit.style === 'romantic' ? 'Rosa Nude' : outfit.style === 'glamorous' ? 'Vermelho Clássico' : 'Nude Rosado',
                price: 'R$ 12,90',
                description: 'Combina perfeitamente',
                image: '💄'
              }
            ]
          },
          {
            category: 'face',
            products: [
              {
                name: 'Blush',
                brand: 'Natura',
                shade: outfit.style === 'romantic' ? 'Rosa Pêssego' : 'Coral Suave',
                price: 'R$ 39,90',
                description: 'Para um toque de cor natural',
                image: '🌸'
              }
            ]
          }
        ],
        hairstyle: {
          name: outfit.style === 'romantic' ? 'Cachos Soltos' : outfit.style === 'glamorous' ? 'Coque Baixo Elegante' : 'Rabo Baixo Liso',
          description: outfit.style === 'romantic' ? 'Cachos naturais e românticos' : outfit.style === 'glamorous' ? 'Sofisticado e atemporal' : 'Clean e profissional',
          difficulty: outfit.style === 'glamorous' ? 'medium' : 'easy',
          timeNeeded: outfit.style === 'glamorous' ? '15-20 min' : '5-10 min',
          image: '💇‍♀️'
        },
        nails: {
          color: outfit.style === 'romantic' ? 'Rosa Claro' : outfit.style === 'glamorous' ? 'Vermelho Clássico' : 'Nude',
          design: outfit.style === 'glamorous' ? 'Francesinha com brilho' : 'Cor sólida',
          description: 'Complementa perfeitamente o look'
        }
      };

      setBeautyMatch(beautyData);
      setIsAnalyzing(false);

      toast({
        title: "Análise completa! 💄",
        description: "Sugestões de beleza criadas para seu look"
      });
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Beauty Integration 💄
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Complete seu look com sugestões de maquiagem e penteado
        </p>
      </div>

      {/* Seleção de Outfit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span>Escolha seu Look</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {mockOutfits.map(outfit => (
              <Card
                key={outfit.id}
                className={`cursor-pointer transition-all ${
                  selectedOutfit?.id === outfit.id ? 'ring-2 ring-pink-500' : 'hover:shadow-md'
                }`}
                onClick={() => analyzeBeautyMatch(outfit)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-3">{outfit.image}</div>
                  <h3 className="font-medium mb-2">{outfit.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {outfit.description}
                  </p>
                  <div className="flex justify-center space-x-1">
                    {outfit.colors.map((color: string) => (
                      <Badge key={color} variant="secondary" className="text-xs">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {isAnalyzing && (
        <Card className="border-pink-200 bg-pink-50 dark:bg-pink-950">
          <CardContent className="p-6 text-center">
            <Palette className="h-12 w-12 mx-auto text-pink-500 mb-4 animate-pulse" />
            <h3 className="font-medium mb-2">Analisando seu look...</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Criando sugestões de beleza personalizadas para você ✨
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resultados da Análise */}
      {beautyMatch && selectedOutfit && (
        <div className="space-y-6">
          {/* Header do Look */}
          <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{selectedOutfit.image}</div>
                <div>
                  <h3 className="font-bold text-pink-800 dark:text-pink-200">
                    Beauty Match para: {selectedOutfit.name}
                  </h3>
                  <p className="text-sm text-pink-600 dark:text-pink-400">
                    Sugestões personalizadas baseadas no seu estilo {beautyMatch.outfitStyle}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Beleza */}
          <Tabs defaultValue="makeup" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="makeup" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Maquiagem</span>
              </TabsTrigger>
              <TabsTrigger value="hair" className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Cabelo</span>
              </TabsTrigger>
              <TabsTrigger value="nails" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Unhas</span>
              </TabsTrigger>
            </TabsList>

            {/* Maquiagem */}
            <TabsContent value="makeup" className="space-y-4">
              {beautyMatch.makeup.map(category => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize flex items-center space-x-2">
                      {category.category === 'eyes' && <Eye className="h-5 w-5" />}
                      {category.category === 'lips' && <Smile className="h-5 w-5" />}
                      {category.category === 'face' && <Sparkles className="h-5 w-5" />}
                      <span>
                        {category.category === 'eyes' ? 'Olhos' :
                         category.category === 'lips' ? 'Lábios' :
                         category.category === 'face' ? 'Rosto' : 'Unhas'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {category.products.map((product, index) => (
                        <div key={index} className="flex space-x-3 p-3 border rounded-lg">
                          <div className="text-2xl">{product.image}</div>
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                              {product.brand} - {product.shade}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-pink-600">{product.price}</span>
                              <Button size="sm" variant="outline">
                                Ver Produto
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Cabelo */}
            <TabsContent value="hair">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="text-2xl">{beautyMatch.hairstyle.image}</div>
                    <span>{beautyMatch.hairstyle.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    {beautyMatch.hairstyle.description}
                  </p>
                  
                  <div className="flex space-x-4">
                    <Badge className={getDifficultyColor(beautyMatch.hairstyle.difficulty)}>
                      {beautyMatch.hairstyle.difficulty === 'easy' ? 'Fácil' :
                       beautyMatch.hairstyle.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                    </Badge>
                    <Badge variant="secondary">
                      ⏱️ {beautyMatch.hairstyle.timeNeeded}
                    </Badge>
                  </div>

                  <div className="flex space-x-3">
                    <Button className="flex-1" variant="outline">
                      Ver Tutorial
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
                      Salvar Penteado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Unhas */}
            <TabsContent value="nails">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-pink-500" />
                    <span>Unhas Perfeitas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Cor Recomendada:</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-gray-200"></div>
                        <span>{beautyMatch.nails.color}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Design:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {beautyMatch.nails.design}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400">
                    {beautyMatch.nails.description}
                  </p>

                  <div className="flex space-x-3">
                    <Button className="flex-1" variant="outline">
                      Ver Inspirações
                    </Button>
                    <Button className="flex-1 bg-pink-500 hover:bg-pink-600">
                      Agendar Manicure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Estado Vazio */}
      {!selectedOutfit && !isAnalyzing && (
        <div className="text-center py-12">
          <Palette className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            Escolha um look para começar
          </h3>
          <p className="text-gray-500">
            Selecione um outfit acima e receba sugestões de beleza personalizadas
          </p>
        </div>
      )}
    </div>
  );
};
