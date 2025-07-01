import { getProductById } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductDetails from '@/components/product-details';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const product = getProductById(params.id)
   
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
