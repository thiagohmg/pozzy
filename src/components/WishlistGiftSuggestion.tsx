
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from 'lucide-react';

const WishlistGiftSuggestion = () => (
  <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
    <CardContent className="p-4">
      <div className="flex items-center space-x-3">
        <Gift className="h-6 w-6 text-pink-500" />
        <div>
          <h3 className="font-medium text-pink-800 dark:text-pink-200">
            Lista Compartilhável 🎁
          </h3>
          <p className="text-sm text-pink-600 dark:text-pink-400">
            Suas amigas podem ver esta lista e até mesmo presentear você!
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WishlistGiftSuggestion;
