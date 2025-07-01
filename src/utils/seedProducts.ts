import { supabase } from '@/integrations/supabase/client';

// Produtos de exemplo para popular o banco
const sampleProducts = [
  // VESTIDOS
  {
    id: 'vestido-1',
    name: 'Vestido Floral Midi',
    description: 'Vestido elegante com estampa floral, perfeito para eventos especiais',
    price: 189.90,
    brand: 'Zara',
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    url: 'https://zara.com/vestido-floral',
    category: 'Vestidos',
    subcategory: 'Vestidos de Festa',
    color: 'Azul',
    size: 'M',
    in_stock: true,
    rating: 4.5,
    reviews_count: 128,
    source: 'zara',
    source_id: 'zara-vestido-1',
    data: { original_price: 229.90, discount: 17 }
  },
  {
    id: 'vestido-2',
    name: 'Vestido Preto Básico',
    description: 'Vestido preto versátil para qualquer ocasião',
    price: 89.90,
    brand: 'H&M',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    url: 'https://hm.com/vestido-preto',
    category: 'Vestidos',
    subcategory: 'Vestidos Básicos',
    color: 'Preto',
    size: 'P',
    in_stock: true,
    rating: 4.2,
    reviews_count: 89,
    source: 'hm',
    source_id: 'hm-vestido-2',
    data: { material: 'Algodão', care: 'Lavar a mão' }
  },
  {
    id: 'vestido-3',
    name: 'Vestido Longo de Festa',
    description: 'Vestido longo elegante para casamentos e eventos formais',
    price: 299.90,
    brand: 'Farm',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    url: 'https://farm.com/vestido-longo',
    category: 'Vestidos',
    subcategory: 'Vestidos de Festa',
    color: 'Vermelho',
    size: 'G',
    in_stock: true,
    rating: 4.8,
    reviews_count: 45,
    source: 'farm',
    source_id: 'farm-vestido-3',
    data: { original_price: 399.90, discount: 25 }
  },

  // BLUSAS
  {
    id: 'blusa-1',
    name: 'Blusa Social Branca',
    description: 'Blusa social branca para o trabalho',
    price: 79.90,
    brand: 'Renner',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    url: 'https://renner.com/blusa-social',
    category: 'Blusas',
    subcategory: 'Blusas Sociais',
    color: 'Branco',
    size: 'M',
    in_stock: true,
    rating: 4.3,
    reviews_count: 67,
    source: 'renner',
    source_id: 'renner-blusa-1',
    data: { material: 'Poliester', care: 'Lavar na máquina' }
  },
  {
    id: 'blusa-2',
    name: 'Blusa de Seda',
    description: 'Blusa de seda elegante e confortável',
    price: 159.90,
    brand: 'C&A',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    url: 'https://cea.com/blusa-seda',
    category: 'Blusas',
    subcategory: 'Blusas Elegantes',
    color: 'Rosa',
    size: 'P',
    in_stock: true,
    rating: 4.6,
    reviews_count: 34,
    source: 'cea',
    source_id: 'cea-blusa-2',
    data: { material: 'Seda', care: 'Lavar a seco' }
  },

  // CALÇAS
  {
    id: 'calca-1',
    name: 'Calça Jeans Skinny',
    description: 'Calça jeans skinny moderna',
    price: 129.90,
    brand: 'Zara',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    url: 'https://zara.com/calca-jeans',
    category: 'Calças',
    subcategory: 'Calças Jeans',
    color: 'Azul',
    size: '38',
    in_stock: true,
    rating: 4.4,
    reviews_count: 156,
    source: 'zara',
    source_id: 'zara-calca-1',
    data: { material: 'Denim', stretch: true }
  },
  {
    id: 'calca-2',
    name: 'Calça Social Preta',
    description: 'Calça social preta para o trabalho',
    price: 149.90,
    brand: 'H&M',
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    url: 'https://hm.com/calca-social',
    category: 'Calças',
    subcategory: 'Calças Sociais',
    color: 'Preto',
    size: '40',
    in_stock: true,
    rating: 4.1,
    reviews_count: 78,
    source: 'hm',
    source_id: 'hm-calca-2',
    data: { material: 'Poliester', pockets: 4 }
  },

  // SAIAS
  {
    id: 'saia-1',
    name: 'Saia Midi Plissada',
    description: 'Saia midi plissada elegante',
    price: 99.90,
    brand: 'Forever 21',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    url: 'https://forever21.com/saia-midi',
    category: 'Saias',
    subcategory: 'Saias Midi',
    color: 'Bege',
    size: 'M',
    in_stock: true,
    rating: 4.0,
    reviews_count: 42,
    source: 'forever21',
    source_id: 'forever21-saia-1',
    data: { material: 'Poliester', pleats: true }
  },

  // BLAZERS
  {
    id: 'blazer-1',
    name: 'Blazer Executivo',
    description: 'Blazer executivo para o trabalho',
    price: 199.90,
    brand: 'Renner',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    url: 'https://renner.com/blazer-executivo',
    category: 'Blazers',
    subcategory: 'Blazers Sociais',
    color: 'Cinza',
    size: 'G',
    in_stock: true,
    rating: 4.7,
    reviews_count: 89,
    source: 'renner',
    source_id: 'renner-blazer-1',
    data: { material: 'Lã', lining: true }
  },

  // JAQUETAS
  {
    id: 'jaqueta-1',
    name: 'Jaqueta de Couro',
    description: 'Jaqueta de couro clássica',
    price: 399.90,
    brand: 'Zara',
    image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
    url: 'https://zara.com/jaqueta-couro',
    category: 'Jaquetas',
    subcategory: 'Jaquetas de Couro',
    color: 'Preto',
    size: 'M',
    in_stock: true,
    rating: 4.9,
    reviews_count: 234,
    source: 'zara',
    source_id: 'zara-jaqueta-1',
    data: { material: 'Couro', original_price: 499.90 }
  },

  // SAPATOS
  {
    id: 'sapato-1',
    name: 'Sapato Social Feminino',
    description: 'Sapato social elegante para o trabalho',
    price: 179.90,
    brand: 'Nike',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    url: 'https://nike.com/sapato-social',
    category: 'Sapatos',
    subcategory: 'Sapatos Sociais',
    color: 'Preto',
    size: '36',
    in_stock: true,
    rating: 4.5,
    reviews_count: 167,
    source: 'nike',
    source_id: 'nike-sapato-1',
    data: { material: 'Couro', heel_height: '5cm' }
  },
  {
    id: 'sapato-2',
    name: 'Tênis Casual',
    description: 'Tênis casual confortável',
    price: 129.90,
    brand: 'Adidas',
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    url: 'https://adidas.com/tenis-casual',
    category: 'Sapatos',
    subcategory: 'Tênis',
    color: 'Branco',
    size: '37',
    in_stock: true,
    rating: 4.3,
    reviews_count: 298,
    source: 'adidas',
    source_id: 'adidas-sapato-2',
    data: { material: 'Mesh', sole: 'Borracha' }
  },

  // BOLSAS
  {
    id: 'bolsa-1',
    name: 'Bolsa de Mão',
    description: 'Bolsa de mão elegante',
    price: 89.90,
    brand: 'H&M',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    url: 'https://hm.com/bolsa-mao',
    category: 'Bolsas',
    subcategory: 'Bolsas de Mão',
    color: 'Marrom',
    size: 'Único',
    in_stock: true,
    rating: 4.2,
    reviews_count: 76,
    source: 'hm',
    source_id: 'hm-bolsa-1',
    data: { material: 'Couro sintético', compartments: 3 }
  },

  // ACESSÓRIOS
  {
    id: 'acessorio-1',
    name: 'Óculos de Sol',
    description: 'Óculos de sol estiloso',
    price: 159.90,
    brand: 'Ray-Ban',
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    url: 'https://rayban.com/oculos-sol',
    category: 'Acessórios',
    subcategory: 'Óculos',
    color: 'Preto',
    size: 'Único',
    in_stock: true,
    rating: 4.8,
    reviews_count: 445,
    source: 'rayban',
    source_id: 'rayban-acessorio-1',
    data: { material: 'Acetato', uv_protection: true }
  }
];

// Função para popular o banco com produtos de exemplo
export async function seedProducts() {
  try {
    console.log('Iniciando população do banco com produtos de exemplo...');
    
    // Inserir produtos em lotes
    const { data, error } = await supabase
      .from('products')
      .upsert(sampleProducts, { onConflict: 'id' });

    if (error) {
      console.error('Erro ao inserir produtos:', error);
      return false;
    }

    console.log(`✅ ${sampleProducts.length} produtos inseridos com sucesso!`);
    return true;
  } catch (error) {
    console.error('Erro ao popular banco:', error);
    return false;
  }
}

// Função para verificar quantos produtos existem
export async function checkProductCount() {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Erro ao contar produtos:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Erro ao verificar contagem:', error);
    return 0;
  }
}

// Função para limpar todos os produtos (cuidado!)
export async function clearAllProducts() {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .neq('id', ''); // Deletar todos

    if (error) {
      console.error('Erro ao limpar produtos:', error);
      return false;
    }

    console.log('✅ Todos os produtos foram removidos!');
    return true;
  } catch (error) {
    console.error('Erro ao limpar produtos:', error);
    return false;
  }
} 