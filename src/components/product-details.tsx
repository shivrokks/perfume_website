"use client";

import { useEffect, useState } from 'react';
import type { Perfume } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Heart } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ProductDetailsProps {
  product: Perfume;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [oilQuantity, setOilQuantity] = useState(100);
  const [viewingHistory, setViewingHistory] = useState<string[]>([]);

  const isOil = product.category === 'Oils';
  const oilTotalPrice = isOil ? (product.price / 100) * oilQuantity : 0;

  useEffect(() => {
    // Use state instead of localStorage for viewing history
    setViewingHistory(prev => {
      const newHistory = [product.name, ...prev.filter((p: string) => p !== product.name)].slice(0, 10);
      return newHistory;
    });
  }, [product.name]);

  const handleAddToCart = () => {
    const quantityToAdd = isOil ? oilQuantity : 1;
    addToCart(product, quantityToAdd);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setOilQuantity(Math.max(0, value)); // Removed max limit
  };

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
          <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="text-base font-medium">{product.category}</Badge>
              {!isOil && <Badge variant="secondary" className="text-base font-medium">{product.size}</Badge>}
          </div>
          
          {isOil ? (
            <div className="mt-6">
              <p className="text-3xl font-semibold">${product.price.toFixed(2)} <span className="text-lg text-muted-foreground">/ 100ml</span></p>
              <div className="grid w-full max-w-sm items-center gap-2 mt-4">
                <Label htmlFor="quantity">Quantity (ml)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={oilQuantity}
                    onChange={handleQuantityChange}
                    min="0"
                    step="50"
                    className="w-32"
                  />
                  <p className="text-2xl font-semibold">= ${oilTotalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-3xl font-semibold mt-6">${product.price.toFixed(2)}</p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <Button size="lg" onClick={handleAddToCart} className="flex-grow" disabled={isOil && oilQuantity <= 0}>
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
