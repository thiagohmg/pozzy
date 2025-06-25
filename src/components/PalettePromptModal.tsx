import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, Camera, Image, Search } from 'lucide-react';

interface PalettePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscoverPalette: () => void;
  featureType: 'try-on' | 'image-search' | 'recommendations' | 'general';
}

const featureConfigs = {
  'try-on': {
    title: "🎨 Descubra sua paleta primeiro!",
    description: "Para experimentar roupas virtualmente e ver como ficam em você, precisamos conhecer suas cores ideais.",
    icon: Camera,
    benefits: [
      "Experimente roupas virtualmente",
      "Veja como as cores combinam com você",
      "Receba recomendações personalizadas"
    ]
  },
  'image-search': {
    title: "🎨 Descubra sua paleta primeiro!",
    description: "Para receber recomendações personalizadas baseadas na sua foto, precisamos conhecer suas cores ideais.",
    icon: Image,
    benefits: [
      "Recomendações baseadas na sua foto",
      "Filtros automáticos por suas cores",
      "Resultados mais precisos"
    ]
  },
  'recommendations': {
    title: "🎨 Descubra sua paleta primeiro!",
    description: "Para receber recomendações personalizadas que realmente combinam com você, precisamos conhecer suas cores ideais.",
    icon: Sparkles,
    benefits: [
      "Recomendações personalizadas",
      "Produtos que combinam com você",
      "Experiência mais relevante"
    ]
  },
  'general': {
    title: "🎨 Descubra sua paleta primeiro!",
    description: "Para uma experiência completa e personalizada no Pozzy, descubra suas cores ideais.",
    icon: Palette,
    benefits: [
      "Experiência personalizada",
      "Recomendações precisas",
      "Try-on virtual das roupas"
    ]
  }
};

export const PalettePromptModal = ({ 
  open, 
  onOpenChange, 
  onDiscoverPalette, 
  featureType 
}: PalettePromptModalProps) => {
  const config = featureConfigs[featureType];
  const Icon = config.icon;

  const handleDiscoverPalette = () => {
    onDiscoverPalette();
    onOpenChange(false);
  };

  const handleContinueWithout = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-center">
            <Icon className="h-5 w-5 text-purple-600" />
            <span>{config.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Descrição */}
          <p className="text-gray-600 text-center">
            {config.description}
          </p>

          {/* Benefícios */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Benefícios da sua paleta:
            </h4>
            <ul className="space-y-2">
              {config.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-purple-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Dica */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Search className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 font-medium">💡 Dica</p>
                <p className="text-xs text-blue-600">
                  A análise de paleta leva apenas 2 minutos e usa uma foto sua com boa iluminação natural.
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col space-y-2 pt-2">
            <Button
              onClick={handleDiscoverPalette}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Palette className="h-4 w-4 mr-2" />
              Descobrir Minha Paleta
            </Button>
            
            <Button
              variant="outline"
              onClick={handleContinueWithout}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Continuar sem paleta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 