import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AIFashionAdvisor } from "@/components/AIFashionAdvisor";
import { AdviceDisplay } from "@/components/AdviceDisplay";
import { ConsultationWizard } from "@/components/ConsultationWizard";
import { ColorPaletteAnalyzer } from "@/components/ColorPaletteAnalyzer";
import { PaletteResults } from "@/components/PaletteResults";
import { Camera, Upload, Palette, Search, Sparkles } from 'lucide-react';

interface Photo {
  id: string;
  data: string;
  name: string;
}

interface ConsultoriaSectionProps {
  userPhotos: Photo[];
  selectedProduct: any;
  colorPalette: any;
  onSectionChange: (section: string) => void;
  onAdviceGenerated: (advice: any) => void;
  fashionAdvice: any;
  activeSubSection?: string;
  isSetupComplete?: boolean;
  onSetupComplete?: () => void;
  onPaletteAnalyzed?: (palette: any) => void;
}

export const ConsultoriaSection: React.FC<ConsultoriaSectionProps> = ({
  userPhotos,
  selectedProduct,
  colorPalette,
  onSectionChange,
  onAdviceGenerated,
  fashionAdvice,
  activeSubSection,
  isSetupComplete = false,
  onSetupComplete,
  onPaletteAnalyzed
}) => {
  // LOCALSTORAGE STEP KEY
  const WIZARD_STEP_KEY = "consult-wizard-activeStep";

  // Ao iniciar, tenta recuperar do localStorage, senão começa em 'evento'
  const [activeStep, setActiveStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(WIZARD_STEP_KEY);
      return saved || 'evento';
    }
    return 'evento';
  });

  // Novo: evento selecionado
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const isFirstTime = !isSetupComplete;

  // Sempre que o step muda, salva no localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && activeStep) {
      window.localStorage.setItem(WIZARD_STEP_KEY, activeStep);
    }
  }, [activeStep]);

  // Limpa o step salvo quando o setup for completado (para modo livre)
  useEffect(() => {
    if (!isFirstTime) {
      window.localStorage.removeItem(WIZARD_STEP_KEY);
    }
  }, [isFirstTime]);

  // Salvar produto selecionado e fotos no localStorage
  useEffect(() => {
    if (selectedProduct) {
      localStorage.setItem('consult-selectedProduct', JSON.stringify(selectedProduct));
    }
  }, [selectedProduct]);
  useEffect(() => {
    if (userPhotos && userPhotos.length > 0) {
      localStorage.setItem('consult-userPhotos', JSON.stringify(userPhotos));
    }
  }, [userPhotos]);

  // Restaurar produto selecionado e fotos ao carregar
  useEffect(() => {
    const savedProduct = localStorage.getItem('consult-selectedProduct');
    if (savedProduct && !selectedProduct) {
      try {
        onSectionChange && onSectionChange('consultoria');
        // setSelectedProduct não está disponível aqui, mas pode ser passado como prop se necessário
      } catch {}
    }
    const savedPhotos = localStorage.getItem('consult-userPhotos');
    if (savedPhotos && userPhotos.length === 0) {
      try {
        // setUserPhotos não está disponível aqui, mas pode ser passado como prop se necessário
      } catch {}
    }
  }, []);

  const handleStepChange = (stepId: string) => {
    setActiveStep(stepId);
  };

  const handleCompleteSetup = () => {
    if (onSetupComplete) {
      onSetupComplete();
    }
  };

  const handlePaletteAnalyzedLocal = (palette: any) => {
    if (onPaletteAnalyzed) {
      onPaletteAnalyzed(palette);
    }
  };

  // Estilo padronizado para todos os cards do fluxo principal
  const CARD_STANDARD_CARD = "w-full max-w-[400px] min-h-[370px] mx-auto flex flex-col justify-center rounded-2xl shadow-soft";
  const cardWrapperClass = "flex flex-col items-center";
  const CARD_STANDARD_CONTENT = "p-6 flex flex-col flex-1 justify-center";

  const renderStepContent = () => {
    switch (activeStep) {
      case 'evento':
        return (
          <div className={cardWrapperClass}>
            <Card className={CARD_STANDARD_CARD}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  <h3 className="text-lg font-medium">Para qual ocasião você quer consultoria?</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["Casamento", "Trabalho", "Festa", "Viagem", "Encontro", "Dia a dia"].map(ev => (
                    <button
                      key={ev}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${selectedEvent === ev ? 'bg-purple-500 text-white border-purple-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-purple-50'}`}
                      onClick={() => setSelectedEvent(ev)}
                      type="button"
                    >
                      {ev}
                    </button>
                  ))}
                </div>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition ${selectedEvent ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  disabled={!selectedEvent}
                  onClick={() => setActiveStep('palette')}
                  type="button"
                >
                  Avançar
                </button>
              </CardContent>
            </Card>
          </div>
        );

      case 'palette':
        return (
          <div className={cardWrapperClass}>
            <Card className={CARD_STANDARD_CARD}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Passo 1: Sua Paleta de Cores</h3>
                </div>
                
                {/* Sempre mostrar o analisador de paleta */}
                <div className="space-y-4">
                  <ColorPaletteAnalyzer onPaletteAnalyzed={handlePaletteAnalyzedLocal} />
                  
                  {colorPalette && (
                    <div className="mt-4">
                      <PaletteResults 
                        palette={colorPalette} 
                        onNewAnalysis={() => {
                          // Reset para permitir nova análise
                          window.location.reload();
                        }}
                      />
                    </div>
                  )}
                  
                  {colorPalette && isFirstTime && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        ✅ Suas cores estão prontas! Agora vamos para o próximo passo.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'photos':
        return (
          <div className={cardWrapperClass}>
            <Card className={CARD_STANDARD_CARD}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <div className="flex items-center space-x-2 mb-4">
                  <Camera className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Passo 2: Suas Fotos</h3>
                </div>
                
                {userPhotos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-800">
                          {userPhotos.length} foto(s) carregada(s)
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {userPhotos.slice(0, 6).map((photo) => (
                        <div key={photo.id} className="relative aspect-square">
                          <img 
                            src={photo.data} 
                            alt={photo.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {isFirstTime && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          ✅ Fotos carregadas! Agora vamos escolher uma roupa.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 mx-auto mb-2 text-amber-600" />
                    <h4 className="font-medium text-amber-800 mb-2">Adicione suas fotos</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Carregue suas fotos para usar o teste virtual
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-blue-800 mb-2">💡 Dicas para a melhor foto:</h5>
                      <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div className="space-y-2">
                          <p className="text-sm text-blue-700">✅ <strong>Posição ideal:</strong></p>
                          <ul className="text-xs text-blue-600 space-y-1 ml-4">
                            <li>• Fique em pé, de frente para a câmera</li>
                            <li>• Braços relaxados ao lado do corpo</li>
                            <li>• Pés ligeiramente afastados</li>
                            <li>• Olhar diretamente para a câmera</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-blue-700">✅ <strong>Ambiente ideal:</strong></p>
                          <ul className="text-xs text-blue-600 space-y-1 ml-4">
                            <li>• Luz natural (próximo à janela)</li>
                            <li>• Fundo neutro e liso</li>
                            <li>• Roupa bem ajustada ao corpo</li>
                            <li>• Sem sombras no rosto</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-white rounded border">
                        <p className="text-xs text-gray-600 text-center">
                          📸 <strong>Exemplo:</strong> Imagine uma foto de corpo inteiro, como se fosse para um documento, 
                          mas mais relaxada e natural
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onSectionChange('perfil')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Ir para Meu Closet
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'product':
        return (
          <div className={cardWrapperClass}>
            <Card className={CARD_STANDARD_CARD}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Passo 3: Escolher Roupa</h3>
                </div>
                
                {selectedProduct ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-green-800">Produto Selecionado</span>
                      </div>
                      <p className="text-sm text-green-700">{selectedProduct.name}</p>
                      {selectedProduct.paletteMatch && (
                        <p className="text-sm text-green-700">
                          {selectedProduct.paletteMatch}% compatível com sua paleta
                        </p>
                      )}
                    </div>
                    
                    {isFirstTime && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          ✅ Produto escolhido! Agora vamos fazer o teste virtual.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 mx-auto mb-2 text-amber-600" />
                    <h4 className="font-medium text-amber-800 mb-2">Selecione uma roupa</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Busque produtos na seção Descobrir ou escolha dos recomendados
                    </p>
                    <button
                      onClick={() => onSectionChange('descobrir')}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Buscar Produtos
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'tryon':
        return (
          <div className={cardWrapperClass}>
            <Card className={CARD_STANDARD_CARD}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <div className="flex items-center space-x-2 mb-4">
                  <Camera className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Passo 4: Veja o teste virtual</h3>
                </div>
                
                {selectedProduct && userPhotos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      {userPhotos.map((photo) => (
                        <div key={photo.id} className="space-y-2">
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                            <img 
                              src={photo.data} 
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                              <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm">
                                Com {selectedProduct.name}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-center text-gray-600">
                            {photo.name}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {isFirstTime && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600">
                          ✅ Teste virtual realizado! Agora receba dicas personalizadas.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <h4 className="font-medium text-gray-600 mb-2">Teste Virtual Indisponível</h4>
                    <p className="text-sm text-gray-500">
                      Complete os passos anteriores para usar o teste virtual
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'analysis':
        // Dois cards lado a lado no desktop, empilhados no mobile, ambos padronizados.
        return (
          <div className="flex flex-col md:flex-row md:justify-center md:gap-8 items-center w-full">
            <Card className={CARD_STANDARD_CARD + " mb-6 md:mb-0"}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-medium">Consultoria IA</h3>
                </div>
                <AIFashionAdvisor onAdviceGenerated={onAdviceGenerated} />
              </CardContent>
            </Card>
            
            <Card className={CARD_STANDARD_CARD}>
              <CardContent className={CARD_STANDARD_CONTENT}>
                <h3 className="text-lg font-medium mb-4">Suas Dicas Personalizadas</h3>
                <AdviceDisplay advice={fashionAdvice} />
                {!fashionAdvice && (
                  <p className="text-sm text-gray-500">
                    Use a consultoria IA para receber dicas baseadas no seu look
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Consultoria Personalizada
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isFirstTime 
            ? "Seu primeiro passo a passo para a consultoria completa"
            : "Sua consultoria de moda - use livremente"
          }
        </p>
      </div>

      <ConsultationWizard
        isFirstTime={isFirstTime}
        colorPalette={colorPalette}
        userPhotos={userPhotos}
        selectedProduct={selectedProduct}
        onStepChange={handleStepChange}
        onCompleteSetup={handleCompleteSetup}
        activeStep={activeStep}
      />

      <div className="mt-6">
        {renderStepContent()}
      </div>
    </div>
  );
};
