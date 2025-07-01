import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFeaturedProducts, getNewArrivals } from '@/lib/products';
import PerfumeCard from '@/components/perfume-card';
import PersonalizedFinder from '@/components/personalized-finder';

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full bg-gradient-to-r from-primary/80 to-accent/20 text-primary-foreground">
        <Image 
          src="https://placehold.co/1800x1200.png" 
          alt="Luxury perfume bottle" 
          layout="fill" 
          objectFit="cover" 
          className="z-0 opacity-20"
          data-ai-hint="perfume bottle"
        />
        <div className="container mx-auto flex h-full flex-col items-center justify-center text-center relative z-10">
          <h1 className="font-headline text-4xl font-bold md:text-6xl lg:text-7xl">
            Experience LORVÉ
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover a world of exquisite fragrances, crafted for the modern connoisseur.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">
            Featured Collection
          </h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                        <Link href={`/products/${product.id}`} className="absolute inset-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            data-ai-hint="perfume bottle"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </Link>
                        <div className="absolute bottom-0 w-full p-4 text-white">
                            <h3 className="font-headline text-xl font-bold">{product.name}</h3>
                            <p className="text-sm">{product.brand}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>
      
      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <PerfumeCard key={product.id} perfume={product} />
            ))}
          </div>
        </div>
      </section>

      <PersonalizedFinder />

    </div>
  );
}
