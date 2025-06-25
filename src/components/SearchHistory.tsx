
import React, { useState, useEffect } from 'react';
import { History, X, Search, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SearchHistoryProps {
  onSearchSelect: (query: string) => void;
}

export const SearchHistory = ({ onSearchSelect }: SearchHistoryProps) => {
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setHistory(savedHistory.slice(0, 8)); // Increased from 5 to 8 recent searches
  }, []);

  const removeFromHistory = (query: string) => {
    const newHistory = history.filter(item => item !== query);
    setHistory(newHistory);
    const fullHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updatedFullHistory = fullHistory.filter((item: string) => item !== query);
    localStorage.setItem('searchHistory', JSON.stringify(updatedFullHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
    setShowHistory(false);
  };

  const categorizeSearch = (query: string) => {
    if (query.includes('[Busca por imagem]')) return 'image';
    if (query.includes('[Busca por ocasião]')) return 'occasion';
    if (query.includes('[Busca por filtros]')) return 'filters';
    return 'text';
  };

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'occasion': return '✨';
      case 'filters': return '🔍';
      default: return '💬';
    }
  };

  if (history.length === 0) return null;

  return (
    <div className="mb-4">
      <Button
        variant="outline"
        onClick={() => setShowHistory(!showHistory)}
        className="mb-2 text-sm w-full justify-between"
      >
        <div className="flex items-center">
          <History className="h-4 w-4 mr-2" />
          Histórico de Buscas ({history.length})
        </div>
        <Clock className="h-3 w-3" />
      </Button>

      {showHistory && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-purple-800">Buscas Recentes</h4>
              <Button variant="ghost" size="sm" onClick={clearHistory} className="text-purple-600">
                Limpar Tudo
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {history.map((query, index) => {
                const searchType = categorizeSearch(query);
                const cleanQuery = query.replace(/\[.*?\]\s*/, '');
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-purple-100 rounded-lg transition-colors">
                    <button
                      onClick={() => {
                        onSearchSelect(query);
                        setShowHistory(false);
                      }}
                      className="flex items-center space-x-3 text-left flex-1 min-w-0"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{getSearchIcon(searchType)}</span>
                        <Search className="h-3 w-3 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-purple-800 block truncate">{cleanQuery}</span>
                        {searchType !== 'text' && (
                          <Badge variant="secondary" className="text-xs mt-1 bg-purple-200 text-purple-700">
                            {searchType === 'image' && 'Busca por Imagem'}
                            {searchType === 'occasion' && 'Por Ocasião'}
                            {searchType === 'filters' && 'Com Filtros'}
                          </Badge>
                        )}
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromHistory(query)}
                      className="ml-2 p-1 hover:bg-purple-200"
                    >
                      <X className="h-3 w-3 text-purple-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t border-purple-200">
              <p className="text-xs text-purple-600 text-center">
                💡 Clique em qualquer busca para executá-la novamente
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
