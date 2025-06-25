
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X, Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/useCamera";
import { CameraControls } from "@/components/CameraControls";

interface VirtualTryOnProps {
  onTryOnResult: (result: any) => void;
}

export const VirtualTryOn = ({ onTryOnResult }: VirtualTryOnProps) => {
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

  const handleCapture = () => {
    const imageData = capturePhoto();
    if (!imageData) return;

    toast({
      title: "Processando...",
      description: "Aplicando a roupa virtualmente"
    });

    setTimeout(() => {
      onTryOnResult({
        originalImage: imageData,
        tryOnResult: imageData,
        confidence: 0.92,
        recommendations: [
          "Esta peça realça muito bem seu tom de pele",
          "O corte fica perfeito para seu tipo físico",
          "Recomendo combinar com acessórios dourados"
        ]
      });
      
      toast({
        title: "Try-on concluído! ✨",
        description: "Veja como a peça fica em você"
      });
    }, 2000);
  };

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
      
      toast({
        title: "Processando imagem...",
        description: "Aplicando a roupa virtualmente"
      });

      setTimeout(() => {
        onTryOnResult({
          originalImage: imageData,
          tryOnResult: imageData,
          confidence: 0.88,
          recommendations: [
            "Ótima qualidade de imagem para análise",
            "A peça combina bem com seu estilo",
            "Considere testar outras cores desta mesma peça"
          ]
        });
        
        toast({
          title: "Try-on concluído! ✨",
          description: "Veja o resultado da experimentação virtual"
        });
      }, 2000);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Camera className="h-5 w-5 text-purple-500" />
          <h3 className="font-medium">Virtual Try-On</h3>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>

        {isActive ? (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-800"
                style={{ maxHeight: '400px' }}
              />
              <Button
                onClick={stopCamera}
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
            
            <CameraControls
              isActive={isActive}
              isLoading={isLoading}
              isReady={isReady}
              error={error}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onCapture={handleCapture}
              onFileUpload={handleFileUpload}
            />
          </div>
        ) : (
          <CameraControls
            isActive={isActive}
            isLoading={isLoading}
            isReady={isReady}
            error={error}
            onStartCamera={startCamera}
            onStopCamera={stopCamera}
            onCapture={handleCapture}
            onFileUpload={handleFileUpload}
          />
        )}
      </CardContent>
    </Card>
  );
};
