import { useState, useEffect } from 'react';

interface Trend {
  id: string;
  name: string;
  description: string;
  searchQuery: string;
  gradient: string;
  color: string;
  icon: string;
  type: 'fixed' | 'seasonal' | 'viral';
  priority: number;
  isActive: boolean;
}

// Tendências fixas (sempre relevantes)
const FIXED_TRENDS: Trend[] = [
  {
    id: 'minimalist',
    name: 'Minimalismo',
    description: 'Looks clean, neutros e atemporais',
    searchQuery: 'roupas minimalistas neutras básicas clean atemporal',
    gradient: 'from-gray-50 to-slate-50',
    color: 'gray-700',
    icon: '⚪',
    type: 'fixed',
    priority: 1,
    isActive: true
  },
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Estilo elegante e sofisticado',
    searchQuery: 'roupas clássicas elegantes sofisticadas atemporais',
    gradient: 'from-slate-50 to-gray-50',
    color: 'slate-700',
    icon: '👔',
    type: 'fixed',
    priority: 2,
    isActive: true
  },
  {
    id: 'casual',
    name: 'Casual Chic',
    description: 'Conforto com estilo para o dia a dia',
    searchQuery: 'roupas casuais confortáveis estilo dia a dia',
    gradient: 'from-blue-50 to-indigo-50',
    color: 'blue-700',
    icon: '👕',
    type: 'fixed',
    priority: 3,
    isActive: true
  }
];

// Tendências sazonais (mudam conforme época)
const SEASONAL_TRENDS: Trend[] = [
  {
    id: 'summer-2024',
    name: 'Moda Verão 2024',
    description: 'Cores vibrantes, tecidos leves e estampas florais',
    searchQuery: 'vestidos florais cores vibrantes verão 2024 tecidos leves',
    gradient: 'from-yellow-50 to-orange-50',
    color: 'yellow-700',
    icon: '🌺',
    type: 'seasonal',
    priority: 1,
    isActive: true
  },
  {
    id: 'barbiecore',
    name: 'Barbiecore',
    description: 'Rosa, brilho e acessórios divertidos',
    searchQuery: 'roupas rosa brilho acessórios divertidos vestidos pink',
    gradient: 'from-pink-50 to-purple-50',
    color: 'purple-700',
    icon: '💖',
    type: 'seasonal',
    priority: 2,
    isActive: true
  },
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    description: 'Romântico, vintage e inspirado na natureza',
    searchQuery: 'vestidos românticos vintage cottagecore floral natureza',
    gradient: 'from-green-50 to-emerald-50',
    color: 'green-700',
    icon: '🌿',
    type: 'seasonal',
    priority: 3,
    isActive: true
  }
];

// Simulação de API para tendências virais
const fetchViralTrends = async (): Promise<Trend[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Em produção, isso viria de uma API real
  // Ex: Instagram Trends, Pinterest, Google Trends, etc.
  const viralTrends: Trend[] = [
    {
      id: 'tiktok-style',
      name: 'Estilo TikTok',
      description: 'Peças virais, jeans largos e muita criatividade',
      searchQuery: 'jeans largos peças virais tiktok fashion streetwear',
      gradient: 'from-cyan-50 to-blue-50',
      color: 'cyan-700',
      icon: '📱',
      type: 'viral',
      priority: 1,
      isActive: true
    },
    {
      id: 'y2k-revival',
      name: 'Y2K Revival',
      description: 'Anos 2000 de volta com cores neon e brilhos',
      searchQuery: 'roupas y2k anos 2000 neon brilho retro vintage',
      gradient: 'from-purple-50 to-pink-50',
      color: 'pink-700',
      icon: '✨',
      type: 'viral',
      priority: 2,
      isActive: true
    },
    {
      id: 'quiet-luxury',
      name: 'Quiet Luxury',
      description: 'Luxo discreto e sofisticação minimalista',
      searchQuery: 'roupas luxo discreto sofisticado minimalista qualidade',
      gradient: 'from-stone-50 to-neutral-50',
      color: 'stone-700',
      icon: '💎',
      type: 'viral',
      priority: 3,
      isActive: true
    }
  ];

  return viralTrends;
};

// Função para determinar tendências sazonais baseadas na data
const getSeasonalTrends = (): Trend[] => {
  const currentMonth = new Date().getMonth();
  
  // Verão (dezembro a março no Brasil)
  if (currentMonth >= 11 || currentMonth <= 2) {
    return SEASONAL_TRENDS.filter(trend => 
      trend.id === 'summer-2024' || trend.id === 'barbiecore'
    );
  }
  
  // Outono (março a maio)
  if (currentMonth >= 2 && currentMonth <= 4) {
    return [
      {
        id: 'autumn-style',
        name: 'Estilo Outono',
        description: 'Tons terrosos, camadas e texturas',
        searchQuery: 'roupas outono tons terrosos camadas texturas',
        gradient: 'from-amber-50 to-orange-50',
        color: 'amber-700',
        icon: '🍂',
        type: 'seasonal',
        priority: 1,
        isActive: true
      }
    ];
  }
  
  // Inverno (junho a agosto)
  if (currentMonth >= 5 && currentMonth <= 7) {
    return [
      {
        id: 'winter-cozy',
        name: 'Inverno Aconchegante',
        description: 'Looks quentes, casacos e tricôs',
        searchQuery: 'casacos inverno tricôs looks quentes aconchegantes',
        gradient: 'from-slate-50 to-gray-50',
        color: 'slate-700',
        icon: '🧥',
        type: 'seasonal',
        priority: 1,
        isActive: true
      }
    ];
  }
  
  // Primavera (setembro a novembro)
  return [
    {
      id: 'spring-fresh',
      name: 'Primavera Fresca',
      description: 'Cores suaves, flores e renovação',
      searchQuery: 'roupas primavera cores suaves flores renovação',
      gradient: 'from-green-50 to-emerald-50',
      color: 'green-700',
      icon: '🌸',
      type: 'seasonal',
      priority: 1,
      isActive: true
    }
  ];
};

export const useTrends = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Carregar tendências fixas
        const fixedTrends = FIXED_TRENDS.filter(trend => trend.isActive);
        
        // Carregar tendências sazonais baseadas na data
        const seasonalTrends = getSeasonalTrends();
        
        // Carregar tendências virais da API
        const viralTrends = await fetchViralTrends();
        
        // Combinar todas as tendências e ordenar por prioridade
        const allTrends = [
          ...fixedTrends,
          ...seasonalTrends,
          ...viralTrends
        ].sort((a, b) => a.priority - b.priority);

        // Limitar a 6 tendências para não poluir a interface
        const limitedTrends = allTrends.slice(0, 6);
        
        setTrends(limitedTrends);
      } catch (err) {
        console.error('Erro ao carregar tendências:', err);
        setError('Erro ao carregar tendências. Usando tendências padrão.');
        
        // Fallback para tendências fixas em caso de erro
        setTrends(FIXED_TRENDS.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    loadTrends();
  }, []);

  // Função para recarregar tendências (útil para refresh manual)
  const refreshTrends = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const viralTrends = await fetchViralTrends();
      const seasonalTrends = getSeasonalTrends();
      const fixedTrends = FIXED_TRENDS.filter(trend => trend.isActive);
      
      const allTrends = [
        ...fixedTrends,
        ...seasonalTrends,
        ...viralTrends
      ].sort((a, b) => a.priority - b.priority);
      
      setTrends(allTrends.slice(0, 6));
    } catch (err) {
      setError('Erro ao atualizar tendências.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trends,
    isLoading,
    error,
    refreshTrends
  };
}; 