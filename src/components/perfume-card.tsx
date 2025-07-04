"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Perfume } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

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
  const { cartItems, addToCart, updateQuantity } = useCart();
  const itemInCart = cartItems.find((item) => item.id === perfume.id);

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
          <div className="flex justify-between items-center mt-2">
            <p className="font-semibold">${perfume.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">{perfume.size}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {itemInCart ? (
            <div className="flex w-full items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(itemInCart.id, itemInCart.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[2rem] text-center font-bold">{itemInCart.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(itemInCart.id, itemInCart.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button onClick={() => addToCart(perfume)} className="w-full">
              Add to Cart
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
