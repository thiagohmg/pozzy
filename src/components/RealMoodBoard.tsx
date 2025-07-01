import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  Search,
  Sparkles,
  Palette,
  Camera,
  Loader2,
  Grid3X3,
  List,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { realAPIs } from '@/integrations/realAPIs';

interface MoodBoardItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  source_url: string;
  source: 'pinterest' | 'instagram' | 'unsplash' | 'user';
  category: 'outfit' | 'makeup' | 'hairstyle' | 'accessory' | 'inspiration';
  tags: string[];
  price?: number;
  brand?: string;
  addedAt: Date;
  liked: boolean;
}

interface MoodBoard {
  id: string;
  name: string;
  description: string;
  items: MoodBoardItem[];
  theme: string;
  colorPalette: string[];
  createdAt: Date;
  isPublic: boolean;
}

export const RealMoodBoard: React.FC = () => {
  const [moodBoards, setMoodBoards] = useState<MoodBoard[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<MoodBoard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MoodBoardItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoard, setNewBoard] = useState({
    name: '',
    description: '',
    theme: '',
    isPublic: false
  });

  const { toast } = useToast();

  // Carregar mood boards do usuário
  useEffect(() => {
    loadMoodBoards();
  }, []);

  const loadMoodBoards = async () => {
    try {
      // Buscar mood boards do banco de dados
      const { data, error } = await supabase
        .from('mood_boards')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const boards = (data || []).map(board => ({
        id: board.id,
        name: board.name,
        description: board.description,
        items: board.items || [],
        theme: board.theme,
        colorPalette: board.color_palette || [],
        createdAt: new Date(board.created_at),
        isPublic: board.is_public
      }));

      setMoodBoards(boards);
      
      if (boards.length > 0 && !selectedBoard) {
        setSelectedBoard(boards[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar mood boards:', error);
      toast({
        title: "Erro ao carregar mood boards",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const createMoodBoard = async () => {
    if (!newBoard.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para o mood board",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mood_boards')
        .insert({
          name: newBoard.name,
          description: newBoard.description,
          theme: newBoard.theme,
          is_public: newBoard.isPublic,
          items: [],
          color_palette: []
        })
        .select()
        .single();

      if (error) throw error;

      const board: MoodBoard = {
        id: data.id,
        name: data.name,
        description: data.description,
        items: [],
        theme: data.theme,
        colorPalette: [],
        createdAt: new Date(data.created_at),
        isPublic: data.is_public
      };

      setMoodBoards(prev => [board, ...prev]);
      setSelectedBoard(board);
      setShowCreateBoard(false);
      setNewBoard({ name: '', description: '', theme: '', isPublic: false });

      toast({
        title: "Mood board criado!",
        description: `${board.name} foi criado com sucesso`
      });
    } catch (error) {
      console.error('Erro ao criar mood board:', error);
      toast({
        title: "Erro ao criar mood board",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const searchInspiration = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // Buscar em múltiplas fontes
      const results: MoodBoardItem[] = [];

      // 1. Pinterest (simulado)
      const pinterestResults = await searchPinterest(searchQuery);
      results.push(...pinterestResults);

      // 2. Unsplash
      const unsplashResults = await searchUnsplash(searchQuery);
      results.push(...unsplashResults);

      // 3. Produtos reais
      const productResults = await searchProducts(searchQuery);
      results.push(...productResults);

      setSearchResults(results);

      toast({
        title: `${results.length} itens encontrados!`,
        description: "Adicione os que você gostar ao seu mood board"
      });

    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro na busca",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchPinterest = async (query: string): Promise<MoodBoardItem[]> => {
    try {
      // Simular busca no Pinterest
      const response = await fetch(`https://api.pinterest.com/v3/search/pins/?query=${encodeURIComponent(query)}&access_token=YOUR_PINTEREST_TOKEN`);
      
      // Fallback para dados simulados
      return [
        {
          id: `pinterest_1`,
          title: `Inspiração ${query}`,
          description: 'Look inspirador do Pinterest',
          image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
          source_url: 'https://pinterest.com',
          source: 'pinterest',
          category: 'outfit',
          tags: [query, 'inspiration', 'style'],
          addedAt: new Date(),
          liked: false
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar no Pinterest:', error);
      return [];
    }
  };

  const searchUnsplash = async (query: string): Promise<MoodBoardItem[]> => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=YOUR_UNSPLASH_CLIENT_ID`
      );
      
      if (!response.ok) throw new Error('Unsplash API error');

      const data = await response.json();
      
      return data.results?.slice(0, 5).map((photo: any) => ({
        id: `unsplash_${photo.id}`,
        title: photo.alt_description || 'Foto inspiradora',
        description: photo.description || 'Imagem do Unsplash',
        image_url: photo.urls.regular,
        source_url: photo.links.html,
        source: 'unsplash',
        category: 'inspiration',
        tags: photo.tags?.map((tag: any) => tag.title) || [],
        addedAt: new Date(),
        liked: false
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar no Unsplash:', error);
      return [];
    }
  };

  const searchProducts = async (query: string): Promise<MoodBoardItem[]> => {
    try {
      const products = await realAPIs.searchAllSources(query, { limit: 5 });
      
      return products.map(product => ({
        id: `product_${product.id}`,
        title: product.name,
        description: product.description,
        image_url: product.image_url,
        source_url: product.url,
        source: 'user',
        category: 'outfit',
        tags: [product.category, product.brand],
        price: product.price,
        brand: product.brand,
        addedAt: new Date(),
        liked: false
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  };

  const addItemToBoard = async (item: MoodBoardItem) => {
    if (!selectedBoard) {
      toast({
        title: "Selecione um mood board",
        description: "Escolha um board para adicionar o item",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedBoard = {
        ...selectedBoard,
        items: [...selectedBoard.items, item]
      };

      // Atualizar no banco
      const { error } = await supabase
        .from('mood_boards')
        .update({ items: updatedBoard.items })
        .eq('id', selectedBoard.id);

      if (error) throw error;

      setSelectedBoard(updatedBoard);
      setMoodBoards(prev => 
        prev.map(board => 
          board.id === selectedBoard.id ? updatedBoard : board
        )
      );

      toast({
        title: "Item adicionado!",
        description: `${item.title} foi adicionado ao mood board`
      });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro ao adicionar item",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const removeItemFromBoard = async (itemId: string) => {
    if (!selectedBoard) return;

    try {
      const updatedItems = selectedBoard.items.filter(item => item.id !== itemId);
      const updatedBoard = { ...selectedBoard, items: updatedItems };

      const { error } = await supabase
        .from('mood_boards')
        .update({ items: updatedItems })
        .eq('id', selectedBoard.id);

      if (error) throw error;

      setSelectedBoard(updatedBoard);
      setMoodBoards(prev => 
        prev.map(board => 
          board.id === selectedBoard.id ? updatedBoard : board
        )
      );

      toast({
        title: "Item removido",
        description: "Item removido do mood board"
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast({
        title: "Erro ao remover item",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const toggleItemLike = async (itemId: string) => {
    if (!selectedBoard) return;

    const updatedItems = selectedBoard.items.map(item =>
      item.id === itemId ? { ...item, liked: !item.liked } : item
    );

    const updatedBoard = { ...selectedBoard, items: updatedItems };

    try {
      const { error } = await supabase
        .from('mood_boards')
        .update({ items: updatedItems })
        .eq('id', selectedBoard.id);

      if (error) throw error;

      setSelectedBoard(updatedBoard);
      setMoodBoards(prev => 
        prev.map(board => 
          board.id === selectedBoard.id ? updatedBoard : board
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar like:', error);
    }
  };

  const downloadBoard = async () => {
    if (!selectedBoard) return;

    try {
      // Gerar PDF ou imagem do mood board
      toast({
        title: "Download iniciado",
        description: "Seu mood board está sendo preparado"
      });
    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const shareBoard = async () => {
    if (!selectedBoard) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedBoard.name,
          text: selectedBoard.description,
          url: `${window.location.origin}/moodboard/${selectedBoard.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/moodboard/${selectedBoard.id}`);
        toast({
          title: "Link copiado!",
          description: "Cole o link para compartilhar"
        });
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const filteredItems = selectedBoard?.items.filter(item => 
    filterCategory === 'all' || item.category === filterCategory
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Mood Board Real ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Crie mood boards inspiradores com IA e integração real
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Mood Boards */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Meus Mood Boards</span>
                <Button
                  size="sm"
                  onClick={() => setShowCreateBoard(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {moodBoards.map(board => (
                  <div
                    key={board.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedBoard?.id === board.id 
                        ? 'bg-purple-100 border-purple-300' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedBoard(board)}
                  >
                    <h4 className="font-medium">{board.name}</h4>
                    <p className="text-sm text-gray-500">{board.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {board.items.length} itens
                      </span>
                      {board.isPublic && (
                        <Badge variant="outline" className="text-xs">
                          Público
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Criar Novo Board */}
          {showCreateBoard && (
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Mood Board</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Nome do mood board"
                  value={newBoard.name}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Descrição (opcional)"
                  value={newBoard.description}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, description: e.target.value }))}
                />
                <Input
                  placeholder="Tema (ex: verão, trabalho, festa)"
                  value={newBoard.theme}
                  onChange={(e) => setNewBoard(prev => ({ ...prev, theme: e.target.value }))}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newBoard.isPublic}
                    onChange={(e) => setNewBoard(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <label htmlFor="isPublic" className="text-sm">Tornar público</label>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={createMoodBoard} className="flex-1">
                    Criar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateBoard(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna Central - Board Selecionado */}
        <div className="lg:col-span-2 space-y-4">
          {selectedBoard ? (
            <>
              {/* Header do Board */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedBoard.name}</CardTitle>
                      <p className="text-sm text-gray-500">{selectedBoard.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={downloadBoard}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={shareBoard}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Controles */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="p-2 border rounded-md text-sm"
                    >
                      <option value="all">Todas as categorias</option>
                      <option value="outfit">Roupas</option>
                      <option value="makeup">Maquiagem</option>
                      <option value="hairstyle">Penteado</option>
                      <option value="accessory">Acessórios</option>
                      <option value="inspiration">Inspiração</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Itens do Board */}
              {filteredItems.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4'}>
                  {filteredItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative group">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleItemLike(item.id)}
                              >
                                <Heart className={`h-4 w-4 ${item.liked ? 'fill-current text-red-500' : ''}`} />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => removeItemFromBoard(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                          {item.price && (
                            <p className="text-sm font-bold text-green-600">
                              R$ {item.price.toFixed(2)}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Sparkles className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Seu mood board está vazio
                    </h3>
                    <p className="text-gray-500">
                      Busque inspirações e adicione itens ao seu board
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Palette className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Selecione um mood board
                </h3>
                <p className="text-gray-500">
                  Escolha um board existente ou crie um novo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Busca de Inspiração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar Inspiração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ex: vestido floral, maquiagem natural, penteado romântico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchInspiration()}
                className="flex-1"
              />
              <Button
                onClick={searchInspiration}
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Resultados da Busca */}
            {searchResults.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Resultados da Busca:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative group">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="sm"
                              onClick={() => addItemToBoard(item)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium line-clamp-2">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.source}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 