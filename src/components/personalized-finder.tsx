"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { getRecommendations } from '@/app/actions';
import { getProducts } from '@/lib/products';
import PerfumeCard from './perfume-card';
import { Loader2, Wand2 } from 'lucide-react';
import type { Perfume } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const allProducts = getProducts();

export default function PersonalizedFinder() {
  const [recommendations, setRecommendations] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setHasSearched(true);
    const viewingHistoryRaw = localStorage.getItem('viewingHistory');
    if (!viewingHistoryRaw || JSON.parse(viewingHistoryRaw).length === 0) {
        toast({
            variant: "destructive",
            title: "No viewing history",
            description: "Browse some products first to get personalized recommendations.",
        })
        setIsLoading(false);
        return;
    }

    try {
      const result = await getRecommendations(viewingHistoryRaw);
      const recommendedNames = result.split(',').map(name => name.trim().toLowerCase());
      
      const foundProducts = allProducts.filter(p => recommendedNames.includes(p.name.toLowerCase()));
      setRecommendations(foundProducts);

    } catch (error) {
        console.error("Failed to get recommendations:", error);
        toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Could not fetch recommendations at this time. Please try again later.",
        })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto text-center">
        <Wand2 className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 mb-6 text-center font-headline text-3xl font-bold md:text-4xl">
          Find Your Perfect Scent
        </h2>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          Let our AI analyze your taste and suggest fragrances you're sure to love.
        </p>
        <Button onClick={handleGetRecommendations} disabled={isLoading} size="lg" className="mt-8">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Recommendations...
            </>
          ) : (
            'Get My Recommendations'
          )}
        </Button>
        
        {hasSearched && !isLoading && (
            <div className="mt-16">
                 {recommendations.length > 0 ? (
                    <>
                    <h3 className="font-headline text-2xl mb-8">Based on your activity, we suggest...</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {recommendations.map(perfume => (
                            <PerfumeCard key={perfume.id} perfume={perfume} />
                        ))}
                    </div>
                    </>
                 ) : (
                    <p className="text-muted-foreground">We couldn't find any recommendations based on your history. Keep browsing!</p>
                 )}
            </div>
        )}
      </div>
    </section>
  );
}
