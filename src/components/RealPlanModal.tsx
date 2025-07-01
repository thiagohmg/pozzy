import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Crown, 
  Star, 
  Zap, 
  Sparkles,
  Loader2,
  CreditCard,
  Shield,
  Gift
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePayment } from '@/integrations/payment';
import { supabase } from '@/integrations/supabase/client';

interface Plan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  searchesPerMonth: number;
  stripePriceId: string;
  popular?: boolean;
  savings?: string;
}

interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  searchesUsed: number;
  searchesLimit: number;
  nextBillingDate: Date;
}

export const RealPlanModal: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
  open,
  onOpenChange
}) => {
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [usageStats, setUsageStats] = useState({
    searchesUsed: 0,
    searchesLimit: 5,
    photosSaved: 0,
    palettesCreated: 0,
    wishlistsCreated: 0
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { subscribeToPlan, cancelSubscription, getSubscriptionStatus, loading: paymentLoading, error: paymentError } = usePayment();

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      currency: 'BRL',
      interval: 'month',
      features: [
        '5 buscas por mês',
        'Análise básica de paleta',
        'Try-on básico',
        'Wishlist limitada (10 itens)',
        'Suporte por email'
      ],
      searchesPerMonth: 5,
      stripePriceId: ''
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.90,
      originalPrice: 39.90,
      currency: 'BRL',
      interval: 'month',
      features: [
        'Buscas ilimitadas',
        'Análise avançada de paleta com IA',
        'Try-on virtual completo',
        'Wishlist ilimitada',
        'Recomendações personalizadas',
        'Suporte prioritário',
        'Acesso antecipado a novos recursos',
        'Sem anúncios'
      ],
      searchesPerMonth: -1,
      stripePriceId: 'price_premium_monthly',
      popular: true,
      savings: '25% de desconto'
    },
    {
      id: 'premium_yearly',
      name: 'Premium Anual',
      price: 299.90,
      originalPrice: 478.80,
      currency: 'BRL',
      interval: 'year',
      features: [
        'Todas as funcionalidades Premium',
        '2 meses grátis',
        'Acesso antecipado a novos recursos',
        'Consultoria personalizada mensal',
        'Descontos exclusivos em parceiros',
        'Suporte VIP 24/7',
        'Relatórios detalhados de estilo',
        'Acesso a eventos exclusivos'
      ],
      searchesPerMonth: -1,
      stripePriceId: 'price_premium_yearly',
      savings: '37% de desconto'
    }
  ];

  // Carregar dados do usuário
  useEffect(() => {
    if (open && user) {
      loadUserData();
    }
  }, [open, user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Carregar assinatura atual
      const subscription = await getSubscriptionStatus(user?.id || '');
      setCurrentSubscription(subscription);

      // Carregar estatísticas de uso
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!usageError && usageData) {
        setUsageStats({
          searchesUsed: usageData.searches_used || 0,
          searchesLimit: subscription?.searchesLimit || 5,
          photosSaved: usageData.photos_saved || 0,
          palettesCreated: usageData.palettes_created || 0,
          wishlistsCreated: usageData.wishlists_created || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: Plan) => {
    if (!user) {
      toast({
        title: "Faça login primeiro",
        description: "Você precisa estar logado para assinar um plano",
        variant: "destructive"
      });
      return;
    }

    if (plan.id === 'free') {
      toast({
        title: "Você já está no plano gratuito",
        description: "Escolha um plano pago para mais funcionalidades"
      });
      return;
    }

    setSelectedPlan(plan);
    
    try {
      await subscribeToPlan(plan, user.id);
      // O redirecionamento será feito pelo sistema de pagamento
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
      toast({
        title: "Erro ao processar assinatura",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    try {
      await cancelSubscription(currentSubscription.id);
      setShowCancelConfirm(false);
      
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura será cancelada no final do período atual"
      });

      // Recarregar dados
      loadUserData();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      toast({
        title: "Erro ao cancelar",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  };

  const getCurrentPlan = () => {
    if (!currentSubscription) return plans[0]; // Free
    return plans.find(plan => plan.id === currentSubscription.planId) || plans[0];
  };

  const getRemainingSearches = () => {
    if (!currentSubscription) return 5 - usageStats.searchesUsed;
    if (currentSubscription.searchesLimit === -1) return -1; // Ilimitado
    return Math.max(0, currentSubscription.searchesLimit - usageStats.searchesUsed);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Escolha seu Plano
            </h2>
            <p className="text-gray-600">
              Desbloqueie todo o potencial do Pozzy com nossos planos premium
            </p>
          </div>

          {/* Status Atual */}
          {currentSubscription && (
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      Plano Atual: {getCurrentPlan()?.name}
                    </h3>
                    <p className="text-sm text-blue-600">
                      Status: <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
                        {currentSubscription.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </p>
                    <p className="text-sm text-blue-600">
                      Próxima cobrança: {formatDate(currentSubscription.nextBillingDate)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowCancelConfirm(true)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancelar Assinatura
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estatísticas de Uso */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Seu Uso Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {getRemainingSearches() === -1 ? '∞' : getRemainingSearches()}
                  </p>
                  <p className="text-sm text-gray-500">Buscas restantes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {usageStats.photosSaved}
                  </p>
                  <p className="text-sm text-gray-500">Fotos salvas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {usageStats.palettesCreated}
                  </p>
                  <p className="text-sm text-gray-500">Paletas criadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {usageStats.wishlistsCreated}
                  </p>
                  <p className="text-sm text-gray-500">Wishlists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.planId === plan.id;
              const isPopular = plan.popular;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`relative ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''} ${isPopular ? 'border-orange-300' : ''}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center">
                      {plan.id === 'premium' && <Crown className="h-5 w-5 mr-2 text-yellow-500" />}
                      {plan.id === 'premium_yearly' && <Gift className="h-5 w-5 mr-2 text-purple-500" />}
                      {plan.name}
                    </CardTitle>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold">R$</span>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-500">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
                      </div>
                      {plan.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          R$ {plan.originalPrice}
                        </p>
                      )}
                      {plan.savings && (
                        <Badge variant="secondary" className="mt-2">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isCurrentPlan || paymentLoading}
                      className={`w-full ${
                        isCurrentPlan 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : isPopular 
                            ? 'bg-orange-500 hover:bg-orange-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      {isCurrentPlan ? (
                        'Plano Atual'
                      ) : paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          {plan.price === 0 ? 'Continuar Gratuito' : 'Assinar Agora'}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Garantias */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <h4 className="font-medium">Garantia de 30 dias</h4>
                  <p className="text-sm text-gray-500">
                    Cancele a qualquer momento e receba seu dinheiro de volta
                  </p>
                </div>
                <div>
                  <Zap className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <h4 className="font-medium">Ativação Instantânea</h4>
                  <p className="text-sm text-gray-500">
                    Acesse todas as funcionalidades imediatamente
                  </p>
                </div>
                <div>
                  <Sparkles className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <h4 className="font-medium">Suporte Premium</h4>
                  <p className="text-sm text-gray-500">
                    Atendimento prioritário para assinantes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Fechar
            </Button>
            <Button
              onClick={() => window.open('/faq', '_blank')}
              variant="ghost"
            >
              Ver FAQ
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Cancelamento */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle>Cancelar Assinatura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Tem certeza que deseja cancelar sua assinatura? Você continuará com acesso até o final do período atual.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1"
                >
                  Manter Assinatura
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 