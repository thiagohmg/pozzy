
import { useState, useEffect } from 'react';

interface Photo {
  id: string;
  data: string;
  name: string;
}

const DEFAULT_PHOTOS: Photo[] = [
  {
    id: 'default-1',
    data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNNzAgMTMwSDE3MEwxNDAgMjAwSDYwTDcwIDEzMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHRleHQgeD0iMTAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Rm90byAxPC90ZXh0Pgo8L3N2Zz4=',
    name: 'Foto Exemplo 1'
  },
  {
    id: 'default-2',
    data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRkVGM0UyIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iI0Y5Qzc0RiIvPgo8cGF0aCBkPSJNNzAgMTMwSDE3MEwxNDAgMjAwSDYwTDcwIDEzMFoiIGZpbGw9IiNGOUM3NEYiLz4KPHRleHQgeD0iMTAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNENzI5MDkiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Rm90byAyPC90ZXh0Pgo8L3N2Zz4=',
    name: 'Foto Exemplo 2'
  },
  {
    id: 'default-3',
    data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRUNGREY1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzM0RDM5OSIvPgo8cGF0aCBkPSJNNzAgMTMwSDE3MEwxNDAgMjAwSDYwTDcwIDEzMFoiIGZpbGw9IiMzNEQzOTkiLz4KPHRleHQgeD0iMTAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwNTY5NDIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+Rm90byAzPC90ZXh0Pgo8L3N2Zz4=',
    name: 'Foto Exemplo 3'
  }
];

export const useSavedPhotos = () => {
  const [savedPhotos, setSavedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedPhotos = () => {
      try {
        const stored = localStorage.getItem('pozzy-saved-photos');
        if (stored) {
          const parsedPhotos = JSON.parse(stored);
          if (Array.isArray(parsedPhotos) && parsedPhotos.length > 0) {
            setSavedPhotos(parsedPhotos);
          } else {
            setSavedPhotos(DEFAULT_PHOTOS);
          }
        } else {
          setSavedPhotos(DEFAULT_PHOTOS);
        }
      } catch (error) {
        console.error('Erro ao carregar fotos salvas:', error);
        setSavedPhotos(DEFAULT_PHOTOS);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPhotos();
  }, []);

  const savePhotos = (photos: Photo[]) => {
    try {
      setSavedPhotos(photos);
      localStorage.setItem('pozzy-saved-photos', JSON.stringify(photos));
    } catch (error) {
      console.error('Erro ao salvar fotos:', error);
    }
  };

  const addSavedPhoto = (photo: Photo) => {
    const updatedPhotos = [...savedPhotos, photo];
    savePhotos(updatedPhotos);
  };

  const removeSavedPhoto = (photoId: string) => {
    const updatedPhotos = savedPhotos.filter(p => p.id !== photoId);
    savePhotos(updatedPhotos);
  };

  const replaceSavedPhoto = (photoId: string, newPhoto: Photo) => {
    const updatedPhotos = savedPhotos.map(p => 
      p.id === photoId ? newPhoto : p
    );
    savePhotos(updatedPhotos);
  };

  return {
    savedPhotos,
    addSavedPhoto,
    removeSavedPhoto,
    replaceSavedPhoto,
    DEFAULT_PHOTOS,
    isLoading
  };
};
