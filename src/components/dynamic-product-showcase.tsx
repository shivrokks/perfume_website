
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Perfume } from '@/lib/types';
import { getProductsForShowcase } from '@/app/actions';
import PerfumeCard from '@/components/perfume-card';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const categories = ['Body Perfume', 'Arabic Attar', 'Essential Oil', 'Fragrance Oil', 'Floral Water', 'Flavored Oils'];

export default function DynamicProductShowcase() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [products, setProducts] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const fetchProducts = useCallback(async (category: string) => {
    setIsLoading(true);
    try {
      const fetchedProducts = await getProductsForShowcase(category);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error(`Failed to fetch products for ${category}`, error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory, fetchProducts]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const currentIndex = categories.indexOf(activeCategory);
      const nextIndex = (currentIndex + 1) % categories.length;
      setActiveCategory(categories[nextIndex]);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [activeCategory, isPaused]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const ProductGrid = () => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="aspect-square w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                ))}
            </div>
        );
    }
    
    if (products.length === 0) {
        return (
            <div className="col-span-full flex items-center justify-center text-center h-48 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">No products found in this category yet.</p>
            </div>
        )
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
                {products.map((product) => (
                    <PerfumeCard key={product.id} perfume={product} />
                ))}
            </motion.div>
        </AnimatePresence>
    );
  };

  return (
    <section 
        className="bg-secondary py-16 sm:py-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            Explore Our Collections
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            A scent for every story.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => handleCategoryClick(cat)}
              className="transition-all duration-300"
            >
              {cat}
            </Button>
          ))}
        </div>
        
        <div className="relative min-h-[450px]">
            <ProductGrid />
        </div>
      </div>
    </section>
  );
}
