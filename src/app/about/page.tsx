import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="font-headline text-base font-semibold uppercase tracking-wider text-primary">Our Story</h2>
          <p className="mt-2 text-4xl font-extrabold tracking-tight font-headline sm:text-5xl">The Essence of LORVÉ</p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-muted-foreground">
            A journey into the heart of fragrance, where tradition meets innovation.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-headline font-extrabold tracking-tight">Our Philosophy</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                At LORVÉ, we believe that perfume is more than just a scent; it is an invisible signature, a story whispered on the skin. Our philosophy is rooted in the art of French perfumery, combining timeless techniques with a contemporary vision. We are dedicated to creating fragrances that are not only beautiful but also deeply personal and evocative.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Each LORVÉ creation is a testament to our commitment to quality, using only the finest raw materials sourced from around the globe. Our master perfumers pour their passion and expertise into every bottle, ensuring a scent experience that is both luxurious and unforgettable.
              </p>
            </div>
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
               <Image
                src="https://placehold.co/800x600.png"
                alt="Perfumery workshop"
                layout="fill"
                objectFit="cover"
                data-ai-hint="perfume workshop"
              />
            </div>
          </div>
        </div>

         <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl md:order-2">
               <Image
                src="https://placehold.co/800x600.png"
                alt="Rare perfume ingredients"
                layout="fill"
                objectFit="cover"
                data-ai-hint="perfume ingredients"
              />
            </div>
            <div className="md:order-1">
              <h3 className="text-3xl font-headline font-extrabold tracking-tight">Our Mission</h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Our mission is to transport you to a world of olfactory wonder. We strive to push the boundaries of scent creation, offering unique and daring compositions that challenge the conventional. We are committed to sustainability and ethical sourcing, ensuring that our passion for perfume respects both people and the planet.
              </p>
               <p className="mt-4 text-lg text-muted-foreground">
                LORVÉ is more than a brand; it is an invitation to explore your own identity through the power of fragrance. We invite you to discover your signature scent and join us on this extraordinary journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
