
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Palette, Sparkles, CheckCircle, XCircle, Lightbulb, Trash2, Heart, RotateCcw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSavedPalettes } from "@/hooks/useSavedPalettes";
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

interface PaletteResultsProps {
  palette: any;
  showSaveOptions?: boolean;
  onSave?: (palette: any) => void;
  onEdit?: (palette: any) => void;
  onDelete?: (paletteId: string) => void;
  isSaved?: boolean;
  onNewAnalysis?: () => void;
}

export const PaletteResults = ({ 
  palette, 
  showSaveOptions = true,
  onSave,
  onEdit,
  onDelete,
  isSaved = false,
  onNewAnalysis
}: PaletteResultsProps) => {
  const [saved, setSaved] = useState(isSaved);
  const { toast } = useToast();
  const { deletePalette, currentPalette } = useSavedPalettes();

  if (!palette) return null;

  // Função helper para garantir que temos um array
  const ensureArray = (arr: any) => Array.isArray(arr) ? arr : [];

  const handleDeletePalette = () => {
    if (currentPalette) {
      const success = deletePalette(currentPalette.id);
      if (success) {
        setSaved(false);
        toast({
          title: "Paleta excluída! 🗑️",
          description: "Sua análise foi removida. Você pode fazer uma nova análise quando quiser."
        });
        
        if (onDelete && currentPalette.id) {
          onDelete(currentPalette.id);
        }
      }
    }
  };

  const handleNewAnalysis = () => {
    if (onNewAnalysis) {
      onNewAnalysis();
    }
    toast({
      title: "Nova análise",
      description: "Faça upload de uma nova foto para descobrir sua paleta"
    });
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-purple-500" />
            <h3 className="font-medium">Sua Paleta Pessoal</h3>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {Math.round((palette.confidence || 0) * 100)}% confiança
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-green-600 text-sm">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Salva
            </div>
            <Button
              onClick={handleNewAnalysis}
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Nova Análise
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Paleta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir sua análise de paleta de cores? 
                    Você precisará fazer uma nova análise para descobrir suas cores novamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeletePalette}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Sim, Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Tipo de Estação */}
          <div>
            <h4 className="font-medium text-lg mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-gold" />
              {palette.seasonType || palette.season || 'Estação não definida'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {palette.description || 'Análise personalizada baseada em suas características'}
            </p>
            <div className="text-xs">
              <strong>Subtom dominante:</strong> {palette.dominantUndertone || palette.undertone || 'Não definido'}
            </div>
          </div>

          {/* Características */}
          {ensureArray(palette.characteristics).length > 0 && (
            <div>
              <h5 className="font-medium mb-2">Suas Características:</h5>
              <ul className="text-sm space-y-1">
                {ensureArray(palette.characteristics).map((char: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                    <span>{char}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cores Ideais */}
          {ensureArray(palette.bestColors).length > 0 && (
            <div>
              <h5 className="font-medium mb-3">Suas Cores Ideais:</h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ensureArray(palette.bestColors).map((color: any, index: number) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-white shadow-lg"
                      style={{ backgroundColor: color.hex || color }}
                    />
                    <div className="text-xs font-medium">{color.name || `Cor ${index + 1}`}</div>
                    <div className="text-xs text-gray-500">{color.category || ''}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cores a Evitar */}
          {ensureArray(palette.avoidColors).length > 0 && (
            <div>
              <h5 className="font-medium mb-3">Cores a Evitar:</h5>
              <div className="space-y-2">
                {ensureArray(palette.avoidColors).map((color: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex || color }}
                    />
                    <div className="flex-1">
                      <span className="font-medium">{color.name || `Cor ${index + 1}`}</span>
                      <div className="text-xs text-gray-500">{color.reason || 'Não combina com seu subtom'}</div>
                    </div>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dicas de Maquiagem */}
          {ensureArray(palette.makeupTips).length > 0 && (
            <div>
              <h5 className="font-medium mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                Dicas de Maquiagem:
              </h5>
              <ul className="text-sm space-y-1">
                {ensureArray(palette.makeupTips).map((tip: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-pink-500">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações de Estilo */}
          {ensureArray(palette.styleRecommendations).length > 0 && (
            <div>
              <h5 className="font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Recomendações de Estilo:
              </h5>
              <ul className="text-sm space-y-1">
                {ensureArray(palette.styleRecommendations).map((rec: string, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-500">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
