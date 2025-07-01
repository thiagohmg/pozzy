import { ProductData } from './productSources';

// Configurações de APIs reais
const API_KEYS = {
  MERCADO_LIVRE: process.env.REACT_APP_MERCADO_LIVRE_API_KEY || '',
  GOOGLE_SHOPPING: process.env.REACT_APP_GOOGLE_SHOPPING_API_KEY || '',
  STRIPE: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
  OPENAI: process.env.REACT_APP_OPENAI_API_KEY || ''
};

// Classe para integração real com Mercado Livre
export class RealMercadoLivreAPI {
  private baseUrl = 'https://api.mercadolibre.com';
  private apiKey = API_KEYS.MERCADO_LIVRE;

  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: '50',
        category: 'MLB1430', // Roupas femininas
        sort: 'relevance'
      });

      if (filters?.priceRange) {
        params.append('price', `${filters.priceRange[0]}-${filters.priceRange[1]}`);
      }

      const response = await fetch(`${this.baseUrl}/sites/MLB/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Mercado Livre API error: ${response.status}`);
      }

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

// Classe para integração com Google Shopping
export class RealGoogleShoppingAPI {
  private apiKey = API_KEYS.GOOGLE_SHOPPING;

  async searchProducts(query: string, filters?: any): Promise<ProductData[]> {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        q: query,
        country: 'BR',
        language: 'pt-BR',
        maxResults: '50'
      });

      const response = await fetch(
        `https://www.googleapis.com/shopping/search/v1/public/products?${params}`
      );

      if (!response.ok) {
        throw new Error(`Google Shopping API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items?.map((item: any) => ({
        id: `google_${item.id}`,
        name: item.product.title,
        description: item.product.description,
        price: parseFloat(item.product.inventories?.[0]?.price || '0'),
        originalPrice: parseFloat(item.product.inventories?.[0]?.originalPrice || '0'),
        brand: item.product.brand || 'Google Shopping',
        image_url: item.product.images?.[0]?.link,
        url: item.product.link,
        category: item.product.categories?.[0] || 'Produtos',
        color: item.product.attributes?.find((attr: any) => attr.name === 'color')?.value,
        size: item.product.attributes?.find((attr: any) => attr.name === 'size')?.value,
        in_stock: item.product.inventories?.[0]?.availability === 'in stock',
        source: 'google_shopping',
        source_id: item.id,
        data: item
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar no Google Shopping:', error);
      return [];
    }
  }
}

// Classe para web scraping real
export class RealWebScrapingAPI {
  async scrapeDafiti(query: string): Promise<ProductData[]> {
    try {
      // Usar proxy para evitar CORS
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = `https://www.dafiti.com.br/catalog/?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      const html = await response.text();
      
      const products: ProductData[] = [];
      
      // Regex para extrair produtos da Dafiti
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

  async scrapeNetshoes(query: string): Promise<ProductData[]> {
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = `https://www.netshoes.com.br/busca?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
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
}

// Classe para IA real (OpenAI)
export class RealAIIntegration {
  private apiKey = API_KEYS.OPENAI;

  async analyzePalette(imageData: string): Promise<any> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analise esta foto e determine a paleta de cores ideal para esta pessoa. Retorne um JSON com: season (Primavera, Verão, Outono, Inverno), undertone (Quente, Frio, Neutro), colors.ideal (array de cores hex), colors.avoid (array de cores hex), recommendations (array de strings).'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageData
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (e) {
        // Fallback para análise básica
        return this.fallbackPaletteAnalysis();
      }
    } catch (error) {
      console.error('Erro na análise de paleta:', error);
      return this.fallbackPaletteAnalysis();
    }
  }

  private fallbackPaletteAnalysis() {
    return {
      season: "Primavera",
      undertone: "Quente",
      colors: {
        ideal: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
        avoid: ["#2C3E50", "#7F8C8D", "#8E44AD", "#2C2C54"]
      },
      recommendations: [
        "Cores quentes e vibrantes realçam sua beleza natural",
        "Evite tons muito frios ou acinzentados",
        "Dourado combina melhor que prateado"
      ]
    };
  }

  async generateTryOn(userImage: string, productImage: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Create a realistic image of a person wearing the clothing item from the product image. The person should be in the same pose and lighting as the user image. Make it look natural and professional.`,
          n: 1,
          size: '1024x1024'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI Image API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Erro na geração de try-on:', error);
      return userImage; // Fallback para imagem original
    }
  }
}

// Gerenciador principal de APIs reais
export class RealAPIManager {
  private mercadolivre = new RealMercadoLivreAPI();
  private googleShopping = new RealGoogleShoppingAPI();
  private webScraping = new RealWebScrapingAPI();
  private ai = new RealAIIntegration();

  async searchAllSources(query: string, filters?: any): Promise<ProductData[]> {
    const allProducts: ProductData[] = [];
    
    // Buscar de todas as fontes em paralelo
    const promises = [
      this.mercadolivre.searchProducts(query, filters),
      this.googleShopping.searchProducts(query, filters),
      this.webScraping.scrapeDafiti(query),
      this.webScraping.scrapeNetshoes(query)
    ];

    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allProducts.push(...result.value);
      } else {
        console.error(`Erro na fonte ${index}:`, result.reason);
      }
    });

    return this.removeDuplicates(allProducts);
  }

  async analyzePalette(imageData: string): Promise<any> {
    return this.ai.analyzePalette(imageData);
  }

  async generateTryOn(userImage: string, productImage: string): Promise<string> {
    return this.ai.generateTryOn(userImage, productImage);
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
export const realAPIs = new RealAPIManager(); 