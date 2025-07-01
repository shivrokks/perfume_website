import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import PerfumeCard from '@/components/perfume-card';

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full bg-gradient-to-r from-primary/80 to-accent/20 text-primary-foreground">
        <Image 
          src="https://placehold.co/1800x1200.png" 
          alt="Elegant perfume display" 
          layout="fill" 
          objectFit="cover" 
          className="z-0 opacity-30"
          data-ai-hint="elegant perfume"
        />
        <div className="container mx-auto flex h-full flex-col items-center justify-center text-center relative z-10">
          <h1 className="font-headline text-4xl font-bold md:text-6xl lg:text-7xl">
            Experience LORVÉ
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover a world of exquisite fragrances, crafted for the modern connoisseur.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">Explore The Collection</Link>
          </Button>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Our Collection
            </h2>
             <p className="text-muted-foreground mt-2 text-lg">Explore our curated selection of fine fragrances.</p>
          </div>
          {allProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {allProducts.map((product) => (
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
