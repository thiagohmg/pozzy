
import { useState, useEffect } from 'react';

interface SavedPalette {
  id: string;
  data: any;
  createdAt: string;
  name: string;
}

export const useSavedPalettes = () => {
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [currentPalette, setCurrentPalette] = useState<SavedPalette | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    try {
      const stored = localStorage.getItem('pozzy-saved-palettes');
      if (stored) {
        const palettes = JSON.parse(stored);
        setSavedPalettes(palettes);
        
        // Se há paletas salvas, define a mais recente como atual
        if (palettes.length > 0) {
          const mostRecent = palettes.sort((a: SavedPalette, b: SavedPalette) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          setCurrentPalette(mostRecent);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar paletas salvas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePalette = (paletteData: any, name?: string) => {
    try {
      const newPalette: SavedPalette = {
        id: `palette-${Date.now()}`,
        data: paletteData,
        createdAt: new Date().toISOString(),
        name: name || paletteData.seasonType || 'Minha Paleta'
      };

      const updatedPalettes = [newPalette, ...savedPalettes];
      setSavedPalettes(updatedPalettes);
      setCurrentPalette(newPalette);
      localStorage.setItem('pozzy-saved-palettes', JSON.stringify(updatedPalettes));
      
      return newPalette;
    } catch (error) {
      console.error('Erro ao salvar paleta:', error);
      return null;
    }
  };

  const deletePalette = (paletteId: string) => {
    try {
      const updatedPalettes = savedPalettes.filter(p => p.id !== paletteId);
      setSavedPalettes(updatedPalettes);
      
      // Se a paleta excluída era a atual, define a próxima mais recente ou null
      if (currentPalette?.id === paletteId) {
        const nextPalette = updatedPalettes.length > 0 ? updatedPalettes[0] : null;
        setCurrentPalette(nextPalette);
      }
      
      localStorage.setItem('pozzy-saved-palettes', JSON.stringify(updatedPalettes));
      return true;
    } catch (error) {
      console.error('Erro ao excluir paleta:', error);
      return false;
    }
  };

  const clearAllPalettes = () => {
    try {
      setSavedPalettes([]);
      setCurrentPalette(null);
      localStorage.removeItem('pozzy-saved-palettes');
      return true;
    } catch (error) {
      console.error('Erro ao limpar paletas:', error);
      return false;
    }
  };

  return {
    savedPalettes,
    currentPalette,
    isLoading,
    savePalette,
    deletePalette,
    clearAllPalettes,
    setCurrentPalette
  };
};
