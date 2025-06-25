import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PhotoManager } from "@/components/PhotoManager";
// FIXED: Use default import for Wishlist
import Wishlist from "@/components/Wishlist";
import { PaletteResults } from "@/components/PaletteResults";
import { Palette, Image, MessageSquare, Heart, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Photo {
  id: string;
  data: string;
  name: string;
}

interface ProfileSectionProps {
  isSetupComplete: boolean;
  userPhotos: Photo[];
  colorPalette: any;
  selectedProduct: any;
  userId: string | null;
  onInitialSetupComplete: (photos: Photo[], palette: any) => void;
  onPhotosChange: (photos: Photo[]) => void;
  onPaletteAnalyzed: (palette: any) => void;
  activeSubSection?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  isSetupComplete,
  userPhotos,
  colorPalette,
  selectedProduct,
  userId,
  onInitialSetupComplete,
  onPhotosChange,
  onPaletteAnalyzed,
  activeSubSection
}) => {
  const { toast } = useToast();
  
  if (!userId) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
          Faça login para ver seu perfil
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Entre ou cadastre-se para acessar seu closet digital.
        </p>
      </div>
    );
  }

  // Dados mockados para demonstração
  const savedPalettes = colorPalette ? [colorPalette] : [];
  const [savedAdvice, setSavedAdvice] = React.useState([
    {
      id: '1',
      title: 'Consultoria para Evento Formal',
      date: '2024-01-15',
      summary: 'Recomendações para look de casamento'
    }
  ]);

  const handleDeleteAdvice = (adviceId: string) => {
    const adviceToDelete = savedAdvice.find(advice => advice.id === adviceId);
    setSavedAdvice(savedAdvice.filter(advice => advice.id !== adviceId));
    
    toast({
      title: "Consultoria removida",
      description: `"${adviceToDelete?.title}" foi excluída com sucesso`
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = userPhotos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
    
    toast({
      title: "Foto removida",
      description: "Foto excluída com sucesso"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mt-10 mb-8">
        <h2 className="title-primary mb-3">
          Meu Closet Digital ✨
        </h2>
        <p className="subtitle-description max-w-2xl mx-auto">
          Seu arquivo pessoal de moda - organize suas análises de cores, fotos, 
          consultorias e produtos favoritos em um só lugar
        </p>
      </div>

      {/* Grid de seções organizadas */}
      <div className="w-full px-2 md:px-0 max-w-[430px] md:max-w-none mx-auto">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Paletas de Cores Salvas */}
          <Card
            id="saved-palettes-section"
            className={`flex flex-col h-full w-full max-w-full overflow-hidden hover:shadow-lg transition-shadow ${
              activeSubSection === 'saved-palettes' ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <CardContent className="flex-1 flex flex-col p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Minhas Paletas de Cores
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Suas análises de coloração pessoal
                  </p>
                </div>
                <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                  {savedPalettes.length}
                </span>
              </div>
              
              {savedPalettes.length > 0 ? (
                <div className="space-y-4">
                  {savedPalettes.map((palette, index) => (
                    <div key={index} className="relative group">
                      <PaletteResults 
                        palette={palette} 
                        showSaveOptions={false}
                        isSaved={true}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Paleta</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta análise de paleta de cores? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="font-medium mb-1">Nenhuma paleta salva</p>
                  <p className="text-sm">Descubra suas cores em "Descobrir"</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Minhas Fotos */}
          <Card
            id="photos-section"
            className={`flex flex-col h-full w-full max-w-full overflow-hidden hover:shadow-lg transition-shadow ${
              activeSubSection === 'photos' ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <CardContent className="flex-1 flex flex-col p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Image className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Minhas Fotos
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Para try-on virtual e análises
                  </p>
                </div>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                  {userPhotos.length}
                </span>
              </div>
              
              {userPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {userPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square group w-full overflow-hidden rounded-lg border border-gray-100 bg-white"
                      style={{ maxWidth: '100%' }}
                    >
                      <img
                        src={photo.data}
                        alt={photo.name}
                        className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          display: 'block',
                        }}
                      />
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Foto</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta foto? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Image className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="font-medium mb-1">Nenhuma foto adicionada</p>
                  <p className="text-sm">Adicione fotos para usar o try-on virtual</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultorias Salvas */}
          <Card
            id="saved-advice-section"
            className={`flex flex-col h-full w-full max-w-full overflow-hidden hover:shadow-lg transition-shadow ${
              activeSubSection === 'saved-advice' ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <CardContent className="flex-1 flex flex-col p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Consultorias Salvas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Dicas e análises que você salvou
                  </p>
                </div>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {savedAdvice.length}
                </span>
              </div>
              
              {savedAdvice.length > 0 ? (
                <div className="space-y-3">
                  {savedAdvice.map((advice) => (
                    <div key={advice.id} className="relative group p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <h4 className="font-medium text-gray-800 mb-1 pr-8">{advice.title}</h4>
                      <p className="text-xs text-gray-500 mb-2">{advice.date}</p>
                      <p className="text-sm text-gray-600">{advice.summary}</p>
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-blue-100"
                        >
                          <Pencil className="h-3 w-3 text-blue-600" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-100"
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Consultoria</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a consultoria "{advice.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAdvice(advice.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto mb-3 opacity-30" />
                  <p className="font-medium mb-1">Nenhuma consultoria salva</p>
                  <p className="text-sm">Use a "Consultoria IA" e salve suas favoritas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Desejos */}
          <Card
            id="desejos-section"
            className={`flex flex-col h-full w-full max-w-full overflow-hidden hover:shadow-lg transition-shadow ${
              activeSubSection === 'desejos' ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <CardContent className="flex-1 flex flex-col p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Lista de Desejos
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Produtos que você quer comprar
                  </p>
                </div>
              </div>
              <Wishlist />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
