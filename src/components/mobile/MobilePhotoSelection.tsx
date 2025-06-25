
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Image, Search } from 'lucide-react';

interface Photo {
  id: string;
  data: string;
  name: string;
}

interface MobilePhotoSelectionProps {
  savedPhotos: Photo[];
  isLoading: boolean;
  onPhotoSelect: (photoData: string) => void;
  onBack: () => void;
}

export const MobilePhotoSelection = ({
  savedPhotos,
  isLoading,
  onPhotoSelect,
  onBack
}: MobilePhotoSelectionProps) => {
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const handlePhotoTap = (photo: Photo) => {
    if (selectedPhotoId === photo.id) {
      // Se já está selecionada, confirma a seleção
      onPhotoSelect(photo.data);
    } else {
      // Seleciona a foto
      setSelectedPhotoId(photo.id);
    }
  };

  const handleConfirmSelection = () => {
    const selectedPhoto = savedPhotos.find(p => p.id === selectedPhotoId);
    if (selectedPhoto) {
      onPhotoSelect(selectedPhoto.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="flex items-center p-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Suas Fotos Salvas</h2>
            <p className="text-white/90 text-sm">
              {savedPhotos.length > 0 
                ? `${savedPhotos.length} foto(s) disponível(is)`
                : 'Nenhuma foto encontrada'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Carregando suas fotos...</p>
          </div>
        ) : savedPhotos.length > 0 ? (
          <div className="space-y-4">
            {/* Instrução */}
            <Card className="border-0 bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                      Toque em uma foto para selecioná-la
                    </p>
                    <p className="text-blue-600 dark:text-blue-400 text-xs">
                      Toque novamente para confirmar a escolha
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de fotos */}
            <div className="grid grid-cols-2 gap-3">
              {savedPhotos.map((photo) => {
                const isSelected = selectedPhotoId === photo.id;
                return (
                  <Card
                    key={photo.id}
                    className={`overflow-hidden cursor-pointer transform transition-all duration-300 ${
                      isSelected 
                        ? 'scale-105 ring-4 ring-purple-500 shadow-xl' 
                        : 'hover:scale-[1.02] shadow-lg'
                    }`}
                    onClick={() => handlePhotoTap(photo)}
                  >
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4]">
                        <img 
                          src={photo.data} 
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay de seleção */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-purple-500/30 flex items-center justify-center">
                            <div className="bg-purple-600 text-white rounded-full p-3 shadow-lg">
                              <Check className="h-6 w-6" />
                            </div>
                          </div>
                        )}
                        
                        {/* Nome da foto */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <p className="text-white text-xs font-medium truncate">
                            {photo.name}
                          </p>
                        </div>

                        {/* Indicador de toque duplo */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full px-2 py-1">
                            <p className="text-xs font-medium">Toque novamente</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Botão de confirmação flutuante */}
            {selectedPhotoId && (
              <div className="fixed bottom-6 left-4 right-4 z-50">
                <Button
                  onClick={handleConfirmSelection}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white shadow-xl font-semibold text-lg"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Usar Esta Foto ✨
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Card className="w-full max-w-sm">
              <CardContent className="p-8 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 w-fit">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Nenhuma foto salva
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Você ainda não possui fotos salvas no sistema
                </p>
                <Button onClick={onBack} variant="outline" className="w-full">
                  Voltar e Tirar Foto
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
