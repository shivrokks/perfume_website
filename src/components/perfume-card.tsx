import Link from 'next/link';
import Image from 'next/image';
import type { Perfume } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import AddToCartButton from './add-to-cart-button';

interface PerfumeCardProps {
  perfume: Perfume;
}

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/products/${perfume.id}`}>
          <div className="relative aspect-square w-full">
            <Image
              src={perfume.image}
              alt={perfume.name}
              fill
              className="object-cover"
              data-ai-hint="perfume bottle"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Link href={`/products/${perfume.id}`}>
          <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
            {perfume.name}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground">{perfume.brand}</p>
        <p className="mt-2 font-semibold">${perfume.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <AddToCartButton perfume={perfume} />
      </CardFooter>
    </Card>
  );
}
