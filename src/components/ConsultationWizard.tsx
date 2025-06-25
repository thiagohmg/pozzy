import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Lock, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
}

interface ConsultationWizardProps {
  isFirstTime: boolean;
  colorPalette: any;
  userPhotos: any[];
  selectedProduct: any;
  onStepChange: (stepId: string) => void;
  onCompleteSetup: () => void;
  activeStep: string;
}

export const ConsultationWizard: React.FC<ConsultationWizardProps> = ({
  isFirstTime,
  colorPalette,
  userPhotos,
  selectedProduct,
  onStepChange,
  onCompleteSetup,
  activeStep
}) => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 'evento',
      title: 'Ocasião',
      description: 'Escolha o evento para sua consultoria',
      completed: false,
      locked: false
    },
    {
      id: 'palette',
      title: 'Paleta de Cores',
      description: 'Suas cores ideais já analisadas',
      completed: false,
      locked: true
    },
    {
      id: 'photos',
      title: 'Suas Fotos',
      description: 'Adicione ou selecione suas fotos',
      completed: false,
      locked: true
    },
    {
      id: 'product',
      title: 'Escolher Roupa',
      description: 'Selecione a peça para experimentar',
      completed: false,
      locked: true
    },
    {
      id: 'tryon',
      title: 'Teste Virtual',
      description: 'Veja como fica em você',
      completed: false,
      locked: true
    },
    {
      id: 'analysis',
      title: 'Análise & Dicas',
      description: 'Receba feedback personalizado',
      completed: false,
      locked: true
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    updateStepsStatus();
  }, [colorPalette, userPhotos, selectedProduct, isFirstTime]);

  const updateStepsStatus = () => {
    setSteps(prevSteps => {
      const updatedSteps = [...prevSteps];
      
      // Passo 0: Evento (sempre disponível)
      updatedSteps[0].completed = activeStep !== 'evento';
      // Passo 1: Paleta (libera se evento escolhido)
      updatedSteps[1].locked = !updatedSteps[0].completed;
      updatedSteps[1].completed = !!colorPalette;
      // Se é primeira vez, usa lógica de bloqueio
      if (isFirstTime) {
        // Passo 2: Fotos (libera se paleta ok)
        updatedSteps[2].locked = !updatedSteps[1].completed;
        updatedSteps[2].completed = userPhotos.length > 0;
        // Passo 3: Produto (libera se fotos ok)
        updatedSteps[3].locked = !updatedSteps[2].completed;
        updatedSteps[3].completed = !!selectedProduct;
        // Passo 4: Try-on (libera se produto ok)
        updatedSteps[4].locked = !updatedSteps[3].completed;
        updatedSteps[4].completed = updatedSteps[3].completed;
        // Passo 5: Análise (libera se try-on ok)
        updatedSteps[5].locked = !updatedSteps[4].completed;
        updatedSteps[5].completed = false;
      } else {
        // Modo livre: todos os passos desbloqueados
        updatedSteps.forEach((step, index) => {
          step.locked = false;
          if (index === 1) step.completed = !!colorPalette;
          if (index === 2) step.completed = userPhotos.length > 0;
          if (index === 3) step.completed = !!selectedProduct;
        });
      }
      
      return updatedSteps;
    });
  };

  const handleStepClick = (step: Step) => {
    if (step.locked) {
      toast({
        title: "Passo bloqueado 🔒",
        description: "Complete o passo anterior para continuar",
        variant: "destructive"
      });
      return;
    }
    
    onStepChange(step.id);
  };

  const handleCompleteSetup = () => {
    const allCompleted = steps.slice(0, 4).every(step => step.completed);
    
    if (allCompleted) {
      onCompleteSetup();
      toast({
        title: "Etapa completa! 🎉",
        description: "Agora você pode usar todas as funcionalidades livremente"
      });
    } else {
      toast({
        title: "Etapa incompleta",
        description: "Complete todos os passos para finalizar",
        variant: "destructive"
      });
    }
  };

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === activeStep);
  };

  const canGoNext = () => {
    const currentIndex = getCurrentStepIndex();
    return currentIndex < steps.length - 1 && !steps[currentIndex + 1].locked;
  };

  const canGoPrev = () => {
    return getCurrentStepIndex() > 0;
  };

  const goToNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (canGoNext()) {
      onStepChange(steps[currentIndex + 1].id);
    }
  };

  const goToPrev = () => {
    const currentIndex = getCurrentStepIndex();
    if (canGoPrev()) {
      onStepChange(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Aviso de primeira vez */}
      {isFirstTime && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Primeira Consultoria - Etapa Inicial
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Vamos te guiar passo a passo na sua primeira consultoria. Após completar, 
                  você poderá usar todas as funcionalidades livremente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div className="flex flex-col items-center w-full mb-6">
        {/* Wrapper para centralizar e limitar largura dos botões */}
        <div className="w-full max-w-[400px] flex flex-col gap-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              disabled={step.locked}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all w-full ${
                activeStep === step.id
                  ? 'bg-purple-500 text-white border-purple-500'
                  : step.completed
                  ? 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200'
                  : step.locked
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              style={{ minHeight: 50 }} // mantém visual confortável
            >
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium">
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : step.locked ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Controles de navegação */}
      <div className="flex justify-between items-center">
        <Button
          onClick={goToPrev}
          disabled={!canGoPrev()}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="text-sm text-gray-500">
          Passo {getCurrentStepIndex() + 1} de {steps.length}
        </div>

        {getCurrentStepIndex() === steps.length - 1 && isFirstTime ? (
          <Button
            onClick={handleCompleteSetup}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            Finalizar Etapa
            <Check className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={goToNext}
            disabled={!canGoNext()}
            size="sm"
          >
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
