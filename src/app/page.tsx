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
      <section className="relative flex h-[50vh] items-center justify-center bg-background text-center text-foreground">
        <div>
          <h1 className="font-headline text-5xl font-bold tracking-tighter md:text-7xl">
            LORVÉ
          </h1>
          <p className="mt-4 font-headline text-lg uppercase tracking-[0.3em] text-muted-foreground md:text-xl">
            Reign with Aura
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-xl leading-relaxed text-foreground/80 md:text-2xl">
            Lorvè is a fragrance house rooted in India's rich perfumery
            heritage, blending the timeless art of traditional scent-making with
            modern luxury and elegance. Every bottle is a heartfelt
            expression—crafted with pride, purity, and purpose—to turn dreams
            into lasting experiences, built on trust and soul.
          </p>
          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-headline tracking-widest text-foreground/60">
              <span>PRIDE</span>
              <span>PURITY</span>
              <span>HONESTY</span>
              <span>SOUL</span>
              <span>HERITAGE</span>
              <span>ELEGANCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Featured Products
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Handpicked for an unforgettable experience.
            </p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <PerfumeCard key={product.id} perfume={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Our collection will appear here soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
