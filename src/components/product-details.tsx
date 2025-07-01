"use client";

import { useEffect } from 'react';
import type { Perfume } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Heart } from 'lucide-react';

interface ProductDetailsProps {
  product: Perfume;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();

  useEffect(() => {
    // Add to viewing history for personalization
    const history = JSON.parse(localStorage.getItem('viewingHistory') || '[]');
    const newHistory = [product.name, ...history.filter((p: string) => p !== product.name)].slice(0, 10);
    localStorage.setItem('viewingHistory', JSON.stringify(newHistory));
  }, [product.name]);

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint="perfume bottle"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">{product.name}</h1>
          <p className="text-xl text-muted-foreground mt-2">{product.brand}</p>
          <p className="text-3xl font-semibold mt-6">${product.price.toFixed(2)}</p>

          <div className="mt-6 flex items-center gap-4">
            <Button size="lg" onClick={() => addToCart(product)} className="flex-grow">
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" aria-label="Add to wishlist">
                <Heart />
            </Button>
          </div>

          <div className="mt-8">
            <Accordion type="single" collapsible defaultValue="description">
              <AccordionItem value="description">
                <AccordionTrigger className="font-headline text-lg">Description</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{product.description}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="notes">
                <AccordionTrigger className="font-headline text-lg">Fragrance Notes</AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-wrap gap-2">
                        {product.notes.map(note => (
                            <Badge key={note} variant="secondary" className="text-sm">{note}</Badge>
                        ))}
                    </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredients">
                <AccordionTrigger className="font-headline text-lg">Ingredients</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                    {product.ingredients.join(', ')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
