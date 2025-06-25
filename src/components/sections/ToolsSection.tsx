
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ToolsSectionProps {
  activeSubSection?: string;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ activeSubSection }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-2">
          Ferramentas Extras 🔧
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Funcionalidades adicionais em desenvolvimento
        </p>
      </div>

      <Card className="text-center py-12">
        <CardContent>
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            Em breve!
          </h3>
          <p className="text-gray-500">
            Novas ferramentas incríveis serão adicionadas aqui
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
