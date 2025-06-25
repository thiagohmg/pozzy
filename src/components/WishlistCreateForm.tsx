
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, X } from 'lucide-react';

interface WishlistCreateFormProps {
  newWishlistName: string;
  setNewWishlistName: (val: string) => void;
  createWishlist: (name: string) => void;
  setIsCreating: (val: boolean) => void;
}

const WishlistCreateForm = ({
  newWishlistName,
  setNewWishlistName,
  createWishlist,
  setIsCreating
}: WishlistCreateFormProps) => (
  <Card className="border-pink-200 bg-pink-50 dark:bg-pink-950">
    <CardContent className="p-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Nome da sua nova lista de desejos..."
          value={newWishlistName}
          onChange={(e) => setNewWishlistName(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && createWishlist(newWishlistName)}
        />
        <Button onClick={() => createWishlist(newWishlistName)} size="sm" className="bg-pink-500 hover:bg-pink-600">
          <Heart className="h-4 w-4 mr-1" />
          Criar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default WishlistCreateForm;
