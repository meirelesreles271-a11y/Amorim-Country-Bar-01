import { Product, ProductCategory, Table } from './types';

// COLOQUE O LINK DA SUA LOGO AQUI
// Dica: Como sua logo tem fundo preto, ela ficará perfeita nos fundos escuros do sistema.
export const LOGO_URL = 'https://i.imgur.com/Hj37g4X.png'; // Exemplo temporário. Substitua pelo link da sua imagem.

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cerveja Brahma 600ml',
    description: 'Cerveja gelada tradicional.',
    price: 15.00,
    category: ProductCategory.DRINKS,
    available: true,
    imageUrl: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: 'Picanha na Chapa',
    description: '500g de picanha, acompanha fritas e farofa.',
    price: 89.90,
    category: ProductCategory.PORTIONS,
    available: true,
    imageUrl: 'https://picsum.photos/200/200?random=2'
  },
  {
    id: '3',
    name: 'Batata Frita com Cheddar',
    description: 'Batata crocante com cheddar e bacon.',
    price: 35.00,
    category: ProductCategory.PORTIONS,
    available: true,
    imageUrl: 'https://picsum.photos/200/200?random=3'
  },
  {
    id: '4',
    name: 'Caipirinha de Limão',
    description: 'Cachaça mineira, limão e açúcar.',
    price: 18.00,
    category: ProductCategory.DRINKS,
    available: true,
    imageUrl: 'https://picsum.photos/200/200?random=4'
  },
  {
    id: '5',
    name: 'Escondidinho de Carne Seca',
    description: 'Purê de mandioca com carne seca desfiada.',
    price: 45.00,
    category: ProductCategory.DISHES,
    available: true,
    imageUrl: 'https://picsum.photos/200/200?random=5'
  }
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  status: 'available',
  total: 0,
  items: []
}));