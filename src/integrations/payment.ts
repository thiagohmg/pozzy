import { loadStripe } from '@stripe/stripe-js';

// Configuração do Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_...';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  searchesPerMonth: number;
  stripePriceId: string;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  searchesUsed: number;
  searchesLimit: number;
}

// Planos disponíveis
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
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
      'Wishlist limitada'
    ],
    searchesPerMonth: 5,
    stripePriceId: ''
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.90,
    currency: 'BRL',
    interval: 'month',
    features: [
      'Buscas ilimitadas',
      'Análise avançada de paleta',
      'Try-on virtual completo',
      'Wishlist ilimitada',
      'Recomendações personalizadas',
      'Suporte prioritário'
    ],
    searchesPerMonth: -1, // Ilimitado
    stripePriceId: 'price_premium_monthly'
  },
  {
    id: 'premium_yearly',
    name: 'Premium Anual',
    price: 299.90,
    currency: 'BRL',
    interval: 'year',
    features: [
      'Todas as funcionalidades Premium',
      '2 meses grátis',
      'Acesso antecipado a novos recursos',
      'Consultoria personalizada'
    ],
    searchesPerMonth: -1,
    stripePriceId: 'price_premium_yearly'
  }
];

// Classe para gerenciar pagamentos
export class PaymentManager {
  private stripe: any = null;

  async initialize() {
    this.stripe = await stripePromise;
    if (!this.stripe) {
      throw new Error('Falha ao carregar Stripe');
    }
  }

  async createCheckoutSession(plan: SubscriptionPlan, userId: string): Promise<string> {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          stripePriceId: plan.stripePriceId,
          userId: userId,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      throw error;
    }
  }

  async redirectToCheckout(sessionId: string) {
    if (!this.stripe) {
      await this.initialize();
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId: sessionId,
    });

    if (error) {
      console.error('Erro no checkout:', error);
      throw error;
    }
  }

  async createSubscription(plan: SubscriptionPlan, userId: string) {
    try {
      const sessionId = await this.createCheckoutSession(plan, userId);
      await this.redirectToCheckout(sessionId);
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscriptionId,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      throw error;
    }
  }

  async getSubscriptionStatus(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await fetch(`/api/subscription-status?userId=${userId}`);
      const data = await response.json();
      
      if (data.subscription) {
        return {
          id: data.subscription.id,
          planId: data.subscription.planId,
          status: data.subscription.status,
          currentPeriodStart: new Date(data.subscription.currentPeriodStart),
          currentPeriodEnd: new Date(data.subscription.currentPeriodEnd),
          searchesUsed: data.subscription.searchesUsed,
          searchesLimit: data.subscription.searchesLimit
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter status da assinatura:', error);
      return null;
    }
  }

  async updateSearchCount(userId: string, searchCount: number) {
    try {
      const response = await fetch('/api/update-search-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          searchCount: searchCount,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar contagem de buscas:', error);
      throw error;
    }
  }

  canUserSearch(userSubscription: UserSubscription | null): boolean {
    if (!userSubscription) {
      // Usuário gratuito - 5 buscas por mês
      return true; // Será verificado no backend
    }

    if (userSubscription.status !== 'active') {
      return false;
    }

    // Premium tem buscas ilimitadas
    if (userSubscription.searchesLimit === -1) {
      return true;
    }

    return userSubscription.searchesUsed < userSubscription.searchesLimit;
  }

  getRemainingSearches(userSubscription: UserSubscription | null): number {
    if (!userSubscription) {
      return 5; // Usuário gratuito
    }

    if (userSubscription.searchesLimit === -1) {
      return -1; // Ilimitado
    }

    return Math.max(0, userSubscription.searchesLimit - userSubscription.searchesUsed);
  }
}

// Hook para usar pagamentos
export function usePayment() {
  const [paymentManager] = useState(() => new PaymentManager());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribeToPlan = async (plan: SubscriptionPlan, userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await paymentManager.createSubscription(plan, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await paymentManager.cancelSubscription(subscriptionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = async (userId: string) => {
    try {
      return await paymentManager.getSubscriptionStatus(userId);
    } catch (err) {
      console.error('Erro ao obter status da assinatura:', err);
      return null;
    }
  };

  return {
    subscribeToPlan,
    cancelSubscription,
    getSubscriptionStatus,
    canUserSearch: paymentManager.canUserSearch.bind(paymentManager),
    getRemainingSearches: paymentManager.getRemainingSearches.bind(paymentManager),
    loading,
    error,
    plans: SUBSCRIPTION_PLANS
  };
}

// Instância global
export const paymentManager = new PaymentManager(); 