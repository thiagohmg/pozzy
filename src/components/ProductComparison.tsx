
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface ProductComparisonProps {
  product: Product;
}

export const ProductComparison = ({ product }: ProductComparisonProps) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const { toast } = useToast();

  const addToCompare = () => {
    if (compareList.length >= 3) {
      toast({
        title: "Limite atingido",
        description: "Você pode comparar no máximo 3 produtos",
        variant: "destructive"
      });
      return;
    }

    if (compareList.some(item => item.id === product.id)) {
      toast({
        title: "Produto já adicionado",
        description: "Este produto já está na comparação"
      });
      return;
    }

    setCompareList([...compareList, product]);
    toast({
      title: "Adicionado à comparação",
      description: `${product.name} foi adicionado para comparação`
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(item => item.id !== productId));
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full btn-standard"
        onClick={addToCompare}
        style={{ 
          height: '44px',
          borderRadius: '12px',
          borderColor: '#A883B7',
          color: '#A883B7'
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Comparar
      </Button>

      {compareList.length > 0 && (
        <div className="fixed bottom-20 right-4 z-40">
          <Button
            onClick={() => setShowComparison(true)}
            className="btn-primary-custom shadow-lg"
            style={{ 
              backgroundColor: '#4C1F4B',
              height: '44px',
              borderRadius: '12px'
            }}
          >
            Comparar ({compareList.length})
          </Button>
        </div>
      )}

      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto card-standard">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="title-primary">Comparação de Produtos</h3>
                <Button variant="ghost" onClick={() => setShowComparison(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {compareList.map((item) => (
                  <div key={item.id} className="card-standard">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="subtitle">{item.name}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCompare(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-small text-gray-600 mb-3">{item.description}</p>
                    <p className="title-primary" style={{ color: '#A883B7' }}>{item.price}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
