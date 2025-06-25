
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Palette, Star, Lightbulb } from 'lucide-react';

interface AdviceDisplayProps {
  advice: any;
}

export const AdviceDisplay = ({ advice }: AdviceDisplayProps) => {
  if (!advice) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950 dark:to-pink-950">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-6 w-6 text-orange-500" />
          <h3 className="text-lg font-semibold">Sua Consultoria Personalizada</h3>
          <Badge variant="secondary" className="ml-auto">
            {Math.round(advice.confidence_score * 100)}% confiança
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Recomendação Principal */}
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              💫 Recomendação Principal
            </h4>
            <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-lg">
              {advice.mainRecommendation}
            </p>
          </div>

          {/* Look Sugerido */}
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              👗 Look Completo
            </h4>
            <div className="grid gap-3">
              {advice.outfit.map((item: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-orange-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{item.item}</p>
                      <p className="text-sm text-orange-600 dark:text-orange-400">{item.color}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic max-w-xs text-right">
                      {item.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acessórios */}
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              ✨ Acessórios Recomendados
            </h4>
            <div className="flex flex-wrap gap-2">
              {advice.accessories.map((accessory: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-white dark:bg-gray-800">
                  {accessory}
                </Badge>
              ))}
            </div>
          </div>

          {/* Paleta de Cores */}
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              <Palette className="h-4 w-4 inline mr-1" />
              Paleta de Cores
            </h4>
            <div className="flex space-x-2">
              {advice.colorPalette.map((color: string, index: number) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Dicas de Styling */}
          <div>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
              <Lightbulb className="h-4 w-4 inline mr-1" />
              Dicas Especiais
            </h4>
            <ul className="space-y-2">
              {advice.styling_tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
