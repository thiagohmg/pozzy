
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Plus, X, Palette, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface MoodBoardItem {
  id: string;
  type: 'product' | 'inspiration';
  image: string;
  title: string;
  price?: string;
  brand?: string;
}

interface MoodBoardProps {
  userId?: string;
}

export const MoodBoard = ({ userId }: MoodBoardProps) => {
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const mockItems: MoodBoardItem[] = [
    {
      id: '1',
      type: 'product',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=400&fit=crop',
      title: 'Vestido Floral Romântico',
      price: 'R$ 189,90',
      brand: 'Zara'
    },
    {
      id: '2',
      type: 'inspiration',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop',
      title: 'Look Office Chic',
      brand: 'Pinterest'
    },
    {
      id: '3',
      type: 'product',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=400&fit=crop',
      title: 'Blazer Estruturado',
      price: 'R$ 259,90',
      brand: 'Mango'
    }
  ];

  const createBoard = () => {
    if (!newBoardName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Digite um nome para seu mood board",
        variant: "destructive"
      });
      return;
    }

    const newBoard = {
      id: Date.now().toString(),
      name: newBoardName,
      items: [],
      createdAt: new Date(),
      isPublic: false
    };

    setBoards([...boards, newBoard]);
    setSelectedBoard(newBoard);
    setNewBoardName('');
    setIsCreating(false);

    toast({
      title: "Mood Board criado! ✨",
      description: `"${newBoardName}" está pronto para suas inspirações`
    });
  };

  const addItemToBoard = (item: MoodBoardItem) => {
    if (!selectedBoard) return;

    const updatedBoard = {
      ...selectedBoard,
      items: [...selectedBoard.items, item]
    };

    setSelectedBoard(updatedBoard);
    setBoards(boards.map(b => b.id === selectedBoard.id ? updatedBoard : b));

    toast({
      title: "Item adicionado! 💕",
      description: `${item.title} foi adicionado ao seu mood board`
    });
  };

  const shareBoard = () => {
    if (!selectedBoard) return;
    
    navigator.clipboard.writeText(`Confira meu mood board "${selectedBoard.name}" no POZZY!`);
    toast({
      title: "Link copiado! 📱",
      description: "Compartilhe seu mood board com as amigas"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Meus Mood Boards ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Crie quadros de inspiração com seus looks e produtos favoritos
        </p>
      </div>

      {/* Lista de Boards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {boards.map(board => (
          <Card 
            key={board.id}
            className={`cursor-pointer transition-all ${
              selectedBoard?.id === board.id ? 'ring-2 ring-purple-500' : ''
            }`}
            onClick={() => setSelectedBoard(board)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{board.name}</h3>
                <Badge variant="secondary">{board.items.length} itens</Badge>
              </div>
              <div className="grid grid-cols-3 gap-1 h-20">
                {board.items.slice(0, 3).map((item: any, index: number) => (
                  <div key={index} className="bg-gray-100 rounded aspect-square" />
                ))}
                {board.items.length === 0 && (
                  <div className="col-span-3 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Criar Novo Board */}
        <Card className="border-dashed border-2 cursor-pointer hover:border-purple-400" onClick={() => setIsCreating(true)}>
          <CardContent className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Criar Novo Board</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Criação */}
      {isCreating && (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Nome do seu mood board..."
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && createBoard()}
              />
              <Button onClick={createBoard} size="sm">
                <Save className="h-4 w-4 mr-1" />
                Criar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Board Selecionado */}
      {selectedBoard && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <span>{selectedBoard.name}</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={shareBoard}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedBoard.items.length === 0 ? (
              <div className="text-center py-8">
                <Palette className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Seu mood board está vazio. Adicione inspirações abaixo!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {selectedBoard.items.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{item.title}</p>
                      {item.price && <p className="text-xs text-purple-600">{item.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Itens Disponíveis */}
            <div>
              <h4 className="font-medium mb-3">Adicionar ao Board:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockItems.map(item => (
                  <div key={item.id} className="space-y-2">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          onClick={() => addItemToBoard(item)}
                          className="bg-white text-black hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium">{item.title}</p>
                      {item.price && <p className="text-xs text-purple-600">{item.price}</p>}
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
