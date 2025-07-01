export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  gender: 'Men' | 'Women' | 'Unisex';
  notes: string[];
  description: string;
  ingredients: string[];
  featured?: boolean;
  newArrival?: boolean;
}

export interface CartItem extends Perfume {
  quantity: number;
}
