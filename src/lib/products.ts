import { firestore } from './firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import type { Perfume } from './types';

// Helper function to convert Firestore doc to Perfume object
const fromFirestore = (doc): Perfume => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    brand: data.brand,
    price: data.price,
    image: data.image,
    gender: data.gender,
    notes: data.notes,
    description: data.description,
    ingredients: data.ingredients,
    category: data.category,
    size: data.size || 'N/A',
  };
};

export const getProducts = async (): Promise<Perfume[]> => {
  try {
    const productsCollection = collection(firestore, 'products');
    const productSnapshot = await getDocs(productsCollection);
    return productSnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Perfume | null> => {
  try {
    const productDocRef = doc(firestore, 'products', id);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      return fromFirestore(productDoc);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const getProductsByCategory = async (category: string, count: number = 4): Promise<Perfume[]> => {
  try {
    const productsCollection = collection(firestore, 'products');
    const q = query(
      productsCollection, 
      where('category', '==', category),
      orderBy('name'), // Using a stable field for ordering
      limit(count)
    );
    const productSnapshot = await getDocs(q);
    return productSnapshot.docs.map(fromFirestore);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};
