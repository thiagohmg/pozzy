import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Plus, Sparkles, Image } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCamera } from "@/hooks/useCamera";
import { PhotoSelector } from "./PhotoSelector";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface Photo {
  id: string;
  data: string;
  name: string;
}

interface PhotoManagerProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  onAnalyzePalette: (photoData: string) => void;
  selectedProductName?: string;
}

export const PhotoManager = ({ 
  photos, 
  onPhotosChange, 
  onAnalyzePalette,
  selectedProductName 
}: PhotoManagerProps) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
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
  const [pendingPhoto, setPendingPhoto] = useState<{ data: string; name: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const addPhoto = useCallback((photoData: string, name: string) => {
    if (photos.length >= 3) {
      toast({
        title: "Limite atingido",
        description: "Você pode ter no máximo 3 fotos",
        variant: "destructive"
      });
      return;
    }

    const newPhoto: Photo = {
      id: Date.now().toString(),
      data: photoData,
      name
    };

    const updatedPhotos = [...photos, newPhoto];
    onPhotosChange(updatedPhotos);

    // Analisar paleta automaticamente na primeira foto
    if (photos.length === 0) {
      onAnalyzePalette(photoData);
      toast({
        title: "Foto adicionada! ✨",
        description: "Analisando sua paleta de cores automaticamente..."
      });
    } else {
      toast({
        title: "Nova foto adicionada!",
        description: `Agora você tem ${updatedPhotos.length} foto(s)`
      });
    }
  }, [photos, onPhotosChange, onAnalyzePalette, toast]);

  const removePhoto = useCallback((photoId: string) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    onPhotosChange(updatedPhotos);
    toast({
      title: "Foto removida",
      description: "Foto excluída com sucesso"
    });
  }, [photos, onPhotosChange, toast]);

  // Função utilitária para checar se a imagem está clara
  function isImageBright(imageData: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = imageData;
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(false);
        ctx.drawImage(img, 0, 0);
        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let total = 0;
        for (let i = 0; i < imageDataObj.data.length; i += 4) {
          // Média dos canais RGB
          total += (imageDataObj.data[i] + imageDataObj.data[i + 1] + imageDataObj.data[i + 2]) / 3;
        }
        const avg = total / (imageDataObj.data.length / 4);
        resolve(avg > 80); // 0-255, 80 é um valor razoável para "claro"
      };
      img.onerror = function () {
        resolve(false);
      };
    });
  }

  // Função utilitária para checar proporção de corpo inteiro (altura > 1.3x largura)
  function isFullBodyProportion(imageData: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = imageData;
      img.onload = function () {
        resolve(img.height / img.width > 1.3);
      };
      img.onerror = function () {
        resolve(false);
      };
    });
  }

  // Validação antes de salvar a foto
  const confirmAndSavePhoto = useCallback(async () => {
    if (pendingPhoto) {
      // Validação automática
      const bright = await isImageBright(pendingPhoto.data);
      const fullBody = await isFullBodyProportion(pendingPhoto.data);
      if (!bright) {
        toast({
          title: "Foto muito escura",
          description: "Tire a foto em um ambiente bem iluminado.",
          variant: "destructive"
        });
        return;
      }
      if (!fullBody) {
        toast({
          title: "Foto não parece ser de corpo inteiro",
          description: "Certifique-se de que seu corpo inteiro, incluindo os pés, apareça na foto.",
          variant: "destructive"
        });
        return;
      }
      addPhoto(pendingPhoto.data, pendingPhoto.name);
      toast({
        title: "Sua foto foi salva em Minhas Fotos!",
        description: "Você pode visualizar e gerenciar suas fotos salvas.",
        variant: "default"
      });
      setPendingPhoto(null);
      setShowConfirm(false);
    }
  }, [pendingPhoto, addPhoto, toast]);

  const handleCapture = useCallback(() => {
    const imageData = capturePhoto();
    if (imageData) {
      setPendingPhoto({ data: imageData, name: `Foto ${photos.length + 1}` });
      setShowConfirm(true);
      stopCamera();
      setActivePhotoIndex(null);
    }
  }, [capturePhoto, photos.length, stopCamera]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
      setPendingPhoto({ data: imageData, name: file.name });
      setShowConfirm(true);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleStartCamera = useCallback(() => {
    setActivePhotoIndex(photos.length);
    startCamera();
  }, [photos.length, startCamera]);

  const handleStopCamera = useCallback(() => {
    stopCamera();
    setActivePhotoIndex(null);
  }, [stopCamera]);

  const handlePhotosFromSelector = (selectedPhotos: Photo[]) => {
    onPhotosChange(selectedPhotos);
    setShowPhotoSelector(false);
    
    // Analisar paleta da primeira foto se não houver fotos ainda
    if (photos.length === 0 && selectedPhotos.length > 0) {
      onAnalyzePalette(selectedPhotos[0].data);
      toast({
        title: "Fotos adicionadas! ✨",
        description: "Analisando sua paleta de cores automaticamente..."
      });
    }
  };

  // Nova etapa: instruções antes de permitir upload/câmera
  if (showInstructions) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold text-purple-700 text-center">Como tirar a foto perfeita?</h2>
        <ul className="text-gray-700 text-left list-disc pl-6 space-y-1">
          <li>Tire uma foto de <b>corpo inteiro</b>, de frente para a câmera.</li>
          <li>Certifique-se de que <b>os pés estejam visíveis</b> (de preferência descalços).</li>
          <li>Use um <b>fundo claro e neutro</b>.</li>
          <li>Evite sombras, filtros ou luz muito forte/escura.</li>
          <li>Vista roupas neutras para melhor análise de paleta.</li>
        </ul>
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">Exemplo de foto ideal:</span>
          <img src="/public/placeholder.svg" alt="Exemplo de foto ideal" className="rounded-lg border shadow w-48 h-72 object-cover bg-gray-100" />
        </div>
        <Button className="btn-primary mt-4" onClick={() => setShowInstructions(false)}>
          Entendi, quero tirar/enviar minha foto
        </Button>
      </div>
    );
  }

  // Se não tem fotos e não está mostrando seletor, mostrar opções iniciais
  if (photos.length === 0 && !showPhotoSelector && !isActive) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Comece com suas fotos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Escolha como você quer adicionar suas fotos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-purple-200 hover:border-purple-400 transition-colors cursor-pointer" 
                onClick={() => setShowPhotoSelector(true)}>
            <CardContent className="p-6 text-center">
              <Image className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="font-medium mb-2">Usar Fotos Salvas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Escolha entre 3 fotos já disponíveis
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:border-blue-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <label className="cursor-pointer block">
                <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-medium mb-2">Fazer Upload</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Envie fotos do seu dispositivo
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:border-green-400 transition-colors cursor-pointer"
                onClick={handleStartCamera}>
            <CardContent className="p-6 text-center">
              <Camera className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="font-medium mb-2">Tirar Foto</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use a câmera do seu dispositivo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mostrar seletor de fotos salvas
  if (showPhotoSelector) {
    return (
      <div className="space-y-6">
        <PhotoSelector 
          selectedPhotos={photos}
          onPhotosSelected={handlePhotosFromSelector}
        />
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowPhotoSelector(false)}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {photos.length === 0 ? 'Comece com sua foto' : 'Suas fotos'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {photos.length === 0 
            ? 'Envie uma foto sua para começar a consultoria personalizada'
            : `${photos.length}/3 fotos • ${selectedProductName ? `Testando: ${selectedProductName}` : 'Adicione roupas para experimentar'}`
          }
        </p>
      </div>

      {/* Câmera Ativa */}
      {isActive && (
        <Card className="border-purple-200">
          <CardContent className="p-4">
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
                onClick={handleStopCamera}
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
            
            <div className="flex justify-center space-x-4 mt-4">
              <Button 
                onClick={handleCapture} 
                className="bg-green-500 hover:bg-green-600"
                disabled={!isReady}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isReady ? 'Capturar Foto' : 'Aguarde...'}
              </Button>
              <Button onClick={handleStopCamera} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid de Fotos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <Card key={photo.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[3/4]">
                <img 
                  src={photo.data} 
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={() => removePhoto(photo.id)}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {photo.name}
                </div>
                {selectedProductName && (
                  <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                      Com {selectedProductName}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Botões de Adicionar Foto */}
        {photos.length < 3 && (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="p-4">
              <div className="aspect-[3/4] flex flex-col items-center justify-center space-y-4">
                <div className="text-gray-400 text-center">
                  <Plus className="h-12 w-12 mx-auto mb-2" />
                  <span className="text-sm">
                    {photos.length === 0 ? 'Primeira foto' : `Foto ${photos.length + 1}`}
                  </span>
                </div>
                
                <div className="space-y-2 w-full">
                  <Button 
                    onClick={() => setShowPhotoSelector(true)}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Fotos Salvas
                  </Button>
                  
                  <Button 
                    onClick={handleStartCamera}
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isLoading ? 'Ativando...' : 'Tirar Foto'}
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <label className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
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
            </CardContent>
          </Card>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardContent className="p-4">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de confirmação de salvamento de foto */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja salvar esta foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Sua foto será salva em "Minhas Fotos" e poderá ser usada para análise de paleta e looks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setPendingPhoto(null); setShowConfirm(false); }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAndSavePhoto} autoFocus>
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
