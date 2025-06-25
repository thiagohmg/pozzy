
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, RefreshCw, Sparkles } from 'lucide-react';

interface CameraControlsProps {
  isActive: boolean;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CameraControls = ({
  isActive,
  isLoading,
  isReady,
  error,
  onStartCamera,
  onStopCamera,
  onCapture,
  onFileUpload
}: CameraControlsProps) => {
  if (!isActive) {
    return (
      <div className="text-center py-8">
        <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Experimente roupas virtualmente usando sua câmera ou enviando uma foto
        </p>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <Button onClick={onStartCamera} size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onStartCamera} 
            className="bg-purple-500 hover:bg-purple-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Ativando...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Ativar Câmera
              </>
            )}
          </Button>
          
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Foto
              <input
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Frase motivacional do POZZY */}
      <div className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-1">📸 Faça a POZZY para a foto!</h3>
        <p className="text-sm opacity-90">Sorria e aproveite o momento ✨</p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onCapture} 
          className="bg-green-500 hover:bg-green-600"
          disabled={!isReady}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isReady ? 'Experimentar Roupa' : 'Aguarde...'}
        </Button>
        <Button onClick={onStopCamera} variant="outline">
          Cancelar
        </Button>
      </div>
    </div>
  );
};
