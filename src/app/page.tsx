import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import PerfumeCard from '@/components/perfume-card';

export default async function Home() {
  const allProducts = await getProducts();

  return (
    <div className="flex flex-col">
      <section className="bg-background py-20 sm:py-28">
        <div className="container mx-auto flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-headline text-7xl font-bold tracking-[0.15em] text-foreground md:text-9xl">
            LORVÉ
          </h1>
          <p className="mt-4 text-base font-normal tracking-[0.4em] uppercase text-foreground/80 md:text-lg">
            Reign with Aura
          </p>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-foreground/80">
            Lorvè is a fragrance house rooted in India's rich perfumery heritage, blending the timeless art of traditional scent-making with modern luxury and elegance. Every bottle is a heartfelt expression—crafted with pride, purity, and purpose—to turn dreams into lasting experiences, built on trust and soul.
          </p>
          <div className="mt-16 text-sm font-medium tracking-[0.2em] uppercase text-foreground/60 flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
            <span>Pride</span>
            <span>Purity</span>
            <span>Honesty</span>
            <span>Soul</span>
            <span>Heritage</span>
            <span>Elegance</span>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Discover the Collection
            </h2>
             <p className="text-muted-foreground mt-2 text-lg">Handcrafted fragrances for the discerning individual.</p>
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
