import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Image, Upload, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { PalettePromptModal } from "./PalettePromptModal";

interface ImageSearchProps {
  onImageSearch: (imageData: string) => void;
  colorPalette?: any;
  onDiscoverPalette?: () => void;
}

export const ImageSearch = ({ 
  onImageSearch, 
  colorPalette,
  onDiscoverPalette 
}: ImageSearchProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragleave" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = () => {
    if (selectedImage) {
      if (!colorPalette) {
        setShowPaletteModal(true);
      } else {
        onImageSearch(selectedImage);
        toast({
          title: "Buscando por imagem...",
          description: "Analisando a imagem para encontrar produtos similares"
        });
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="mb-6 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Image className="h-5 w-5" />
          <h3 className="font-medium">Buscar por Imagem</h3>
        </div>

        {!selectedImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Arraste uma imagem aqui ou clique para selecionar
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Selecionar Imagem
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Imagem selecionada"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-white dark:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleSearch} className="w-full">
              Buscar Produtos Similares
            </Button>
          </div>
        )}
      </div>

      <PalettePromptModal
        open={showPaletteModal}
        onOpenChange={setShowPaletteModal}
        onDiscoverPalette={onDiscoverPalette || (() => {})}
        featureType="image-search"
      />
    </>
  );
};
