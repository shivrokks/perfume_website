
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
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Filter by category
    if (categoryFilter === 'Perfume') {
      // A product is considered a 'Perfume' if its category is not 'Oils'.
      // This includes items explicitly marked 'Perfume' and uncategorized items.
      products = products.filter(p => p.category !== 'Oils');
    } else if (categoryFilter === 'Oils') {
      // A product is an 'Oil' only if its category is explicitly 'Oils'.
      products = products.filter(p => p.category === 'Oils');
    }

    // Filter by gender
    if (genderFilter !== 'All') {
      products = products.filter(p => p.gender === genderFilter);
    }

    // Filter by price
    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    
    // Sort
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
        // Optional: could add a more sophisticated featured sort
        break;
    }

    return products;
  }, [allProducts, genderFilter, categoryFilter, priceRange, sortOrder]);
  
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
        if (!isNaN(newMin) && newMin >= 0 && newMin <= priceRange[1]) {
            setPriceRange([newMin, priceRange[1]]);
        }
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Number(e.target.value);
        if (!isNaN(newMax) && newMax <= 300 && newMax >= priceRange[0]) {
            setPriceRange([priceRange[0], newMax]);
        }
    };

    return (
        <div className="space-y-8">
             <div>
                <h3 className="font-headline text-lg mb-4">Category</h3>
                <div className="flex flex-col gap-2">
                    {['All', 'Perfume', 'Oils'].map(c => (
                        <Button key={c} variant={categoryFilter === c ? 'default' : 'ghost'} onClick={() => setCategoryFilter(c)} className="justify-start">
                            {c}
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-headline text-lg mb-4">Gender</h3>
                <div className="flex flex-col gap-2">
                    {['All', 'Men', 'Women', 'Unisex'].map(g => (
                        <Button key={g} variant={genderFilter === g ? 'default' : 'ghost'} onClick={() => setGenderFilter(g)} className="justify-start">
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
                            value={priceRange[0]}
                            onChange={handleMinPriceChange}
                            className="pl-6"
                            aria-label="Minimum price"
                        />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                        <Input
                            type="number"
                            value={priceRange[1]}
                            onChange={handleMaxPriceChange}
                            className="pl-6"
                            aria-label="Maximum price"
                        />
                    </div>
                </div>
                <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={300}
                    min={0}
                    step={5}
                />
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
        <div className="hidden lg:flex justify-end mb-4">
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
            key={genderFilter + categoryFilter + priceRange.join('-') + sortOrder}
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
          </div>
        )}
      </main>
    </div>
  );
}
