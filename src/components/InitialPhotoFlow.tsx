
import React, { useState } from 'react';
import { PhotoManager } from './PhotoManager';
import { ColorPaletteAnalyzer } from './ColorPaletteAnalyzer';
import { PaletteResults } from './PaletteResults';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Search } from 'lucide-react';

interface Photo {
  id: string;
  data: string;
  name: string;
}

interface InitialPhotoFlowProps {
  onComplete: (photos: Photo[], palette: any) => void;
}

export const InitialPhotoFlow = ({ onComplete }: InitialPhotoFlowProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [palette, setPalette] = useState(null);
  const [step, setStep] = useState<'photos' | 'palette' | 'complete'>('photos');

  const handlePhotosChange = (newPhotos: Photo[]) => {
    setPhotos(newPhotos);
  };

  const handleAnalyzePalette = (photoData: string) => {
    // Simular análise de paleta
    setTimeout(() => {
      const mockPalette = {
        season: "Primavera",
        undertone: "Quente",
        colors: {
          ideal: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
          avoid: ["#2C3E50", "#7F8C8D", "#8E44AD", "#2C2C54"],
          neutral: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#CED4DA"]
        },
        recommendations: [
          "Cores quentes e vibrantes realçam sua beleza natural",
          "Evite tons muito frios ou acinzentados",
          "Dourado combina melhor que prateado",
          "Tons terrosos e corais são ideais para você"
        ],
        makeup: {
          foundation: "Base com subtom dourado/amarelo",
          lipstick: "Tons coral, pêssego ou vermelho quente",
          eyeshadow: "Dourados, bronzes e tons terrosos"
        },
        confidence: 0.89
      };
      
      setPalette(mockPalette);
      setStep('palette');
    }, 2000);
  };

  const handlePaletteComplete = () => {
    setStep('complete');
  };

  const handleStartShopping = () => {
    onComplete(photos, palette);
  };

  if (step === 'photos') {
    return (
      <div className="space-y-6">
        <PhotoManager
          photos={photos}
          onPhotosChange={handlePhotosChange}
          onAnalyzePalette={handleAnalyzePalette}
        />
        
        {photos.length > 0 && !palette && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
            <CardContent className="p-4 text-center">
              <Palette className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Analisando sua paleta de cores...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (step === 'palette') {
    return (
      <div className="space-y-6">
        <PhotoManager
          photos={photos}
          onPhotosChange={handlePhotosChange}
          onAnalyzePalette={handleAnalyzePalette}
        />
        
        <PaletteResults palette={palette} />
        
        <div className="text-center">
          <Button 
            onClick={handlePaletteComplete}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Continuar para Busca de Roupas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {photos.map((photo, index) => (
          <Card key={photo.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[3/4]">
                <img 
                  src={photo.data} 
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {photo.name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardContent className="p-6 text-center">
          <div className="text-green-600 mb-4">
            ✅ Configuração Completa!
          </div>
          <h3 className="text-lg font-semibold mb-2">Tudo pronto para começar</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Suas fotos estão prontas e sua paleta de cores foi analisada. 
            Agora vamos encontrar as roupas perfeitas para você!
          </p>
          <Button 
            onClick={handleStartShopping}
            className="bg-green-500 hover:bg-green-600"
            size="lg"
          >
            <Search className="h-5 w-5 mr-2" />
            Começar a Buscar Roupas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
