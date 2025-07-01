import type { Perfume } from './types';

const perfumes: Perfume[] = [
  {
    id: '1',
    name: 'Elysian Bloom',
    brand: 'LORVÉ',
    price: 180,
    image: 'https://placehold.co/600x600.png',
    gender: 'Women',
    notes: ['Jasmine', 'Tuberose', 'Sandalwood'],
    description: 'A captivating floral fragrance that evokes the scent of a blooming garden at dusk. Rich and romantic.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Linalool', 'Limonene'],
    featured: true,
    newArrival: true,
  },
  {
    id: '2',
    name: 'Noir Enigma',
    brand: 'LORVÉ',
    price: 220,
    image: 'https://placehold.co/600x600.png',
    gender: 'Men',
    notes: ['Black Pepper', 'Leather', 'Oud'],
    description: 'A mysterious and intense scent for the modern man. Bold, sophisticated, and unforgettable.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Coumarin', 'Citral'],
    featured: true,
  },
  {
    id: '3',
    name: 'Golden Hour',
    brand: 'LORVÉ',
    price: 195,
    image: 'https://placehold.co/600x600.png',
    gender: 'Unisex',
    notes: ['Bergamot', 'Neroli', 'Amber'],
    description: 'A warm and radiant fragrance that captures the magic of sunset. Uplifting and comforting.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Geraniol', 'Farnesol'],
    featured: true,
    newArrival: true,
  },
  {
    id: '4',
    name: 'Velvet Oud',
    brand: 'LORVÉ',
    price: 250,
    image: 'https://placehold.co/600x600.png',
    gender: 'Unisex',
    notes: ['Rose', 'Oud', 'Praline'],
    description: 'A luxurious and opulent blend of precious woods and delicate florals. Rich, deep, and sensual.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Citronellol', 'Eugenol'],
    featured: true,
  },
  {
    id: '5',
    name: 'Azure Mist',
    brand: 'LORVÉ',
    price: 160,
    image: 'https://placehold.co/600x600.png',
    gender: 'Women',
    notes: ['Sea Salt', 'Sage', 'Ambrette'],
    description: 'A fresh and invigorating scent that recalls a walk along the windswept shore. Crisp and clean.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Linalool', 'Limonene'],
    newArrival: true,
  },
  {
    id: '6',
    name: 'Obsidian Night',
    brand: 'LORVÉ',
    price: 210,
    image: 'https://placehold.co/600x600.png',
    gender: 'Men',
    notes: ['Incense', 'Myrrh', 'Vetiver'],
    description: 'A deep and smoky fragrance that is both powerful and contemplative. For moments of introspection.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Benzyl Benzoate', 'Alpha-Isomethyl Ionone'],
  },
  {
    id: '7',
    name: 'Citrine Dream',
    brand: 'LORVÉ',
    price: 175,
    image: 'https://placehold.co/600x600.png',
    gender: 'Unisex',
    notes: ['Lemon', 'Mandarin', 'Basil'],
    description: 'A vibrant and zesty citrus burst that is instantly uplifting and energizing. Perfect for daytime.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Limonene', 'Citral'],
    newArrival: true,
  },
  {
    id: '8',
    name: 'Imperial Wood',
    brand: 'LORVÉ',
    price: 230,
    image: 'https://placehold.co/600x600.png',
    gender: 'Men',
    notes: ['Cedarwood', 'Tobacco', 'Vanilla'],
    description: 'A regal and commanding scent with a warm, woody heart. The essence of quiet confidence.',
    ingredients: ['Alcohol Denat.', 'Parfum (Fragrance)', 'Aqua (Water)', 'Coumarin', 'Linalool'],
  },
];

export const getProducts = () => perfumes;

export const getProductById = (id: string) => perfumes.find((p) => p.id === id);

export const getFeaturedProducts = () => perfumes.filter((p) => p.featured);

export const getNewArrivals = () => perfumes.filter((p) => p.newArrival);

export const searchProducts = (query: string) => {
  if (!query) return perfumes;
  return perfumes.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
}
