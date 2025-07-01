import { supabase } from '@/integrations/supabase/client';
import { realAPIs } from '@/integrations/realAPIs';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  brand: string;
  image_url: string;
  url: string;
  category: string;
  color: string;
  size: string;
  in_stock: boolean;
  on_sale: boolean;
  rating: number;
  reviews_count: number;
  source: string;
  source_id: string;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  subscription_plan: string;
  searches_used: number;
  searches_limit: number;
}

export class RealDataSeeder {
  private static instance: RealDataSeeder;
  private isSeeding = false;

  static getInstance(): RealDataSeeder {
    if (!RealDataSeeder.instance) {
      RealDataSeeder.instance = new RealDataSeeder();
    }
    return RealDataSeeder.instance;
  }

  async seedAllData() {
    if (this.isSeeding) {
      console.log('Seeding já em andamento...');
      return;
    }

    this.isSeeding = true;
    console.log('🚀 Iniciando seed de dados reais...');

    try {
      await this.seedProducts();
      await this.seedUsers();
      await this.seedWishlists();
      await this.seedMoodBoards();
      await this.seedUsageData();

      console.log('✅ Seed de dados reais concluído com sucesso!');
    } catch (error) {
      console.error('❌ Erro durante o seed:', error);
      throw error;
    } finally {
      this.isSeeding = false;
    }
  }

  private async seedProducts() {
    console.log('📦 Populando produtos...');

    const categories = [
      'vestidos', 'blusas', 'calças', 'sapatos', 'bolsas', 
      'jaquetas', 'saias', 'shorts', 'camisetas', 'camisas'
    ];

    const brands = [
      'Zara', 'H&M', 'Renner', 'C&A', 'Riachuelo', 'Marisa',
      'Arezzo', 'Netshoes', 'Dafiti', 'Mercado Livre'
    ];

    const colors = [
      'preto', 'branco', 'azul', 'rosa', 'vermelho', 'verde',
      'amarelo', 'roxo', 'laranja', 'bege', 'marrom', 'cinza'
    ];

    const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

    const products: ProductData[] = [];

    // Gerar produtos simulados baseados em dados reais
    for (let i = 0; i < 500; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      const basePrice = Math.random() * 200 + 50; // R$ 50-250
      const onSale = Math.random() > 0.7; // 30% chance de estar em promoção
      const originalPrice = onSale ? basePrice * 1.3 : undefined;
      const finalPrice = onSale ? basePrice : basePrice;

      const product: ProductData = {
        id: `product_${i + 1}`,
        name: this.generateProductName(category, brand),
        description: this.generateProductDescription(category, brand),
        price: Math.round(finalPrice * 100) / 100,
        original_price: originalPrice ? Math.round(originalPrice * 100) / 100 : undefined,
        brand,
        image_url: this.generateProductImage(category, color),
        url: `https://example.com/product/${i + 1}`,
        category,
        color,
        size,
        in_stock: Math.random() > 0.1, // 90% chance de estar em estoque
        on_sale: onSale,
        rating: Math.random() * 2 + 3, // 3-5 estrelas
        reviews_count: Math.floor(Math.random() * 100),
        source: this.getRandomSource(),
        source_id: `source_${i + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      products.push(product);
    }

    // Inserir produtos em lotes
    const batchSize = 50;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('products')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error('Erro ao inserir lote de produtos:', error);
        throw error;
      }

      console.log(`✅ Inseridos ${Math.min(i + batchSize, products.length)} produtos...`);
    }

    console.log(`✅ ${products.length} produtos inseridos com sucesso!`);
  }

  private async seedUsers() {
    console.log('👥 Populando usuários...');

    const users: UserData[] = [
      {
        id: 'user_1',
        email: 'maria.silva@email.com',
        name: 'Maria Silva',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        created_at: new Date().toISOString(),
        subscription_plan: 'premium',
        searches_used: 15,
        searches_limit: -1
      },
      {
        id: 'user_2',
        email: 'ana.santos@email.com',
        name: 'Ana Santos',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        created_at: new Date().toISOString(),
        subscription_plan: 'free',
        searches_used: 3,
        searches_limit: 5
      },
      {
        id: 'user_3',
        email: 'julia.oliveira@email.com',
        name: 'Júlia Oliveira',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        created_at: new Date().toISOString(),
        subscription_plan: 'premium_yearly',
        searches_used: 45,
        searches_limit: -1
      }
    ];

    const { error } = await supabase
      .from('users')
      .upsert(users, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao inserir usuários:', error);
      throw error;
    }

    console.log(`✅ ${users.length} usuários inseridos com sucesso!`);
  }

  private async seedWishlists() {
    console.log('💝 Populando wishlists...');

    const wishlists = [
      {
        id: 'wishlist_1',
        user_id: 'user_1',
        name: 'Look de Verão',
        description: 'Roupas leves e coloridas para o verão',
        theme: 'verão',
        is_public: true,
        items: [
          {
            id: 'item_1',
            name: 'Vestido Floral Midi',
            brand: 'Zara',
            price: 159.90,
            image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
            url: 'https://example.com/product/1',
            priority: 'high',
            favorite_type: 'quero_comprar',
            notes: 'Perfeito para festas de verão'
          }
        ],
        color_palette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        created_at: new Date().toISOString()
      },
      {
        id: 'wishlist_2',
        user_id: 'user_2',
        name: 'Trabalho',
        description: 'Roupas profissionais para o escritório',
        theme: 'trabalho',
        is_public: false,
        items: [],
        color_palette: ['#2C3E50', '#34495E', '#7F8C8D'],
        created_at: new Date().toISOString()
      }
    ];

    const { error } = await supabase
      .from('wishlists')
      .upsert(wishlists, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao inserir wishlists:', error);
      throw error;
    }

    console.log(`✅ ${wishlists.length} wishlists inseridas com sucesso!`);
  }

  private async seedMoodBoards() {
    console.log('🎨 Populando mood boards...');

    const moodBoards = [
      {
        id: 'moodboard_1',
        user_id: 'user_1',
        name: 'Estilo Romântico',
        description: 'Inspirações para looks românticos e femininos',
        theme: 'romântico',
        is_public: true,
        items: [
          {
            id: 'inspiration_1',
            title: 'Vestido Rosa Romântico',
            description: 'Vestido floral em tons de rosa',
            image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
            source_url: 'https://pinterest.com',
            source: 'pinterest',
            category: 'outfit',
            tags: ['romântico', 'floral', 'rosa']
          }
        ],
        color_palette: ['#FFB6C1', '#FFC0CB', '#FF69B4'],
        created_at: new Date().toISOString()
      }
    ];

    const { error } = await supabase
      .from('mood_boards')
      .upsert(moodBoards, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao inserir mood boards:', error);
      throw error;
    }

    console.log(`✅ ${moodBoards.length} mood boards inseridos com sucesso!`);
  }

  private async seedUsageData() {
    console.log('📊 Populando dados de uso...');

    const usageData = [
      {
        user_id: 'user_1',
        searches_used: 15,
        searches_limit: -1,
        photos_saved: 8,
        palettes_created: 3,
        wishlists_created: 2,
        mood_boards_created: 1,
        last_search_date: new Date().toISOString()
      },
      {
        user_id: 'user_2',
        searches_used: 3,
        searches_limit: 5,
        photos_saved: 2,
        palettes_created: 1,
        wishlists_created: 1,
        mood_boards_created: 0,
        last_search_date: new Date().toISOString()
      }
    ];

    const { error } = await supabase
      .from('user_usage')
      .upsert(usageData, { onConflict: 'user_id' });

    if (error) {
      console.error('Erro ao inserir dados de uso:', error);
      throw error;
    }

    console.log(`✅ Dados de uso inseridos com sucesso!`);
  }

  private generateProductName(category: string, brand: string): string {
    const adjectives = ['Elegante', 'Moderno', 'Clássico', 'Feminino', 'Romântico', 'Profissional'];
    const materials = ['Algodão', 'Seda', 'Jeans', 'Malha', 'Tecido'];
    const styles = ['Básico', 'Estampado', 'Liso', 'Floral', 'Geométrico'];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];

    return `${adjective} ${category} ${material} ${style} - ${brand}`;
  }

  private generateProductDescription(category: string, brand: string): string {
    const descriptions = [
      `Perfeito para ocasiões especiais, este ${category} da ${brand} combina conforto e estilo.`,
      `Ideal para o dia a dia, este ${category} oferece versatilidade e elegância.`,
      `Um ${category} atemporal que nunca sai de moda, da renomada marca ${brand}.`,
      `Confortável e estiloso, este ${category} é perfeito para qualquer ocasião.`
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateProductImage(category: string, color: string): string {
    // Usar Unsplash para imagens reais baseadas na categoria e cor
    const baseUrl = 'https://images.unsplash.com/photo-';
    const images = {
      vestidos: '1515372039744-b8f02a3ae446',
      blusas: '1594633312681-425c7b97ccd1',
      calças: '1542272604-787c3835535d',
      sapatos: '1549298916-b41d0d1c2360',
      bolsas: '1553062407-98eeb64c6a62',
      jaquetas: '1551028719-00167b16eac5'
    };

    const imageId = images[category as keyof typeof images] || images.vestidos;
    return `${baseUrl}${imageId}?w=400&fit=crop&crop=center`;
  }

  private getRandomSource(): string {
    const sources = ['mercadolivre', 'dafiti', 'netshoes', 'zara', 'hm'];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  // Método para limpar dados de teste
  async clearTestData() {
    console.log('🧹 Limpando dados de teste...');

    try {
      await supabase.from('products').delete().neq('id', '');
      await supabase.from('wishlists').delete().neq('id', '');
      await supabase.from('mood_boards').delete().neq('id', '');
      await supabase.from('user_usage').delete().neq('user_id', '');

      console.log('✅ Dados de teste removidos com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      throw error;
    }
  }

  // Método para verificar status do banco
  async checkDatabaseStatus() {
    try {
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { count: wishlistsCount } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true });

      console.log('📊 Status do Banco de Dados:');
      console.log(`   Produtos: ${productsCount}`);
      console.log(`   Usuários: ${usersCount}`);
      console.log(`   Wishlists: ${wishlistsCount}`);

      return { productsCount, usersCount, wishlistsCount };
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      throw error;
    }
  }
}

// Exportar instância singleton
export const realDataSeeder = RealDataSeeder.getInstance(); 