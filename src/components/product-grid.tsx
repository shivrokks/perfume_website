"use client";

import { useState, useMemo } from 'react';
import type { Perfume } from '@/lib/types';
import PerfumeCard from './perfume-card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet';
import { motion } from 'framer-motion';
import { Input } from './ui/input';

interface ProductGridProps {
  allProducts: Perfume[];
}

export default function ProductGrid({ allProducts }: ProductGridProps) {
  const searchParams = useSearchParams();

  const [sortOrder, setSortOrder] = useState('featured');
  const [genderFilter, setGenderFilter] = useState(searchParams.get('gender') || 'All');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  
  // Calculate price range based on actual products
  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return [0, 300];
    const prices = allProducts.map(p => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    return [minPrice, maxPrice];
  }, [allProducts]);

  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 300]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Update price range when products change
  useMemo(() => {
    if (allProducts.length > 0) {
      setSelectedPriceRange([priceRange[0], priceRange[1]]);
    }
  }, [priceRange, allProducts]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category - Fixed logic
    if (categoryFilter !== 'All') {
      if (categoryFilter === 'Oils') {
        products = products.filter(p => p.category === 'Oils');
      } else if (categoryFilter === 'Perfume') {
        // Include products that are explicitly "Perfume" category or have no category specified
        products = products.filter(p => p.category === 'Perfume' || p.category === '' || p.category === undefined);
      } else {
        // For any other specific category
        products = products.filter(p => p.category === categoryFilter);
      }
    }

    // Filter by gender
    if (genderFilter !== 'All') {
      products = products.filter(p => p.gender === genderFilter);
    }

    // Filter by price - Fixed to use selectedPriceRange
    products = products.filter(p => p.price >= selectedPriceRange[0] && p.price <= selectedPriceRange[1]);
    
    // Sort products
    switch (sortOrder) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        // Keep original order for featured
        break;
    }

    return products;
  }, [allProducts, genderFilter, categoryFilter, selectedPriceRange, sortOrder]);

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    const categories = new Set(allProducts.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(categories)];
  }, [allProducts]);

  // Get unique genders from products
  const availableGenders = useMemo(() => {
    const genders = new Set(allProducts.map(p => p.gender).filter(Boolean));
    return ['All', ...Array.from(genders)];
  }, [allProducts]);
  
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const FilterPanel = () => {
    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Number(e.target.value);
        if (!isNaN(newMin) && newMin >= 0 && newMin <= selectedPriceRange[1]) {
            setSelectedPriceRange([newMin, selectedPriceRange[1]]);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Number(e.target.value);
        if (!isNaN(newMax) && newMax <= priceRange[1] && newMax >= selectedPriceRange[0]) {
            setSelectedPriceRange([selectedPriceRange[0], newMax]);
        }
    };

    const handleSliderChange = (value: number[]) => {
        setSelectedPriceRange([value[0], value[1]]);
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-headline text-lg mb-4">Category</h3>
                <div className="flex flex-col gap-2">
                    {availableCategories.map(c => (
                        <Button 
                            key={c} 
                            variant={categoryFilter === c ? 'default' : 'ghost'} 
                            onClick={() => setCategoryFilter(c)} 
                            className="justify-start"
                        >
                            {c}
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-headline text-lg mb-4">Gender</h3>
                <div className="flex flex-col gap-2">
                    {availableGenders.map(g => (
                        <Button 
                            key={g} 
                            variant={genderFilter === g ? 'default' : 'ghost'} 
                            onClick={() => setGenderFilter(g)} 
                            className="justify-start"
                        >
                            {g}
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-headline text-lg mb-4">Price Range</h3>
                <div className="flex items-center gap-2 mb-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <Input
                            type="number"
                            value={selectedPriceRange[0]}
                            onChange={handleMinPriceChange}
                            min={0}
                            max={priceRange[1]}
                            className="pl-6"
                            aria-label="Minimum price"
                        />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <Input
                            type="number"
                            value={selectedPriceRange[1]}
                            onChange={handleMaxPriceChange}
                            min={0}
                            max={priceRange[1]}
                            className="pl-6"
                            aria-label="Maximum price"
                        />
                    </div>
                </div>
                <Slider
                    value={selectedPriceRange}
                    onValueChange={handleSliderChange}
                    max={priceRange[1]}
                    min={priceRange[0]}
                    step={5}
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Desktop Filters */}
      <aside className="hidden lg:block lg:col-span-1">
        <FilterPanel />
      </aside>

      {/* Mobile Filters */}
      <div className="lg:hidden col-span-full flex justify-between items-center mb-4">
        <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4 overflow-y-auto">
                    <FilterPanel />
                </div>
                <SheetFooter>
                    <Button onClick={() => setIsFiltersOpen(false)} className="w-full">Done</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
        <Select onValueChange={setSortOrder} defaultValue="featured">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
            <SelectItem value="name-desc">Name: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <main className="col-span-full lg:col-span-3">
        <div className="hidden lg:flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedProducts.length} of {allProducts.length} products
          </p>
          <Select onValueChange={setSortOrder} defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="name-desc">Name: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div 
            key={`${genderFilter}-${categoryFilter}-${selectedPriceRange.join('-')}-${sortOrder}`}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAndSortedProducts.map(product => (
              <PerfumeCard key={product.id} perfume={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
              <h2 className="font-headline text-2xl">No Products Found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setGenderFilter('All');
                  setCategoryFilter('All');
                  setSelectedPriceRange([priceRange[0], priceRange[1]]);
                }}
              >
                Reset Filters
              </Button>
          </div>
        )}
      </main>
    </div>
  );
}