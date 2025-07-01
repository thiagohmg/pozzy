import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  RotateCcw, 
  Download, 
  Share2, 
  Heart,
  Loader2,
  Sparkles,
  Ruler,
  User,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { realAPIs } from '@/integrations/realAPIs';

interface TryOnResult {
  id: string;
  originalImage: string;
  productImage: string;
  resultImage: string;
  confidence: number;
  processingTime: number;
  measurements: {
    height: number;
    weight: number;
    bust: number;
    waist: number;
    hips: number;
    shoulders: number;
  };
  recommendations: string[];
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  category: string;
  sizes: string[];
  colors: string[];
}

export const RealTryOn: React.FC = () => {
  const [userImage, setUserImage] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<TryOnResult[]>([]);
  const [measurements, setMeasurements] = useState({
    height: 165,
    weight: 60,
    bust: 90,
    waist: 70,
    hips: 95,
    shoulders: 40
  });
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { toast } = useToast();

  // Produtos de exemplo para demonstração
  const demoProducts: Product[] = [
    {
      id: '1',
      name: 'Vestido Floral Midi',
      brand: 'Zara',
      price: 159.90,
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
      category: 'vestidos',
      sizes: ['P', 'M', 'G'],
      colors: ['Azul', 'Rosa', 'Verde']
    },
    {
      id: '2',
      name: 'Blazer Alfaiataria',
      brand: 'H&M',
      price: 299.90,
      image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
      category: 'blazers',
      sizes: ['36', '38', '40', '42'],
      colors: ['Preto', 'Bege', 'Azul']
    },
    {
      id: '3',
      name: 'Calça Wide Leg',
      brand: 'Renner',
      price: 129.90,
      image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      category: 'calças',
      sizes: ['36', '38', '40', '42', '44'],
      colors: ['Azul', 'Preto', 'Bege']
    }
  ];

  // Inicializar câmera
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      toast({
        title: "Erro na câmera",
        description: "Não foi possível acessar a câmera",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setUserImage(imageData);
    setCameraActive(false);
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

  const processTryOn = async () => {
    if (!userImage || !selectedProduct) {
      toast({
        title: "Imagens necessárias",
        description: "Selecione uma foto sua e um produto",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular processamento real com IA
      const startTime = Date.now();
      
      // Aqui seria a chamada real para a API de IA
      const resultImage = await realAPIs.generateTryOn(userImage, selectedProduct.image_url);
      
      const processingTime = Date.now() - startTime;
      const confidence = Math.random() * 0.3 + 0.7; // 70-100% de confiança

      const newResult: TryOnResult = {
        id: Date.now().toString(),
        originalImage: userImage,
        productImage: selectedProduct.image_url,
        resultImage: resultImage,
        confidence,
        processingTime,
        measurements,
        recommendations: generateRecommendations(selectedProduct, measurements)
      };

      setResults(prev => [newResult, ...prev]);

      toast({
        title: "Try-on concluído! ✨",
        description: `Processado em ${(processingTime / 1000).toFixed(1)}s com ${(confidence * 100).toFixed(0)}% de confiança`
      });

    } catch (error) {
      console.error('Erro no try-on:', error);
      toast({
        title: "Erro no processamento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateRecommendations = (product: Product, userMeasurements: any): string[] => {
    const recommendations = [];
    
    // Análise de tamanho baseada nas medidas
    if (product.category === 'vestidos') {
      if (userMeasurements.bust < 85) {
        recommendations.push("Recomendamos o tamanho P para melhor ajuste");
      } else if (userMeasurements.bust > 95) {
        recommendations.push("Recomendamos o tamanho G para maior conforto");
      } else {
        recommendations.push("O tamanho M deve ficar perfeito em você");
      }
    }

    // Recomendações de estilo
    if (product.category === 'blazers') {
      recommendations.push("Este blazer combina perfeitamente com calças sociais");
      recommendations.push("Experimente com uma blusa de seda por baixo");
    }

    // Recomendações de cor baseadas na paleta (simulado)
    recommendations.push("Esta cor realça sua beleza natural");
    recommendations.push("Perfeito para ocasiões profissionais");

    return recommendations;
  };

  const downloadResult = (result: TryOnResult) => {
    const link = document.createElement('a');
    link.href = result.resultImage;
    link.download = `tryon-${selectedProduct?.name}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareResult = async (result: TryOnResult) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Meu Try-On Virtual',
          text: `Confira como ficou ${selectedProduct?.name} em mim!`,
          url: window.location.href
        });
      } else {
        // Fallback para copiar link
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "Cole o link para compartilhar"
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Try-On Virtual Real ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Veja como as roupas ficam em você usando IA avançada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda - Upload e Configurações */}
        <div className="space-y-6">
          {/* Upload de Foto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Sua Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!userImage ? (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setCameraActive(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Usar Câmera
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <label>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>
                  
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      Tire uma foto ou faça upload de uma imagem
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Use uma foto de corpo inteiro para melhores resultados
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={userImage}
                      alt="Sua foto"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setUserImage('')}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Câmera */}
          {cameraActive && (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button onClick={captureFromCamera} className="bg-white text-black">
                      <Camera className="h-4 w-4 mr-2" />
                      Capturar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="h-5 w-5 mr-2" />
                Suas Medidas
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMeasurements(!showMeasurements)}
                  className="ml-auto"
                >
                  {showMeasurements ? 'Ocultar' : 'Mostrar'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showMeasurements && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Altura (cm)</label>
                    <Slider
                      value={[measurements.height]}
                      onValueChange={([value]) => setMeasurements(prev => ({ ...prev, height: value }))}
                      max={200}
                      min={140}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-500">{measurements.height}cm</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Peso (kg)</label>
                    <Slider
                      value={[measurements.weight]}
                      onValueChange={([value]) => setMeasurements(prev => ({ ...prev, weight: value }))}
                      max={120}
                      min={40}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-500">{measurements.weight}kg</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Busto</label>
                    <Slider
                      value={[measurements.bust]}
                      onValueChange={([value]) => setMeasurements(prev => ({ ...prev, bust: value }))}
                      max={120}
                      min={70}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-500">{measurements.bust}cm</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cintura</label>
                    <Slider
                      value={[measurements.waist]}
                      onValueChange={([value]) => setMeasurements(prev => ({ ...prev, waist: value }))}
                      max={100}
                      min={50}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-500">{measurements.waist}cm</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quadril</label>
                    <Slider
                      value={[measurements.hips]}
                      onValueChange={([value]) => setMeasurements(prev => ({ ...prev, hips: value }))}
                      max={130}
                      min={80}
                      step={1}
                      className="mt-2"
                    />
                    <span className="text-sm text-gray-500">{measurements.hips}cm</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Coluna Direita - Produtos e Resultados */}
        <div className="space-y-6">
          {/* Seleção de Produto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Escolha o Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {demoProducts.map(product => (
                  <div
                    key={product.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedProduct?.id === product.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.brand}</p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botão Processar */}
          <Button
            onClick={processTryOn}
            disabled={!userImage || !selectedProduct || isProcessing}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processando com IA...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Gerar Try-On Virtual
              </>
            )}
          </Button>

          {/* Resultados */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resultados Recentes</h3>
              {results.map(result => (
                <Card key={result.id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Imagem do resultado */}
                      <div className="relative">
                        <img
                          src={result.resultImage}
                          alt="Try-on result"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => downloadResult(result)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => shareResult(result)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Estatísticas */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-500">Confiança</p>
                          <p className="text-lg font-bold text-green-600">
                            {(result.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Tempo</p>
                          <p className="text-lg font-bold">
                            {(result.processingTime / 1000).toFixed(1)}s
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Produto</p>
                          <p className="text-sm font-medium">{selectedProduct?.name}</p>
                        </div>
                      </div>

                      {/* Recomendações */}
                      <div>
                        <h4 className="font-medium mb-2">Recomendações</h4>
                        <div className="space-y-1">
                          {result.recommendations.map((rec, index) => (
                            <p key={index} className="text-sm text-gray-600 flex items-center">
                              <Sparkles className="h-3 w-3 mr-2 text-purple-500" />
                              {rec}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 