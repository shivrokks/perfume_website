
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/products';
import DynamicProductShowcase from '@/components/dynamic-product-showcase';

export default async function Home() {

  return (
    <div className="flex flex-col">
      {/* Combined Hero and Story Section */}
      <section className="bg-background py-24 sm:py-32">
        <div className="container mx-auto max-w-4xl text-center">
            {/* Hero Part */}
            <div>
              <div className="flex justify-center items-center gap-4">
                <Image src="https://res.cloudinary.com/dbwvn4eu9/image/upload/v1752211770/kk_logo-removebg-preview_ysrakm.png" alt="LORVÉ logo" width={80} height={80} className="h-12 w-12 md:h-20 md:w-20" />
                <h1 className="font-headline text-5xl font-bold tracking-tighter md:text-7xl">
                  LORVÉ
                </h1>
              </div>
              <p className="mt-4 font-headline text-lg uppercase tracking-[0.3em] text-muted-foreground md:text-xl">
                Reign with Aura
              </p>
            </div>

            {/* Story Part */}
            <div className="mt-12 md:mt-16">
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
        </div>
      </section>

      {/* Dynamic Products Section */}
      <DynamicProductShowcase />
    </div>
  );
}
