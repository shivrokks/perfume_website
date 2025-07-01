import { getProductById, getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/product-details';
import type { Metadata } from 'next'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const product = await getProductById(params.id)
   
    if (!product) {
      return {
        title: 'Product not found',
      }
    }
   
    return {
      title: `${product.name} | LORVÉ`,
      description: product.description,
    }
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({ id: product.id }));
}
