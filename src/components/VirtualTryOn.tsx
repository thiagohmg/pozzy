import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Upload, 
  X, 
  RefreshCw, 
  Sparkles, 
  Ruler, 
  User, 
  Shirt, 
  Watch,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Download
} from 'lucide-react';
import { useCamera } from "@/hooks/useCamera";
import { useToast } from "@/hooks/use-toast";

interface VirtualTryOnProps {
  product: any;
  onClose: () => void;
  userMeasurements?: UserMeasurements;
}

interface UserMeasurements {
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  shoulders: number;
  armLength: number;
  legLength: number;
  footSize: number;
  shoeSize: number;
}

interface TryOnResult {
  image: string;
  confidence: number;
  fit: 'perfect' | 'good' | 'tight' | 'loose';
  recommendations: string[];
}

export const VirtualTryOn: React.FC<VirtualTryOnProps> = ({
  product,
  onClose,
  userMeasurements
}) => {
  const [currentView, setCurrentView] = useState<'setup' | 'tryon' | 'results'>('setup');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [measurements, setMeasurements] = useState<UserMeasurements>({
    height: 165,
    weight: 60,
    bust: 90,
    waist: 70,
    hips: 95,
    shoulders: 40,
    armLength: 60,
    legLength: 80,
    footSize: 24,
    shoeSize: 36
  });
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const { toast } = useToast();
  const {
    isActive,
    isLoading,
    isReady,
    error,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto
  } = useCamera();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  // Inicializar medições do usuário se fornecidas
  useEffect(() => {
    if (userMeasurements) {
      setMeasurements(userMeasurements);
    }
  }, [userMeasurements]);

  // Função para capturar foto do usuário
  const handleCapturePhoto = () => {
    const imageData = capturePhoto();
    if (imageData) {
      setUserPhoto(imageData);
      stopCamera();
      setCurrentView('tryon');
    }
  };

  // Função para upload de foto
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUserPhoto(imageData);
      setCurrentView('tryon');
    };
    reader.readAsDataURL(file);
  };

  // Função para simular try-on virtual
  const performVirtualTryOn = async () => {
    if (!userPhoto) return;

    setIsProcessing(true);
    
    try {
      // Simular processamento de IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Gerar resultado simulado
      const result: TryOnResult = {
        image: await generateTryOnImage(userPhoto, product),
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        fit: getRandomFit(),
        recommendations: generateRecommendations(product, measurements)
      };
      
      setTryOnResult(result);
      setCurrentView('results');
      
      toast({
        title: "Try-on concluído! ✨",
        description: "Veja como ficou o produto em você"
      });
    } catch (error) {
      toast({
        title: "Erro no try-on",
        description: "Não foi possível processar a imagem",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Gerar imagem de try-on (simulado)
  const generateTryOnImage = async (userPhoto: string, product: any): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(userPhoto);
        return;
      }

      // Carregar foto do usuário
      const userImg = new Image();
      userImg.onload = () => {
        canvas.width = userImg.width;
        canvas.height = userImg.height;
        
        // Desenhar foto do usuário
        ctx.drawImage(userImg, 0, 0);
        
        // Carregar e sobrepor produto
        const productImg = new Image();
        productImg.onload = () => {
          // Calcular posição baseada no tipo de produto
          const position = calculateProductPosition(product.category, userImg.width, userImg.height);
          
          // Aplicar efeitos de transparência e blend
          ctx.globalAlpha = 0.8;
          ctx.drawImage(productImg, position.x, position.y, position.width, position.height);
          
          // Adicionar efeitos de iluminação
          addLightingEffects(ctx, canvas.width, canvas.height);
          
          resolve(canvas.toDataURL());
        };
        productImg.src = product.image_url || product.image;
      };
      userImg.src = userPhoto;
    });
  };

  // Calcular posição do produto na imagem
  const calculateProductPosition = (category: string, imgWidth: number, imgHeight: number) => {
    switch (category?.toLowerCase()) {
      case 'vestidos':
        return { x: imgWidth * 0.1, y: imgHeight * 0.2, width: imgWidth * 0.8, height: imgHeight * 0.6 };
      case 'blusas':
        return { x: imgWidth * 0.2, y: imgHeight * 0.3, width: imgWidth * 0.6, height: imgHeight * 0.4 };
      case 'calças':
        return { x: imgWidth * 0.2, y: imgHeight * 0.5, width: imgWidth * 0.6, height: imgHeight * 0.4 };
      case 'sapatos':
        return { x: imgWidth * 0.3, y: imgHeight * 0.7, width: imgWidth * 0.4, height: imgHeight * 0.2 };
      default:
        return { x: imgWidth * 0.2, y: imgHeight * 0.3, width: imgWidth * 0.6, height: imgHeight * 0.4 };
    }
  };

  // Adicionar efeitos de iluminação
  const addLightingEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Gradiente de iluminação
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  };

  // Gerar fit aleatório
  const getRandomFit = (): 'perfect' | 'good' | 'tight' | 'loose' => {
    const fits = ['perfect', 'good', 'tight', 'loose'] as const;
    return fits[Math.floor(Math.random() * fits.length)];
  };

  // Gerar recomendações
  const generateRecommendations = (product: any, measurements: UserMeasurements): string[] => {
    const recommendations = [];
    
    if (product.category?.toLowerCase().includes('vestido')) {
      if (measurements.bust > 95) {
        recommendations.push('Recomendamos um tamanho maior para melhor conforto');
      }
      if (measurements.height < 160) {
        recommendations.push('Este vestido pode ficar longo, considere ajustar o comprimento');
      }
    }
    
    if (product.category?.toLowerCase().includes('calça')) {
      if (measurements.waist > 80) {
        recommendations.push('Sugerimos um tamanho maior para a cintura');
      }
    }
    
    if (product.category?.toLowerCase().includes('sapato')) {
      if (measurements.shoeSize !== 36) {
        recommendations.push(`Este sapato está disponível no tamanho ${measurements.shoeSize}`);
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Este produto parece ser um bom ajuste para suas medidas!');
    }
    
    return recommendations;
  };

  // Salvar resultado
  const saveResult = () => {
    if (!resultCanvasRef.current || !tryOnResult) return;
    
    const link = document.createElement('a');
    link.download = `tryon-${product.name}.png`;
    link.href = resultCanvasRef.current.toDataURL();
    link.click();
  };

  // Renderizar setup inicial
  if (currentView === 'setup') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shirt className="h-5 w-5" />
              Try-On Virtual: {product.name}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="photo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo">Tirar Foto</TabsTrigger>
              <TabsTrigger value="measurements">Minhas Medidas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="photo" className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Capture sua foto</h3>
                <p className="text-gray-600 mb-4">
                  Tire uma foto ou faça upload para experimentar o produto virtualmente
                </p>
              </div>
              
              {!isActive ? (
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <Button onClick={startCamera} disabled={isLoading}>
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 mr-2" />
                      )}
                      Ativar Câmera
                    </Button>
                    
                    <Button variant="outline" asChild>
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="border-2 border-white rounded-lg p-2">
                        <div className="w-32 h-48 border-2 border-dashed border-white"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <Button onClick={handleCapturePhoto} disabled={!isReady}>
                      <Camera className="h-4 w-4 mr-2" />
                      Capturar Foto
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="measurements" className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Suas Medidas</h3>
                <p className="text-gray-600 mb-4">
                  Configure suas medidas para resultados mais precisos
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={measurements.height}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, height: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={measurements.weight}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bust">Busto (cm)</Label>
                  <Input
                    id="bust"
                    type="number"
                    value={measurements.bust}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, bust: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="waist">Cintura (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    value={measurements.waist}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, waist: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hips">Quadril (cm)</Label>
                  <Input
                    id="hips"
                    type="number"
                    value={measurements.hips}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, hips: Number(e.target.value) }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="shoeSize">Tamanho do Sapato</Label>
                  <Input
                    id="shoeSize"
                    type="number"
                    value={measurements.shoeSize}
                    onChange={(e) => setMeasurements(prev => ({ ...prev, shoeSize: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  // Renderizar tela de try-on
  if (currentView === 'tryon') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Processando Try-On</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="mb-4">
              {userPhoto && (
                <img
                  src={userPhoto}
                  alt="Sua foto"
                  className="w-32 h-32 mx-auto rounded-lg object-cover"
                />
              )}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Aplicando produto...</h3>
            <p className="text-gray-600 mb-4">
              Nossa IA está processando a imagem para mostrar como o produto ficará em você
            </p>
            
            <Button
              onClick={performVirtualTryOn}
              disabled={isProcessing}
              className="w-full max-w-xs"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Iniciar Try-On
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar resultados
  if (currentView === 'results' && tryOnResult) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resultado do Try-On</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={saveResult}>
                <Download className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imagem do resultado */}
            <div className="space-y-4">
              <h3 className="font-semibold">Como ficou em você:</h3>
              <div className="relative">
                <canvas
                  ref={resultCanvasRef}
                  className="w-full rounded-lg border"
                  style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                />
                
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRotation(rotation + 90)}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Informações do resultado */}
            <div className="space-y-4">
              <h3 className="font-semibold">Análise do Ajuste:</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Confiança da IA:</span>
                  <span className="font-semibold">{(tryOnResult.confidence * 100).toFixed(0)}%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Ajuste:</span>
                  <span className={`font-semibold ${
                    tryOnResult.fit === 'perfect' ? 'text-green-600' :
                    tryOnResult.fit === 'good' ? 'text-blue-600' :
                    tryOnResult.fit === 'tight' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {tryOnResult.fit === 'perfect' ? 'Perfeito' :
                     tryOnResult.fit === 'good' ? 'Bom' :
                     tryOnResult.fit === 'tight' ? 'Apertado' : 'Folgado'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Recomendações:</h4>
                <ul className="space-y-1">
                  {tryOnResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4">
                <Button className="w-full" onClick={() => setCurrentView('setup')}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Outro Produto
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
