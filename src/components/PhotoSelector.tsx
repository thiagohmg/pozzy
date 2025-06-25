
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Image, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSavedPhotos } from "@/hooks/useSavedPhotos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Photo {
  id: string;
  data: string;
  name: string;
}

interface PhotoSelectorProps {
  selectedPhotos: Photo[];
  onPhotosSelected: (photos: Photo[]) => void;
  maxPhotos?: number;
}

export const PhotoSelector = ({ 
  selectedPhotos, 
  onPhotosSelected, 
  maxPhotos = 3 
}: PhotoSelectorProps) => {
  const [selectedSavedPhotos, setSelectedSavedPhotos] = useState<Set<string>>(new Set());
  const { savedPhotos, isLoading } = useSavedPhotos();
  const { toast } = useToast();

  const handleSavedPhotoToggle = (photo: Photo) => {
    const newSelected = new Set(selectedSavedPhotos);
    
    if (newSelected.has(photo.id)) {
      newSelected.delete(photo.id);
    } else {
      if (newSelected.size >= maxPhotos) {
        toast({
          title: "Limite atingido",
          description: `Você pode selecionar no máximo ${maxPhotos} fotos`,
          variant: "destructive"
        });
        return;
      }
      newSelected.add(photo.id);
    }
    
    setSelectedSavedPhotos(newSelected);
  };

  const handleUseSavedPhotos = () => {
    const selectedPhotoObjects = savedPhotos.filter(photo => 
      selectedSavedPhotos.has(photo.id)
    );
    
    onPhotosSelected(selectedPhotoObjects);
    
    toast({
      title: "Fotos selecionadas!",
      description: `${selectedPhotoObjects.length} foto(s) adicionada(s)`
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + selectedPhotos.length > maxPhotos) {
      toast({
        title: "Limite excedido",
        description: `Você pode ter no máximo ${maxPhotos} fotos`,
        variant: "destructive"
      });
      return;
    }

    const newPhotos: Photo[] = [];
    let processed = 0;

    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Arquivo inválido",
          description: `${file.name} não é uma imagem`,
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        newPhotos.push({
          id: `upload-${Date.now()}-${index}`,
          data: imageData,
          name: file.name
        });
        
        processed++;
        if (processed === files.length) {
          onPhotosSelected([...selectedPhotos, ...newPhotos]);
          toast({
            title: "Upload concluído!",
            description: `${newPhotos.length} foto(s) adicionada(s)`
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando fotos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Escolha suas fotos</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Selecione até {maxPhotos} fotos para começar
          </p>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Salvas</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Câmera</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {savedPhotos.map((photo) => {
                  const isSelected = selectedSavedPhotos.has(photo.id);
                  return (
                    <div
                      key={photo.id}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected 
                          ? 'border-purple-500 shadow-lg' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => handleSavedPhotoToggle(photo)}
                    >
                      <div className="aspect-[3/4]">
                        <img 
                          src={photo.data} 
                          alt={photo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {isSelected && (
                        <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                          <div className="bg-purple-500 text-white rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute bottom-1 left-1 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {photo.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedSavedPhotos.size > 0 && (
                <Button 
                  onClick={handleUseSavedPhotos}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  Usar {selectedSavedPhotos.size} foto(s) selecionada(s)
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <div className="text-center">
              <Button asChild className="w-full mb-4">
                <label className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar arquivos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
              <p className="text-sm text-gray-500">
                Selecione até {maxPhotos - selectedPhotos.length} imagens do seu dispositivo
              </p>
            </div>
          </TabsContent>

          <TabsContent value="camera" className="mt-6">
            <div className="text-center">
              <Button className="w-full mb-4" disabled>
                <Camera className="h-4 w-4 mr-2" />
                Tirar foto (em breve)
              </Button>
              <p className="text-sm text-gray-500">
                Funcionalidade da câmera será ativada em breve
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
