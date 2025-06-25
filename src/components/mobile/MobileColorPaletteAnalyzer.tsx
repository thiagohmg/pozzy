import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, X, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSavedPalettes } from "@/hooks/useSavedPalettes";
import { useCamera } from "@/hooks/useCamera";
import { useSavedPhotos } from "@/hooks/useSavedPhotos";
import { MobilePhotoSelection } from "./MobilePhotoSelection";
import { MobileCameraView } from "./MobileCameraView";
import { MobilePaletteDrawer } from "./MobilePaletteDrawer";

interface MobileColorPaletteAnalyzerProps {
  onPaletteAnalyzed: (palette: any) => void;
}

export const MobileColorPaletteAnalyzer = ({ onPaletteAnalyzed }: MobileColorPaletteAnalyzerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'camera' | 'photos' | 'upload'>('main');
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Altera atuais views: 'main', 'camera', 'photos', 'upload'
  const [pendingMethod, setPendingMethod] = useState<null | "camera" | "upload" | "saved">(null);

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
      setCurrentView('main');
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = () => {
    const imageData = capturePhoto();
    if (imageData) {
      setSelectedImage(imageData);
      stopCamera();
      setCurrentView('main');
    }
  };

  const handleSavedPhotoSelect = (photoData: string) => {
    setSelectedImage(photoData);
    setCurrentView('main');
  };

  const analyzePalette = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    toast({
      title: "✨ Analisando sua beleza...",
      description: "Nossa IA está descobrindo as cores perfeitas para você"
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
        title: "🎨 Paleta descoberta!",
        description: `Você é ${palette.seasonType}! Sua análise foi salva.`,
      });
    }, 3000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setCurrentView('main');
  };

  const startCameraFlow = () => {
    setCurrentView('camera');
    startCamera();
  };

  const stopCameraFlow = () => {
    stopCamera();
    setCurrentView('main');
  };

  // Ajuste handlers para usar drawer
  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  // Ao clicar em uma opção do Drawer, segue para etapa respectiva
  const handleSelectOption = (option: "camera" | "upload" | "saved") => {
    setDrawerOpen(false);
    setTimeout(() => {
      // Abre view correspondente após fechar drawer
      if (option === "camera") {
        setCurrentView('camera');
        startCamera();
      } else if (option === "upload") {
        setCurrentView('upload');
      } else if (option === "saved") {
        setCurrentView('photos');
      }
    }, 350); // Pequena espera para animação fechar
  };

  // Renderização baseada na view atual
  if (currentView === 'camera') {
    return (
      <MobileCameraView
        videoRef={videoRef}
        isReady={isReady}
        isLoading={isLoading}
        error={error}
        onCapture={handleCameraCapture}
        onCancel={stopCameraFlow}
      />
    );
  }

  if (currentView === 'photos') {
    return (
      <MobilePhotoSelection
        savedPhotos={savedPhotos}
        isLoading={photosLoading}
        onPhotoSelect={handleSavedPhotoSelect}
        onBack={() => setCurrentView('main')}
      />
    );
  }

  // View principal mobile - DESIGN CLEAN E SLIM
  return (
    <div
      className={`bg-white flex flex-col justify-start items-center px-4 pt-10 ${
        selectedImage ? 'min-h-screen' : 'min-h-0'
      }`}
    >
      {/* Título discreto */}
      <div className="flex items-center mb-7">
        <Palette className="h-5 w-5 text-purple-600 mr-2" />
        <h2 className="text-lg font-semibold text-[#4C1F4B]">Análise de Paleta de Cores</h2>
      </div>
      
      {/* Imagem selecionada */}
      {selectedImage && (
        <div className="w-full max-w-md mb-8 relative rounded-2xl overflow-hidden shadow-lg bg-white">
          <img
            src={selectedImage}
            alt="Sua foto"
            className="w-full h-72 object-cover"
          />
          {/* Overlay de sucesso */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none"></div>
          {/* Botão fechar */}
          <Button
            variant="secondary"
            size="sm"
            onClick={clearImage}
            className="absolute top-4 right-4 rounded-full h-10 w-10 p-0 bg-white/95 hover:bg-white shadow-lg border-0"
          >
            <X className="h-4 w-4 text-gray-700" />
          </Button>
          {/* Status */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/70 backdrop-blur-md rounded-xl p-2 border border-white/40 flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-[#4C1F4B]">Foto carregada com sucesso</span>
            </div>
          </div>
        </div>
      )}

      {/* Botão + Dicas agora diretamente DENTRO do card principal, sem card intermediário */}
      {!selectedImage && currentView === 'main' && (
        <>
          <Button
            onClick={handleOpenDrawer}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-[#4C1F4B] to-[#A883B7] text-white shadow-lg font-semibold text-lg justify-center hover:brightness-110 transition-colors mb-6"
          >
            Descobrir Minha Paleta ✨
          </Button>
          <h4 className="font-semibold text-[#4C1F4B] mb-3 text-base text-center mt-1">
            Dicas para a foto perfeita
          </h4>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full items-center justify-center pb-8">
            {/* Aumentado o padding-bottom aqui, estava pb-0 ou sem pb antes */}
            <div className="flex flex-col items-center justify-center space-y-1">
              {/* Sol: sun */}
              <span>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#dbb400" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" fill="#ffe066"/>
                  <g stroke="#dbb400">
                    <line x1="12" y1="2" x2="12" y2="4"/>
                    <line x1="12" y1="20" x2="12" y2="22"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="2" y1="12" x2="4" y2="12"/>
                    <line x1="20" y1="12" x2="22" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </g>
                </svg>
              </span>
              <span className="text-xs text-[#6D5775] text-center">Luz natural</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              {/* Alvo: target */}
              <span>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2.5" fill="#f1f5fd"/>
                  <circle cx="12" cy="12" r="5" stroke="#f43f5e" strokeWidth="2.5" fill="#fdf2f8"/>
                  <circle cx="12" cy="12" r="2" fill="#f43f5e"/>
                </svg>
              </span>
              <span className="text-xs text-[#6D5775] text-center">Fundo neutro</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              {/* Olho: eye */}
              <span>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
                  <ellipse cx="12" cy="12" rx="9" ry="5.5" fill="#fffaf2" stroke="#6d28d9" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2.2" fill="#fdba74" stroke="#6d28d9" strokeWidth="1.2"/>
                  <circle cx="12" cy="12" r="1" fill="#262626"/>
                </svg>
              </span>
              <span className="text-xs text-[#6D5775] text-center">Olhar direto</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              {/* Batom: lipstick */}
              <span>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                  <rect x="9.3" y="12" width="5.5" height="6.2" rx="1.1" fill="#f4f4f5" stroke="#a21caf" strokeWidth="1.5"/>
                  <path d="M12 12v-4.2c0-1.2.35-2.4 1.2-2.4s1.2 1.2 1.2 2.4v4.2" stroke="#a21caf" strokeWidth="1.2" fill="#f1c0e8"/>
                  <ellipse cx="15.5" cy="14.5" rx="0.55" ry="1.1" fill="#f43f5e"/>
                  <ellipse cx="10.5" cy="14.5" rx="0.55" ry="1.1" fill="#f43f5e"/>
                </svg>
              </span>
              <span className="text-xs text-[#6D5775] text-center">Pouca maquiagem</span>
            </div>
          </div>
        </>
      )}

      {/* Drawer slim com opções */}
      <MobilePaletteDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSelectOption={handleSelectOption}
      />

      {/* Erro se houver */}
      {error && (
        <div className="w-full max-w-md mt-4 rounded-xl p-4 bg-gradient-to-r from-red-50 to-pink-50 shadow border border-red-200 flex items-center">
          <X className="h-5 w-5 text-red-500 mr-3" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Botão para análise caso já exista imagem */}
      {selectedImage && (
        <Button 
          onClick={analyzePalette} 
          disabled={isAnalyzing}
          className="w-full max-w-md h-14 mt-8 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-xl font-semibold text-lg border-0 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6 animate-spin" />
              <span>Analisando sua beleza...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Eye className="h-6 w-6" />
              <span>Descobrir Minha Paleta ✨</span>
            </div>
          )}
        </Button>
      )}
    </div>
  );
};
