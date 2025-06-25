
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, MessageCircle, User, Calendar, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AIFashionAdvisorProps {
  onAdviceGenerated: (advice: any) => void;
}

export const AIFashionAdvisor = ({ onAdviceGenerated }: AIFashionAdvisorProps) => {
  const [ocasiao, setOcasiao] = useState('');
  const [estilo, setEstilo] = useState('');
  const [clima, setClima] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAdvice = async () => {
    if (!ocasiao || !estilo) {
      toast({
        title: "Informações necessárias",
        description: "Selecione pelo menos a ocasião e seu estilo preferido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simular geração de conselho por IA
    setTimeout(() => {
      const advice = {
        mainRecommendation: "Para um evento social casual, recomendo um look equilibrado entre conforto e elegância.",
        outfit: [
          {
            item: "Blusa social em tecido fluido",
            color: "Azul marinho ou branco",
            reason: "Versátil e elegante para a ocasião"
          },
          {
            item: "Calça de alfaiataria slim",
            color: "Preto ou cinza escuro",
            reason: "Alonga a silhueta e combina com qualquer blusa"
          },
          {
            item: "Sapato scarpin de salto médio",
            color: "Nude ou preto",
            reason: "Confortável para caminhar e elegante"
          }
        ],
        accessories: [
          "Brincos pequenos ou médios",
          "Bolsa estruturada média",
          "Relógio delicado"
        ],
        colorPalette: ["#1e3a8a", "#ffffff", "#000000", "#f5f5dc"],
        styling_tips: [
          "Mantenha a maquiagem natural com um batom mais marcante",
          "Prefira tecidos que não amarrotem facilmente",
          "Uma terceira peça (blazer) pode ser útil para ambientes com ar condicionado"
        ],
        confidence_score: 0.94
      };

      onAdviceGenerated(advice);
      setLoading(false);
      
      toast({
        title: "Conselho gerado! ✨",
        description: "Sua consultoria personalizada está pronta",
      });
    }, 2500);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <h3 className="font-medium">Consultoria Inteligente</h3>
          <MessageCircle className="h-4 w-4 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Ocasião
            </label>
            <Select value={ocasiao} onValueChange={setOcasiao}>
              <SelectTrigger>
                <SelectValue placeholder="Para onde você vai?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trabalho">Trabalho</SelectItem>
                <SelectItem value="evento-social">Evento Social</SelectItem>
                <SelectItem value="festa">Festa/Balada</SelectItem>
                <SelectItem value="casual">Dia a Dia</SelectItem>
                <SelectItem value="encontro">Encontro</SelectItem>
                <SelectItem value="viagem">Viagem</SelectItem>
                <SelectItem value="esporte">Atividade Física</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Seu Estilo
            </label>
            <Select value={estilo} onValueChange={setEstilo}>
              <SelectTrigger>
                <SelectValue placeholder="Como você se define?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classico">Clássico/Elegante</SelectItem>
                <SelectItem value="casual">Casual/Confortável</SelectItem>
                <SelectItem value="moderno">Moderno/Trendy</SelectItem>
                <SelectItem value="boho">Boho/Romântico</SelectItem>
                <SelectItem value="minimalista">Minimalista</SelectItem>
                <SelectItem value="rock">Rock/Alternativo</SelectItem>
                <SelectItem value="colorido">Colorido/Divertido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Clima/Local
            </label>
            <Select value={clima} onValueChange={setClima}>
              <SelectTrigger>
                <SelectValue placeholder="Como está o tempo?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quente">Calor</SelectItem>
                <SelectItem value="frio">Frio</SelectItem>
                <SelectItem value="ameno">Clima Ameno</SelectItem>
                <SelectItem value="chuva">Chuva</SelectItem>
                <SelectItem value="ar-condicionado">Ambiente com Ar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Orçamento (opcional)
            </label>
            <Input
              placeholder="Ex: até R$ 300"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={generateAdvice} 
          disabled={loading || !ocasiao || !estilo}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          {loading ? (
            <Sparkles className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Gerando Conselho...' : 'Receber Consultoria ✨'}
        </Button>
      </CardContent>
    </Card>
  );
};
