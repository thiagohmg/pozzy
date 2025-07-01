import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Sparkles, 
  Palette, 
  Heart, 
  Camera, 
  Loader2,
  Eye,
  Circle,
  Brush,
  Scissors,
  Star,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { realAPIs } from '@/integrations/realAPIs';

interface BeautyProduct {
  id: string;
  name: string;
  brand: string;
  category: 'foundation' | 'concealer' | 'powder' | 'blush' | 'bronzer' | 'eyeshadow' | 'eyeliner' | 'mascara' | 'lipstick' | 'lipgloss' | 'highlighter';
  price: number;
  image_url: string;
  url: string;
  colors: string[];
  finish: string;
  coverage: 'light' | 'medium' | 'full';
  skinType: string[];
}

interface Hairstyle {
  id: string;
  name: string;
  description: string;
  image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: number;
  hairType: string[];
  occasion: string[];
  tutorial_url?: string;
}

interface BeautyAnalysis {
  skinTone: string;
  undertone: string;
  skinType: string;
  eyeColor: string;
  hairColor: string;
  faceShape: string;
  recommendations: {
    foundation: BeautyProduct[];
    lipstick: BeautyProduct[];
    eyeshadow: BeautyProduct[];
    blush: BeautyProduct[];
  };
  hairstyles: Hairstyle[];
  confidence: number;
}

interface Outfit {
  id: string;
  name: string;
  colors: string[];
  style: string;
  occasion: string;
  image_url: string;
}

export const RealBeautyIntegration: React.FC = () => {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [beautyAnalysis, setBeautyAnalysis] = useState<BeautyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userImage, setUserImage] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<BeautyProduct[]>([]);
  const [selectedHairstyle, setSelectedHairstyle] = useState<Hairstyle | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const { toast } = useToast();

  // Outfits de exemplo
  const demoOutfits: Outfit[] = [
    {
      id: '1',
      name: 'Look Romântico Rosa',
      colors: ['rosa', 'nude', 'dourado'],
      style: 'romantic',
      occasion: 'encontro',
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
    },
    {
      id: '2',
      name: 'Look Profissional',
      colors: ['preto', 'branco', 'bege'],
      style: 'classic',
      occasion: 'trabalho',
      image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400'
    },
    {
      id: '3',
      name: 'Look Festa Glamour',
      colors: ['preto', 'dourado', 'vermelho'],
      style: 'glamorous',
      occasion: 'festa',
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
    }
  ];

  const analyzeBeautyMatch = async (outfit: Outfit) => {
    if (!userImage) {
      toast({
        title: "Foto necessária",
        description: "Faça upload de uma foto para análise",
        variant: "destructive"
      });
      return;
    }

    setSelectedOutfit(outfit);
    setIsAnalyzing(true);

    try {
      // Análise real com IA
      const analysis = await realAPIs.analyzePalette(userImage);
      
      // Buscar produtos de beleza baseados na análise
      const beautyProducts = await searchBeautyProducts(analysis, outfit);
      
      // Buscar penteados compatíveis
      const hairstyles = await searchHairstyles(analysis, outfit);

      const beautyAnalysisResult: BeautyAnalysis = {
        skinTone: analysis.skinTone || 'medium',
        undertone: analysis.undertone || 'warm',
        skinType: analysis.skinType || 'normal',
        eyeColor: analysis.eyeColor || 'brown',
        hairColor: analysis.hairColor || 'brown',
        faceShape: analysis.faceShape || 'oval',
        recommendations: beautyProducts,
        hairstyles: hairstyles,
        confidence: analysis.confidence || 0.85
      };

      setBeautyAnalysis(beautyAnalysisResult);

      toast({
        title: "Análise completa! ✨",
        description: `Encontramos ${beautyProducts.foundation.length + beautyProducts.lipstick.length} produtos e ${hairstyles.length} penteados perfeitos`
      });

    } catch (error) {
      console.error('Erro na análise de beleza:', error);
      toast({
        title: "Erro na análise",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const searchBeautyProducts = async (analysis: any, outfit: Outfit): Promise<BeautyAnalysis['recommendations']> => {
    try {
      // Buscar produtos reais baseados na análise
      const categories = ['foundation', 'lipstick', 'eyeshadow', 'blush'];
      const recommendations: BeautyAnalysis['recommendations'] = {
        foundation: [],
        lipstick: [],
        eyeshadow: [],
        blush: []
      };

      for (const category of categories) {
        const products = await realAPIs.searchAllSources(`${category} makeup`, {
          colors: outfit.colors,
          skinType: analysis.skinType,
          undertone: analysis.undertone
        });

        const beautyProducts: BeautyProduct[] = products.slice(0, 3).map(product => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: category as BeautyProduct['category'],
          price: product.price,
          image_url: product.image_url,
          url: product.url,
          colors: product.color ? [product.color] : outfit.colors,
          finish: 'natural',
          coverage: 'medium',
          skinType: [analysis.skinType]
        }));

        recommendations[category as keyof typeof recommendations] = beautyProducts;
      }

      return recommendations;
    } catch (error) {
      console.error('Erro ao buscar produtos de beleza:', error);
      return {
        foundation: [],
        lipstick: [],
        eyeshadow: [],
        blush: []
      };
    }
  };

  const searchHairstyles = async (analysis: any, outfit: Outfit): Promise<Hairstyle[]> => {
    try {
      // Buscar penteados baseados no estilo e ocasião
      const hairstyles: Hairstyle[] = [
        {
          id: '1',
          name: 'Ondas Suaves',
          description: 'Ondas naturais e românticas',
          image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
          difficulty: 'medium',
          timeRequired: 20,
          hairType: ['all'],
          occasion: ['encontro', 'casual'],
          tutorial_url: 'https://example.com/tutorial1'
        },
        {
          id: '2',
          name: 'Coque Elegante',
          description: 'Coque baixo e sofisticado',
          image_url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400',
          difficulty: 'hard',
          timeRequired: 30,
          hairType: ['medium', 'long'],
          occasion: ['trabalho', 'formal'],
          tutorial_url: 'https://example.com/tutorial2'
        },
        {
          id: '3',
          name: 'Trança Lateral',
          description: 'Trança lateral descontraída',
          image_url: 'https://images.unsplash.com/photo-1552642084-9a408bbf8826?w=400',
          difficulty: 'easy',
          timeRequired: 15,
          hairType: ['medium', 'long'],
          occasion: ['casual', 'encontro'],
          tutorial_url: 'https://example.com/tutorial3'
        }
      ];

      return hairstyles.filter(style => 
        style.occasion.includes(outfit.occasion) || 
        style.occasion.includes('casual')
      );
    } catch (error) {
      console.error('Erro ao buscar penteados:', error);
      return [];
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);
    };
    reader.readAsDataURL(file);
  };

  const addProductToCart = (product: BeautyProduct) => {
    setSelectedProducts(prev => [...prev, product]);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho`
    });
  };

  const removeProductFromCart = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((sum, product) => sum + product.price, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Beauty Integration Real ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          IA analisa seu look e sugere maquiagem e penteado perfeitos
        </p>
      </div>

      {/* Upload de Foto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Sua Foto
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!userImage ? (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">
                Faça upload de uma foto para análise personalizada
              </p>
              <Button asChild>
                <label>
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <img
                src={userImage}
                alt="Sua foto"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium">Foto carregada</p>
                <p className="text-sm text-gray-500">Pronta para análise</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setUserImage('')}
              >
                Trocar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Seleção de Outfit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Escolha seu Look
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {demoOutfits.map(outfit => (
              <Card
                key={outfit.id}
                className={`cursor-pointer transition-all ${
                  selectedOutfit?.id === outfit.id ? 'ring-2 ring-pink-500' : 'hover:shadow-md'
                }`}
                onClick={() => analyzeBeautyMatch(outfit)}
              >
                <CardContent className="p-4 text-center">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={outfit.image_url}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium mb-2">{outfit.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {outfit.occasion}
                  </p>
                  <div className="flex justify-center space-x-1">
                    {outfit.colors.map((color) => (
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
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-pink-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Analisando seu look...</h3>
            <p className="text-gray-500">
              IA está analisando cores, estilo e criando recomendações personalizadas
            </p>
          </CardContent>
        </Card>
      )}

      {/* Resultados da Análise */}
      {beautyAnalysis && selectedOutfit && (
        <div className="space-y-6">
          {/* Resumo da Análise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Análise Personalizada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Tom de Pele</p>
                  <p className="font-medium">{beautyAnalysis.skinTone}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Subtom</p>
                  <p className="font-medium">{beautyAnalysis.undertone}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Tipo de Pele</p>
                  <p className="font-medium">{beautyAnalysis.skinType}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Confiança</p>
                  <p className="font-medium text-green-600">
                    {(beautyAnalysis.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Produtos Recomendados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Circle className="h-5 w-5 mr-2" />
                Maquiagem Recomendada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(beautyAnalysis.recommendations).map(([category, products]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3 capitalize">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {products.map(product => (
                        <Card key={product.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h5 className="font-medium text-sm mb-1">{product.name}</h5>
                            <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-green-600">
                                R$ {product.price.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => addProductToCart(product)}
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Penteados Recomendados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="h-5 w-5 mr-2" />
                Penteados Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {beautyAnalysis.hairstyles.map(hairstyle => (
                  <Card
                    key={hairstyle.id}
                    className={`cursor-pointer transition-all ${
                      selectedHairstyle?.id === hairstyle.id ? 'ring-2 ring-pink-500' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedHairstyle(hairstyle)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img
                          src={hairstyle.image_url}
                          alt={hairstyle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h5 className="font-medium mb-1">{hairstyle.name}</h5>
                      <p className="text-xs text-gray-500 mb-2">{hairstyle.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {hairstyle.timeRequired}min
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {hairstyle.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tutorial do Penteado */}
          {selectedHairstyle && (
            <Card>
              <CardHeader>
                <CardTitle>Como Fazer: {selectedHairstyle.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedHairstyle.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Tempo:</p>
                      <p>{selectedHairstyle.timeRequired} minutos</p>
                    </div>
                    <div>
                      <p className="font-medium">Dificuldade:</p>
                      <p className="capitalize">{selectedHairstyle.difficulty}</p>
                    </div>
                  </div>
                  {selectedHairstyle.tutorial_url && (
                    <Button
                      onClick={() => setShowTutorial(true)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Tutorial Completo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Carrinho de Produtos */}
          {selectedProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Produtos Selecionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold">R$ {product.price.toFixed(2)}</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeProductFromCart(product.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-lg text-green-600">
                        R$ {getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <Button className="w-full mt-3 bg-pink-500 hover:bg-pink-600">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Comprar Produtos Selecionados
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}; 