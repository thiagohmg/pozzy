import { ProductData } from './productSources';

// Configurações das APIs
const API_CONFIGS = {
  mercadolivre: {
    baseUrl: 'https://api.mercadolibre.com',
    endpoints: {
      search: '/sites/MLB/search',
      categories: '/sites/MLB/categories',
      product: '/items'
    }
  },
  dafiti: {
    baseUrl: 'https://www.dafiti.com.br',
    apiUrl: 'https://api.dafiti.com.br',
    endpoints: {
      search: '/api/v1/products/search',
      categories: '/api/v1/categories'
    }
  },
  netshoes: {
    baseUrl: 'https://www.netshoes.com.br',
    apiUrl: 'https://api.netshoes.com.br',
    endpoints: {
      search: '/api/v1/products/search',
      categories: '/api/v1/categories'
    }
  },
  renner: {
    baseUrl: 'https://www.renner.com.br',
    apiUrl: 'https://api.renner.com.br',
    endpoints: {
      search: '/api/v1/products',
      categories: '/api/v1/categories'
    }
  }
};

// Classe para integração com Mercado Livre
export class MercadoLivreAPI {
  private baseUrl = API_CONFIGS.mercadolivre.baseUrl;

  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: '50',
        category: 'MLB1430', // Categoria de roupas femininas
        sort: 'relevance'
      });

      if (filters?.priceRange) {
        params.append('price', `${filters.priceRange[0]}-${filters.priceRange[1]}`);
      }

      const response = await fetch(`${this.baseUrl}/sites/MLB/search?${params}`);
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
        category: this.mapCategory(item.category_id),
        color: this.extractColor(item.attributes),
        size: this.extractSize(item.attributes),
        in_stock: item.available_quantity > 0,
        rating: item.seller?.seller_reputation?.transactions?.ratings?.average,
        reviews_count: item.seller?.seller_reputation?.transactions?.total,
        source: 'mercadolivre',
        source_id: item.id,
        data: {
          ...item,
          seller_info: item.seller,
          shipping: item.shipping
        }
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar no Mercado Livre:', error);
      return [];
    }
  }

  private mapCategory(categoryId: string): string {
    const categories: { [key: string]: string } = {
      'MLB1430': 'Roupas Femininas',
      'MLB1431': 'Vestidos',
      'MLB1432': 'Blusas',
      'MLB1433': 'Calças',
      'MLB1434': 'Saias',
      'MLB1435': 'Jaquetas',
      'MLB1436': 'Sapatos',
      'MLB1437': 'Bolsas',
      'MLB1438': 'Acessórios'
    };
    return categories[categoryId] || 'Moda Feminina';
  }

  private extractColor(attributes: any[]): string {
    const colorAttr = attributes?.find((attr: any) => attr.id === 'COLOR');
    return colorAttr?.value_name || '';
  }

  private extractSize(attributes: any[]): string {
    const sizeAttr = attributes?.find((attr: any) => attr.id === 'SIZE');
    return sizeAttr?.value_name || '';
  }
}

// Classe para integração com Dafiti
export class DafitiAPI {
  private baseUrl = API_CONFIGS.dafiti.apiUrl;

  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: '50',
        sort: 'relevance'
      });

      const response = await fetch(`${this.baseUrl}/api/v1/products/search?${params}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        // Fallback para web scraping
        return this.scrapeDafiti(query);
      }

      const data = await response.json();
      return this.parseDafitiProducts(data.products || []);
    } catch (error) {
      console.error('Erro ao buscar na Dafiti:', error);
      return this.scrapeDafiti(query);
    }
  }

  private async scrapeDafiti(query: string): Promise<ProductData[]> {
    try {
      const searchUrl = `https://www.dafiti.com.br/catalog/?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);
      const html = await response.text();
      
      // Parse HTML para extrair produtos (simplificado)
      const products: ProductData[] = [];
      
      // Regex para extrair informações básicas
      const productMatches = html.match(/data-product="([^"]+)"/g);
      
      if (productMatches) {
        for (const match of productMatches.slice(0, 20)) {
          try {
            const productData = JSON.parse(match.replace('data-product="', '').replace('"', ''));
            products.push({
              id: `dafiti_${productData.id}`,
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              originalPrice: productData.original_price,
              brand: productData.brand || 'Dafiti',
              image_url: productData.image,
              url: `https://www.dafiti.com.br${productData.url}`,
              category: productData.category || 'Moda',
              color: productData.color || '',
              size: productData.size || '',
              in_stock: productData.available || true,
              source: 'dafiti',
              source_id: productData.id,
              data: productData
            });
          } catch (e) {
            // Ignorar produtos com erro de parsing
          }
        }
      }
      
      return products;
    } catch (error) {
      console.error('Erro no scraping da Dafiti:', error);
      return [];
    }
  }

  private parseDafitiProducts(products: any[]): ProductData[] {
    return products.map((item: any) => ({
      id: `dafiti_${item.id}`,
      name: item.name,
      description: item.description || '',
      price: item.price,
      originalPrice: item.original_price,
      brand: item.brand || 'Dafiti',
      image_url: item.image,
      url: `https://www.dafiti.com.br${item.url}`,
      category: item.category || 'Moda',
      color: item.color || '',
      size: item.size || '',
      in_stock: item.available || true,
      source: 'dafiti',
      source_id: item.id,
      data: item
    }));
  }
}

// Classe para integração com Netshoes
export class NetshoesAPI {
  private baseUrl = API_CONFIGS.netshoes.apiUrl;

  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: '50',
        sort: 'relevance'
      });

      const response = await fetch(`${this.baseUrl}/api/v1/products/search?${params}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        return this.scrapeNetshoes(query);
      }

      const data = await response.json();
      return this.parseNetshoesProducts(data.products || []);
    } catch (error) {
      console.error('Erro ao buscar na Netshoes:', error);
      return this.scrapeNetshoes(query);
    }
  }

  private async scrapeNetshoes(query: string): Promise<ProductData[]> {
    try {
      const searchUrl = `https://www.netshoes.com.br/busca?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl);
      const html = await response.text();
      
      const products: ProductData[] = [];
      
      // Regex para extrair produtos da Netshoes
      const productMatches = html.match(/data-product="([^"]+)"/g);
      
      if (productMatches) {
        for (const match of productMatches.slice(0, 20)) {
          try {
            const productData = JSON.parse(match.replace('data-product="', '').replace('"', ''));
            products.push({
              id: `netshoes_${productData.id}`,
              name: productData.name,
              description: productData.description || '',
              price: productData.price,
              originalPrice: productData.original_price,
              brand: productData.brand || 'Netshoes',
              image_url: productData.image,
              url: `https://www.netshoes.com.br${productData.url}`,
              category: productData.category || 'Esportes',
              color: productData.color || '',
              size: productData.size || '',
              in_stock: productData.available || true,
              source: 'netshoes',
              source_id: productData.id,
              data: productData
            });
          } catch (e) {
            // Ignorar produtos com erro de parsing
          }
        }
      }
      
      return products;
    } catch (error) {
      console.error('Erro no scraping da Netshoes:', error);
      return [];
    }
  }

  private parseNetshoesProducts(products: any[]): ProductData[] {
    return products.map((item: any) => ({
      id: `netshoes_${item.id}`,
      name: item.name,
      description: item.description || '',
      price: item.price,
      originalPrice: item.original_price,
      brand: item.brand || 'Netshoes',
      image_url: item.image,
      url: `https://www.netshoes.com.br${item.url}`,
      category: item.category || 'Esportes',
      color: item.color || '',
      size: item.size || '',
      in_stock: item.available || true,
      source: 'netshoes',
      source_id: item.id,
      data: item
    }));
  }
}

// Classe para integração com Google Shopping
export class GoogleShoppingAPI {
  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    try {
      // Usar Google Shopping através de web scraping
      const searchUrl = `https://shopping.google.com/search?q=${encodeURIComponent(query)}&tbm=shop`;
      const response = await fetch(searchUrl);
      const html = await response.text();
      
      const products: ProductData[] = [];
      
      // Regex para extrair produtos do Google Shopping
      const productMatches = html.match(/data-product="([^"]+)"/g);
      
      if (productMatches) {
        for (const match of productMatches.slice(0, 30)) {
          try {
            const productData = JSON.parse(match.replace('data-product="', '').replace('"', ''));
            products.push({
              id: `google_${productData.id}`,
              name: productData.title,
              description: productData.description || '',
              price: productData.price,
              originalPrice: productData.original_price,
              brand: productData.brand || 'Google Shopping',
              image_url: productData.image,
              url: productData.url,
              category: productData.category || 'Produtos',
              color: productData.color || '',
              size: productData.size || '',
              in_stock: productData.available || true,
              source: 'google_shopping',
              source_id: productData.id,
              data: productData
            });
          } catch (e) {
            // Ignorar produtos com erro de parsing
          }
        }
      }
      
      return products;
    } catch (error) {
      console.error('Erro ao buscar no Google Shopping:', error);
      return [];
    }
  }
}

// Gerenciador principal de APIs
export class RealProductAPIManager {
  private apis = {
    mercadolivre: new MercadoLivreAPI(),
    dafiti: new DafitiAPI(),
    netshoes: new NetshoesAPI(),
    google: new GoogleShoppingAPI()
  };

  async searchAllSources(query: string, filters?: any): Promise<ProductData[]> {
    const allProducts: ProductData[] = [];
    
    // Buscar de todas as fontes em paralelo
    const promises = Object.entries(this.apis).map(async ([source, api]) => {
      try {
        console.log(`🔍 Buscando em ${source}...`);
        const products = await api.searchProducts(query, filters);
        console.log(`✅ ${source}: ${products.length} produtos encontrados`);
        return products;
      } catch (error) {
        console.error(`❌ Erro em ${source}:`, error);
        return [];
      }
    });

    const results = await Promise.all(promises);
    
    // Combinar todos os resultados
    results.forEach(products => {
      allProducts.push(...products);
    });

    // Remover duplicatas e ordenar por relevância
    return this.removeDuplicates(allProducts);
  }

  private removeDuplicates(products: ProductData[]): ProductData[] {
    const seen = new Set();
    return products.filter(product => {
      const key = `${product.source}_${product.source_id}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

// Instância global
export const realProductAPIs = new RealProductAPIManager(); 