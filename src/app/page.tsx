import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import PerfumeCard from '@/components/perfume-card';

export default async function Home() {
  const allProducts = await getProducts();
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[75vh] bg-cover bg-center text-white" style={{ backgroundImage: "url('https://placehold.co/1600x900.png')" }}>
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center">
          <h1 className="font-headline text-5xl font-bold md:text-7xl">
            The Essence of Elegance
          </h1>
          <p className="mt-4 max-w-2xl text-lg">
            Experience the art of fine perfumery. Discover scents that define you.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">Explore the Collection</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Featured Products
            </h2>
             <p className="text-muted-foreground mt-2 text-lg">Handpicked for an unforgettable experience.</p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <PerfumeCard key={product.id} perfume={product} />
              ))}
            </div>
           ) : (
             <p className="text-center text-muted-foreground">Our collection will appear here soon.</p>
           )}
        </div>
      </section>
    </div>
  );
}
