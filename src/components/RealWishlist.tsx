import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Plus, 
  Trash2, 
  Edit3, 
  Share2, 
  ShoppingCart, 
  Star,
  Filter,
  Search,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { realAPIs } from '@/integrations/realAPIs';

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  url: string;
  addedAt: Date;
  inStock: boolean;
  onSale: boolean;
  priority: 'high' | 'medium' | 'low';
  favoriteType: 'quero_comprar' | 'gostei' | 'inspiracao';
  notes?: string;
  category?: string;
  color?: string;
  size?: string;
}

interface WishlistGroup {
  id: string;
  name: string;
  description?: string;
  items: WishlistItem[];
  isDefault: boolean;
  createdAt: Date;
}

export const RealWishlist: React.FC = () => {
  const [wishlists, setWishlists] = useState<WishlistGroup[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<string>('');
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'priority'>('date');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    brand: '',
    price: '',
    url: '',
    notes: '',
    priority: 'medium' as const,
    favoriteType: 'quero_comprar' as const
  });

  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar wishlists do usuário
  useEffect(() => {
    if (user) {
      loadWishlists();
    }
  }, [user]);

  // Carregar itens da wishlist selecionada
  useEffect(() => {
    if (selectedWishlist) {
      loadWishlistItems(selectedWishlist);
    }
  }, [selectedWishlist]);

  const loadWishlists = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const wishlistGroups = data || [];
      
      // Criar wishlist padrão se não existir
      if (wishlistGroups.length === 0) {
        const defaultWishlist = await createDefaultWishlist();
        wishlistGroups.push(defaultWishlist);
      }

      setWishlists(wishlistGroups);
      setSelectedWishlist(wishlistGroups[0]?.id || '');
    } catch (error) {
      console.error('Erro ao carregar wishlists:', error);
      toast({
        title: "Erro ao carregar wishlists",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultWishlist = async (): Promise<WishlistGroup> => {
    const { data, error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user?.id,
        name: 'Minha Wishlist',
        description: 'Wishlist principal',
        is_default: true
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      items: [],
      isDefault: data.is_default,
      createdAt: new Date(data.created_at)
    };
  };

  const loadWishlistItems = async (wishlistId: string) => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('wishlist_id', wishlistId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const wishlistItems = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        originalPrice: item.original_price,
        image_url: item.image_url,
        url: item.url,
        addedAt: new Date(item.created_at),
        inStock: item.in_stock,
        onSale: item.on_sale,
        priority: item.priority,
        favoriteType: item.favorite_type,
        notes: item.notes,
        category: item.category,
        color: item.color,
        size: item.size
      }));

      setItems(wishlistItems);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      toast({
        title: "Erro ao carregar itens",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const addItemToWishlist = async () => {
    if (!newItem.name.trim() || !newItem.brand.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e marca são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: selectedWishlist,
          name: newItem.name,
          brand: newItem.brand,
          price: parseFloat(newItem.price) || 0,
          url: newItem.url,
          notes: newItem.notes,
          priority: newItem.priority,
          favorite_type: newItem.favoriteType,
          in_stock: true,
          on_sale: false
        })
        .select()
        .single();

      if (error) throw error;

      const newWishlistItem: WishlistItem = {
        id: data.id,
        name: data.name,
        brand: data.brand,
        price: data.price,
        image_url: data.image_url || '',
        url: data.url,
        addedAt: new Date(data.created_at),
        inStock: data.in_stock,
        onSale: data.on_sale,
        priority: data.priority,
        favoriteType: data.favorite_type,
        notes: data.notes
      };

      setItems(prev => [newWishlistItem, ...prev]);
      setNewItem({
        name: '',
        brand: '',
        price: '',
        url: '',
        notes: '',
        priority: 'medium',
        favoriteType: 'quero_comprar'
      });
      setShowAddForm(false);

      toast({
        title: "Item adicionado!",
        description: `${newItem.name} foi adicionado à sua wishlist`
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

  const removeItemFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));

      toast({
        title: "Item removido",
        description: "Item removido da wishlist com sucesso"
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

  const updateItemPriority = async (itemId: string, priority: 'high' | 'medium' | 'low') => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .update({ priority })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, priority } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar prioridade:', error);
    }
  };

  const searchProducts = async (query: string) => {
    if (!query.trim()) return;

    try {
      const products = await realAPIs.searchAllSources(query);
      
      if (products.length > 0) {
        // Mostrar modal para selecionar produto
        const selectedProduct = products[0]; // Simplificado - ideal seria um modal
        
        setNewItem({
          name: selectedProduct.name,
          brand: selectedProduct.brand,
          price: selectedProduct.price.toString(),
          url: selectedProduct.url,
          notes: '',
          priority: 'medium',
          favoriteType: 'quero_comprar'
        });
        setShowAddForm(true);
      }
    } catch (error) {
      console.error('Erro na busca de produtos:', error);
    }
  };

  // Filtrar e ordenar itens
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || item.favoriteType === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return b.addedAt.getTime() - a.addedAt.getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Minhas Wishlists
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Organize seus produtos favoritos
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-pink-500 hover:bg-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </div>

      {/* Seleção de Wishlist */}
      {wishlists.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              {wishlists.map(wishlist => (
                <Button
                  key={wishlist.id}
                  variant={selectedWishlist === wishlist.id ? "default" : "outline"}
                  onClick={() => setSelectedWishlist(wishlist.id)}
                >
                  {wishlist.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Busca e Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar na wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">Todos</option>
                <option value="quero_comprar">Quero Comprar</option>
                <option value="gostei">Gostei</option>
                <option value="inspiracao">Inspiração</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 border rounded-md"
              >
                <option value="date">Data</option>
                <option value="price">Preço</option>
                <option value="priority">Prioridade</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Adição */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Item à Wishlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome do produto"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Marca"
                value={newItem.brand}
                onChange={(e) => setNewItem(prev => ({ ...prev, brand: e.target.value }))}
              />
              <Input
                placeholder="Preço (opcional)"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
              />
              <Input
                placeholder="URL (opcional)"
                value={newItem.url}
                onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newItem.priority}
                onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as any }))}
                className="p-2 border rounded-md"
              >
                <option value="low">Baixa Prioridade</option>
                <option value="medium">Média Prioridade</option>
                <option value="high">Alta Prioridade</option>
              </select>
              <select
                value={newItem.favoriteType}
                onChange={(e) => setNewItem(prev => ({ ...prev, favoriteType: e.target.value as any }))}
                className="p-2 border rounded-md"
              >
                <option value="quero_comprar">Quero Comprar</option>
                <option value="gostei">Gostei</option>
                <option value="inspiracao">Inspiração</option>
              </select>
            </div>
            <Input
              placeholder="Notas (opcional)"
              value={newItem.notes}
              onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
              <Button onClick={addItemToWishlist}>
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="relative group">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-4xl">👗</div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {item.onSale && (
                      <Badge variant="destructive" className="text-xs">Promoção</Badge>
                    )}
                    {!item.inStock && (
                      <Badge variant="secondary" className="text-xs">Indisponível</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg">
                      R$ {item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        R$ {item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {['high', 'medium', 'low'].map(priority => (
                      <Star
                        key={priority}
                        className={`h-4 w-4 cursor-pointer ${
                          item.priority === priority 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                        onClick={() => updateItemPriority(item.id, priority as any)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Adicionado em {item.addedAt.toLocaleDateString()}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.favoriteType === 'quero_comprar' ? 'Comprar' : 
                     item.favoriteType === 'gostei' ? 'Gostei' : 'Inspiração'}
                  </Badge>
                </div>

                {item.notes && (
                  <p className="text-xs text-gray-600 italic">"{item.notes}"</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="h-8">
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItemFromWishlist(item.id)}
                    className="h-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado Vazio */}
      {filteredItems.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery ? 'Nenhum item encontrado' : 'Sua wishlist está vazia'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Tente ajustar sua busca' 
                : 'Adicione produtos que você gostou ou quer comprar'
              }
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 