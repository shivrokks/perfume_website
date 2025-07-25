
export type ProductCategory = 'Floral Water' | 'Essential Oil' | 'Flavored Oils' | 'Body Perfume' | 'Fragrance Oil' | 'Arabic Attar';

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
  category: ProductCategory;
  size: string;
}

export interface CartItem extends Perfume {
  quantity: number;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}
