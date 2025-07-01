import { supabase } from './supabase/client';

// Tipos para diferentes fontes de produtos
export interface ProductSource {
  id: string;
  name: string;
  type: 'api' | 'scraper' | 'feed' | 'manual';
  baseUrl: string;
  enabled: boolean;
  priority: number;
  lastSync?: Date;
}

export interface ProductData {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  brand: string;
  image_url: string;
  url: string;
  category: string;
  subcategory?: string;
  color?: string;
  size?: string;
  in_stock: boolean;
  rating?: number;
  reviews_count?: number;
  source: string;
  source_id: string;
  data: any;
  created_at?: Date;
}

// Configuração das fontes de produtos
export const PRODUCT_SOURCES: ProductSource[] = [
  // Marketplaces Brasileiros
  {
    id: 'mercadolivre',
    name: 'Mercado Livre',
    type: 'api',
    baseUrl: 'https://api.mercadolibre.com',
    enabled: true,
    priority: 1
  },
  {
    id: 'amazon_br',
    name: 'Amazon Brasil',
    type: 'api',
    baseUrl: 'https://amazon.com.br',
    enabled: true,
    priority: 2
  },
  {
    id: 'dafiti',
    name: 'Dafiti',
    type: 'api',
    baseUrl: 'https://dafiti.com.br',
    enabled: true,
    priority: 3
  },
  {
    id: 'netshoes',
    name: 'Netshoes',
    type: 'api',
    baseUrl: 'https://netshoes.com.br',
    enabled: true,
    priority: 4
  },

  // Lojas de Departamento
  {
    id: 'renner',
    name: 'Renner',
    type: 'api',
    baseUrl: 'https://renner.com.br',
    enabled: true,
    priority: 5
  },
  {
    id: 'riachuelo',
    name: 'Riachuelo',
    type: 'api',
    baseUrl: 'https://riachuelo.com.br',
    enabled: true,
    priority: 6
  },
  {
    id: 'cea',
    name: 'C&A',
    type: 'api',
    baseUrl: 'https://cea.com.br',
    enabled: true,
    priority: 7
  },

  // Fast Fashion Internacional
  {
    id: 'zara',
    name: 'Zara',
    type: 'api',
    baseUrl: 'https://zara.com/br',
    enabled: true,
    priority: 8
  },
  {
    id: 'hm',
    name: 'H&M',
    type: 'api',
    baseUrl: 'https://hm.com/br',
    enabled: true,
    priority: 9
  },
  {
    id: 'forever21',
    name: 'Forever 21',
    type: 'api',
    baseUrl: 'https://forever21.com',
    enabled: true,
    priority: 10
  },
  {
    id: 'shein',
    name: 'Shein',
    type: 'api',
    baseUrl: 'https://shein.com.br',
    enabled: true,
    priority: 11
  },

  // Google Shopping
  {
    id: 'google_shopping',
    name: 'Google Shopping',
    type: 'api',
    baseUrl: 'https://shopping.google.com',
    enabled: true,
    priority: 12
  },

  // Outras Lojas
  {
    id: 'farm',
    name: 'Farm',
    type: 'api',
    baseUrl: 'https://farm.com.br',
    enabled: true,
    priority: 13
  },
  {
    id: 'osklen',
    name: 'Osklen',
    type: 'api',
    baseUrl: 'https://osklen.com',
    enabled: true,
    priority: 14
  },
  {
    id: 'colcci',
    name: 'Colcci',
    type: 'api',
    baseUrl: 'https://colcci.com.br',
    enabled: true,
    priority: 15
  }
];

// Classe principal para gerenciar integrações
export class ProductIntegrationManager {
  private sources: ProductSource[];

  constructor() {
    this.sources = PRODUCT_SOURCES.filter(source => source.enabled);
  }

  // Buscar produtos de todas as fontes
  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    const allProducts: ProductData[] = [];
    
    // Buscar de cada fonte habilitada
    for (const source of this.sources) {
      try {
        const products = await this.searchFromSource(source, query, filters);
        allProducts.push(...products);
      } catch (error) {
        console.error(`Erro ao buscar de ${source.name}:`, error);
      }
    }

    // Ordenar por relevância e preço
    return this.rankProducts(allProducts, query);
  }

  // Buscar produtos de uma fonte específica
  private async searchFromSource(source: ProductSource, query: string, filters?: any): Promise<ProductData[]> {
    switch (source.id) {
      case 'mercadolivre':
        return this.searchMercadoLivre(query, filters);
      case 'amazon_br':
        return this.searchAmazon(query, filters);
      case 'dafiti':
        return this.searchDafiti(query, filters);
      case 'zara':
        return this.searchZara(query, filters);
      case 'hm':
        return this.searchHM(query, filters);
      case 'google_shopping':
        return this.searchGoogleShopping(query, filters);
      default:
        return this.searchGeneric(source, query, filters);
    }
  }

  // Integração com Mercado Livre
  private async searchMercadoLivre(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const response = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}&limit=50`
      );
      const data = await response.json();
      
      return data.results?.map((item: any) => ({
        id: `ml_${item.id}`,
        name: item.title,
        description: item.condition,
        price: item.price,
        originalPrice: item.original_price,
        brand: item.seller?.eshop?.nick_name || 'Mercado Livre',
        image_url: item.thumbnail,
        url: item.permalink,
        category: item.category_id,
        color: item.attributes?.find((attr: any) => attr.id === 'COLOR')?.value_name,
        size: item.attributes?.find((attr: any) => attr.id === 'SIZE')?.value_name,
        in_stock: item.available_quantity > 0,
        rating: item.seller?.seller_reputation?.transactions?.ratings?.average,
        reviews_count: item.seller?.seller_reputation?.transactions?.total,
        source: 'mercadolivre',
        source_id: item.id,
        data: item
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar no Mercado Livre:', error);
      return [];
    }
  }

  // Integração com Amazon
  private async searchAmazon(query: string, filters?: any): Promise<ProductData[]> {
    // Amazon requer API key - implementação básica
    try {
      const response = await fetch(
        `https://amazon.com.br/s?k=${encodeURIComponent(query)}&i=fashion`
      );
      // Parse HTML response (simplificado)
      return [];
    } catch (error) {
      console.error('Erro ao buscar na Amazon:', error);
      return [];
    }
  }

  // Integração com Dafiti
  private async searchDafiti(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const response = await fetch(
        `https://dafiti.com.br/catalog/?q=${encodeURIComponent(query)}`
      );
      // Parse response
      return [];
    } catch (error) {
      console.error('Erro ao buscar na Dafiti:', error);
      return [];
    }
  }

  // Integração com Zara
  private async searchZara(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const response = await fetch(
        `https://zara.com/br/search?searchTerm=${encodeURIComponent(query)}`
      );
      // Parse response
      return [];
    } catch (error) {
      console.error('Erro ao buscar na Zara:', error);
      return [];
    }
  }

  // Integração com H&M
  private async searchHM(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const response = await fetch(
        `https://hm.com/br/search?q=${encodeURIComponent(query)}`
      );
      // Parse response
      return [];
    } catch (error) {
      console.error('Erro ao buscar na H&M:', error);
      return [];
    }
  }

  // Integração com Google Shopping
  private async searchGoogleShopping(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const response = await fetch(
        `https://shopping.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`
      );
      // Parse response
      return [];
    } catch (error) {
      console.error('Erro ao buscar no Google Shopping:', error);
      return [];
    }
  }

  // Busca genérica para outras fontes
  private async searchGeneric(source: ProductSource, query: string, filters?: any): Promise<ProductData[]> {
    try {
      const response = await fetch(
        `${source.baseUrl}/search?q=${encodeURIComponent(query)}`
      );
      // Parse response genérico
      return [];
    } catch (error) {
      console.error(`Erro ao buscar em ${source.name}:`, error);
      return [];
    }
  }

  // Rankear produtos por relevância
  private rankProducts(products: ProductData[], query: string): ProductData[] {
    return products.sort((a, b) => {
      // Score baseado em múltiplos fatores
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
      return scoreB - scoreA;
    });
  }

  // Calcular score de relevância
  private calculateRelevanceScore(product: ProductData, query: string): number {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Nome do produto
    if (product.name.toLowerCase().includes(queryLower)) {
      score += 10;
    }
    
    // Descrição
    if (product.description?.toLowerCase().includes(queryLower)) {
      score += 5;
    }
    
    // Categoria
    if (product.category.toLowerCase().includes(queryLower)) {
      score += 3;
    }
    
    // Preço (produtos mais baratos ganham pontos)
    if (product.price < 100) score += 2;
    else if (product.price < 200) score += 1;
    
    // Rating
    if (product.rating && product.rating > 4) score += 2;
    
    // Disponibilidade
    if (product.in_stock) score += 1;
    
    return score;
  }

  // Salvar produtos no banco
  async saveProducts(products: ProductData[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .upsert(products, { onConflict: 'id' });
      
      if (error) {
        console.error('Erro ao salvar produtos:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar produtos:', error);
    }
  }

  // Sincronizar produtos de todas as fontes
  async syncAllSources(): Promise<void> {
    console.log('Iniciando sincronização de todas as fontes...');
    
    for (const source of this.sources) {
      try {
        console.log(`Sincronizando ${source.name}...`);
        await this.syncSource(source);
      } catch (error) {
        console.error(`Erro ao sincronizar ${source.name}:`, error);
      }
    }
  }

  // Sincronizar uma fonte específica
  private async syncSource(source: ProductSource): Promise<void> {
    // Implementar sincronização específica para cada fonte
    // Por enquanto, apenas atualizar timestamp
    source.lastSync = new Date();
  }
}

// Instância global
export const productManager = new ProductIntegrationManager(); 