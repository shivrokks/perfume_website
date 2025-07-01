"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Perfume } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AddToCartButton from './add-to-cart-button';
import { motion } from 'framer-motion';

interface PerfumeCardProps {
  perfume: Perfume;
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
  }
};

export default function PerfumeCard({ perfume }: PerfumeCardProps) {
  return (
    <motion.div variants={cardVariants} className="h-full">
      <Card className="flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="p-0">
          <Link href={`/products/${perfume.id}`}>
            <div className="relative aspect-square w-full">
              <Image
                src={perfume.image}
                alt={perfume.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                data-ai-hint="perfume bottle"
              />
            </div>
          </Link>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col p-4">
          <div className="flex-grow">
            <Link href={`/products/${perfume.id}`}>
              <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
                {perfume.name}
              </CardTitle>
            </Link>
            <p className="text-sm text-muted-foreground">{perfume.brand}</p>
          </div>
          <p className="mt-2 font-semibold">${perfume.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <AddToCartButton perfume={perfume} />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
