
// Para garantir tipagem consistente e segura
export interface Product {
  id: string; // uuid no banco, trabalhamos como string aqui
  name: string;
  description: string;
  price: number;
  category?: string;
  color?: string;
  brand?: string;
  image_url?: string;
  in_stock?: boolean;
  url?: string;
}
