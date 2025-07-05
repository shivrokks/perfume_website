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
      <section className="bg-secondary py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-headline text-7xl font-bold tracking-[0.15em] text-foreground md:text-9xl">
              LORVÉ
            </h1>
            <p className="mt-4 text-base font-normal tracking-[0.4em] uppercase text-primary md:text-lg">
              Reign with Aura
            </p>
            <p className="mt-10 max-w-2xl mx-auto text-lg leading-relaxed text-muted-foreground">
              Lorvè is a fragrance house rooted in India's rich perfumery heritage, blending the timeless art of traditional scent-making with modern luxury and elegance. Every bottle is a heartfelt expression—crafted with pride, purity, and purpose—to turn dreams into lasting experiences, built on trust and soul.
            </p>
            <div className="mt-12">
               <Button asChild size="lg">
                <Link href="/products">Explore the Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Our Signature Scents
            </h2>
             <p className="text-muted-foreground mt-2 text-lg">Handcrafted fragrances for the discerning individual.</p>
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
      
      {/* Philosophy Section */}
      <section className="bg-secondary">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
              <div className="relative h-96 md:h-[600px] w-full order-last md:order-first">
                   <Image
                    src="https://placehold.co/800x1200.png"
                    alt="Mughal-inspired archway with intricate patterns"
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="mughal architecture"
                  />
              </div>
              <div className="py-20 px-8 text-center md:text-left">
                  <h2 className="font-headline text-base font-semibold uppercase tracking-wider text-primary">Philosophy</h2>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">Pride & Purity</p>
                  <p className="mt-6 text-lg text-muted-foreground">
                      We believe that a true fragrance is a bridge to our heritage. Our scents are crafted with the soul of India's ancient traditions, using the purest ingredients and time-honored techniques. Each bottle is an ode to elegance, a whisper of history, and a signature of your own personal legacy.
                  </p>
                   <div className="mt-10 flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-4 text-sm font-medium tracking-[0.2em] uppercase text-foreground/60">
                    <span>Pride</span>
                    <span>Purity</span>
                    <span>Honesty</span>
                    <span>Soul</span>
                    <span>Heritage</span>
                    <span>Elegance</span>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
}
