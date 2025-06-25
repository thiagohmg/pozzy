
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X, Sparkles, ArrowLeft } from 'lucide-react';

interface MobileCameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  onCapture: () => void;
  onCancel: () => void;
}

export const MobileCameraView = ({
  videoRef,
  isReady,
  isLoading,
  error,
  onCapture,
  onCancel
}: MobileCameraViewProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header da câmera */}
      <div className="relative z-10 bg-gradient-to-r from-black/80 to-black/60 text-white p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={onCancel}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-semibold">Capture sua foto</h2>
            <p className="text-xs text-white/80">Posicione-se bem no centro</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Área da câmera */}
      <div className="flex-1 relative">
        {error ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Card className="w-full max-w-sm">
              <CardContent className="p-6 text-center">
                <X className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold text-red-700 mb-2">Erro na câmera</h3>
                <p className="text-sm text-red-600 mb-4">{error}</p>
                <Button onClick={onCancel} variant="outline" className="w-full">
                  Voltar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Overlay com guias visuais */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Círculo guia para o rosto */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-64 h-80 border-2 border-white/50 rounded-[2rem] border-dashed"></div>
              </div>
              
              {/* Texto de instrução */}
              <div className="absolute top-20 left-0 right-0 text-center">
                <div className="inline-block bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  📸 Alinhe seu rosto dentro do círculo
                </div>
              </div>
              
              {/* Status da câmera */}
              <div className="absolute top-4 left-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isReady 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-black'
                }`}>
                  {isReady ? '✅ Pronto para capturar' : '⏳ Preparando...'}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controles da câmera */}
      <div className="relative z-10 bg-gradient-to-t from-black/90 to-black/60 p-6">
        <div className="flex items-center justify-center space-x-8">
          {/* Botão cancelar */}
          <Button
            onClick={onCancel}
            variant="outline"
            className="rounded-full h-16 w-16 border-white/30 bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Botão capturar - principal */}
          <Button
            onClick={onCapture}
            disabled={!isReady}
            className="rounded-full h-20 w-20 bg-white hover:bg-gray-100 disabled:bg-gray-500 shadow-2xl transform transition-all duration-200 active:scale-95"
          >
            {isReady ? (
              <Camera className="h-8 w-8 text-gray-800" />
            ) : (
              <Sparkles className="h-8 w-8 text-gray-400 animate-spin" />
            )}
          </Button>

          {/* Placeholder para simetria */}
          <div className="h-16 w-16"></div>
        </div>

        {/* Dicas da câmera */}
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm">
            {isReady 
              ? "Toque no círculo branco para capturar" 
              : "Aguarde a câmera ficar pronta..."
            }
          </p>
        </div>
      </div>
    </div>
  );
};
