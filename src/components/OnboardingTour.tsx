
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, Search, Star, Filter } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Bem-vindo ao Fashion Finder!",
    description: "Encontre roupas perfeitas usando nossa busca inteligente com IA",
    tip: "Digite algo como 'vestido azul para festa' ou use os filtros específicos"
  },
  {
    id: 2,
    icon: Filter,
    title: "Use Filtros Avançados",
    description: "Refine sua busca por categoria, cor, tamanho e faixa de preço",
    tip: "Experimente alternar entre 'Busca Livre' e 'Filtros' no topo"
  },
  {
    id: 3,
    icon: Star,
    title: "Salve seus Favoritos",
    description: "Clique na estrela para salvar produtos que você gostou",
    tip: "Seus favoritos ficam salvos mesmo se você sair do app"
  }
];

export const OnboardingTour = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Icon className="h-6 w-6 text-orange-600" />
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{step.description}</p>
          
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-6">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              💡 <strong>Dica:</strong> {step.tip}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSkip}>
                Pular
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
