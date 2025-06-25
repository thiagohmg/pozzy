import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Palette, Sparkles, Eye, Image, X, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSavedPalettes } from "@/hooks/useSavedPalettes";
import { useCamera } from "@/hooks/useCamera";
import { useSavedPhotos } from "@/hooks/useSavedPhotos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MobileColorPaletteAnalyzer } from "./mobile/MobileColorPaletteAnalyzer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ColorPaletteAnalyzerProps {
  onPaletteAnalyzed: (palette: any) => void;
}

export const ColorPaletteAnalyzer = ({ onPaletteAnalyzed }: ColorPaletteAnalyzerProps) => {
  // Call ALL hooks first, before any conditional logic
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { toast } = useToast();
  const { savePalette } = useSavedPalettes();
  const { savedPhotos, isLoading: photosLoading } = useSavedPhotos();
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

  // NOW we can do conditional rendering after all hooks are called
  if (isMobile) {
    return <MobileColorPaletteAnalyzer onPaletteAnalyzed={onPaletteAnalyzed} />;
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedImage(imageData);
      setShowOptions(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    const imageData = capturePhoto();
    if (imageData) {
      setSelectedImage(imageData);
      stopCamera();
      setShowOptions(false);
    }
  };

  const handleSavedPhotoSelect = (photoData: string) => {
    setSelectedImage(photoData);
    setShowOptions(false);
  };

  const analyzePalette = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    toast({
      title: "Analisando sua paleta...",
      description: "Nossa IA está descobrindo as cores que mais combinam com você"
    });

    // Simular análise de paleta de cores com IA
    setTimeout(() => {
      const palette = {
        seasonType: "Inverno Profundo",
        description: "Você possui características marcantes que pedem cores intensas e contrastantes",
        dominantUndertone: "Frio",
        characteristics: [
          "Contraste alto entre cabelo, pele e olhos",
          "Tons frios na pele",
          "Olhos profundos e expressivos"
        ],
        bestColors: [
          { name: "Azul Royal", hex: "#1e3a8a", category: "Principal" },
          { name: "Preto Verdadeiro", hex: "#000000", category: "Neutro" },
          { name: "Branco Puro", hex: "#ffffff", category: "Neutro" },
          { name: "Vermelho Cereja", hex: "#dc2626", category: "Destaque" },
          { name: "Rosa Pink", hex: "#ec4899", category: "Destaque" },
          { name: "Roxo Profundo", hex: "#7c3aed", category: "Principal" }
        ],
        avoidColors: [
          { name: "Laranja Queimado", hex: "#ea580c", reason: "Muito quente para seu tom" },
          { name: "Amarelo Mostarda", hex: "#ca8a04", reason: "Deixa a pele amarelada" },
          { name: "Verde Oliva", hex: "#65a30d", reason: "Tom muito terroso" }
        ],
        makeupTips: [
          "Base com subtom frio ou neutro",
          "Batons em tons de vermelho, rosa pink ou berry",
          "Sombras em azuis, roxos e cinzas"
        ],
        styleRecommendations: [
          "Prefira peças monocromáticas em suas cores ideais",
          "Combine preto e branco para looks sofisticados",
          "Use suas cores de destaque em acessórios"
        ],
        confidence: 0.89
      };

      // Salvar paleta automaticamente
      const savedPalette = savePalette(palette);

      onPaletteAnalyzed(palette);
      setIsAnalyzing(false);

      toast({
        title: "Análise concluída e salva! ✨",
        description: `Descobrimos que você é ${palette.seasonType}. Sua paleta foi salva automaticamente.`,
      });
    }, 3000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setShowOptions(false);
  };

  const startCameraFlow = () => {
    setShowOptions(false);
    startCamera();
  };

  const stopCameraFlow = () => {
    stopCamera();
    setShowOptions(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* TITLE AND ICON REMOVED TO PREVENT DUPLICATION */}
          {/* <div className="flex items-center space-x-2 mb-4">
            <Palette className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Descubra Sua Paleta de Cores</h3>
            <Eye className="h-4 w-4 text-pink-500" />
          </div> */}

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Envie uma foto sua com boa iluminação natural para descobrir as cores que mais valorizam sua beleza
          </p>

          {/* Câmera Ativa */}
          {isActive && (
            <div className="space-y-4 mb-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-gray-100 dark:bg-gray-800"
                  style={{ maxHeight: '300px' }}
                />
                <Button
                  onClick={stopCameraFlow}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="absolute bottom-2 left-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    isReady
                      ? 'bg-green-500 text-white'
                      : 'bg-yellow-500 text-black'
                  }`}>
                    {isReady ? '✅ Pronto' : '⏳ Carregando...'}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleCameraCapture}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={!isReady}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isReady ? 'Capturar Foto' : 'Aguarde...'}
                </Button>
                <Button onClick={stopCameraFlow} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Opções de Seleção - sempre visível quando não há imagem selecionada e câmera não está ativa */}
          {!selectedImage && !isActive && (
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </TabsTrigger>
                <TabsTrigger value="camera" className="flex items-center space-x-2">
                  <Camera className="h-4 w-4" />
                  <span>Câmera</span>
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center space-x-2">
                  <Image className="h-4 w-4" />
                  <span>Fotos Salvas</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-6">
                <div className="text-center">
                  <div className="border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-lg p-6">
                    <Upload className="mx-auto h-12 w-12 text-purple-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Selecione uma foto do seu dispositivo
                    </p>
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      asChild
                    >
                      <label className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Selecionar Arquivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="camera" className="mt-6">
                <div className="text-center">
                  <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-6">
                    <Camera className="mx-auto h-12 w-12 text-green-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Use a câmera do seu dispositivo
                    </p>
                    <Button
                      onClick={startCameraFlow}
                      className="bg-green-500 hover:bg-green-600"
                      disabled={isLoading}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {isLoading ? 'Ativando...' : 'Ativar Câmera'}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                {photosLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Carregando fotos...</p>
                  </div>
                ) : savedPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {savedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative cursor-pointer rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-all"
                        onClick={() => handleSavedPhotoSelect(photo.data)}
                      >
                        <div className="aspect-[3/4]">
                          <img
                            src={photo.data}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                          {photo.name}
                        </div>
                        <div className="absolute inset-0 bg-purple-500/10 hover:bg-purple-500/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="bg-purple-500 text-white rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhuma foto salva encontrada
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Tire algumas fotos primeiro para usar esta opção
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Imagem Selecionada */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Foto para análise"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-white dark:bg-gray-800"
                >
                  ✕
                </Button>
              </div>
              <Button
                onClick={analyzePalette}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analisando Paleta...
                  </>
                ) : (
                  <>
                    <Palette className="h-4 w-4 mr-2" />
                    Descobrir Minha Paleta ✨
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dicas para Melhor Resultado */}
      <div className="p-4 mt-2 rounded-lg bg-blue-50 border border-blue-200">
        <h4 className="font-semibold text-sm text-blue-800 mb-2">💡 Dicas para melhor resultado:</h4>
        <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
          <li>Use luz natural (próximo à janela)</li>
          <li>Evite maquiagem pesada</li>
          <li>Prefira fundo neutro</li>
          <li>Olhe diretamente para a câmera</li>
        </ul>
      </div>
    </div>
  );
};
