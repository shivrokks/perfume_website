import Link from 'next/link';
import { Diamond, Instagram, Twitter, Facebook } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Diamond className="h-8 w-8 text-primary" />
              <span className="font-bold font-headline text-2xl">LORVÉ</span>
            </Link>
            <p className="mt-4 text-sm">
              Crafting memories through the art of perfumery.
            </p>
          </div>
          <div>
            <h3 className="font-headline text-sm font-semibold tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products" className="hover:text-primary transition-colors">All Perfumes</Link></li>
              <li><Link href="/products?gender=Men" className="hover:text-primary transition-colors">For Men</Link></li>
              <li><Link href="/products?gender=Women" className="hover:text-primary transition-colors">For Women</Link></li>
              <li><Link href="/products?gender=Unisex" className="hover:text-primary transition-colors">Unisex</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-sm font-semibold tracking-wider uppercase">About</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-headline text-sm font-semibold tracking-wider uppercase">Newsletter</h3>
             <p className="mt-4 text-sm">Subscribe for exclusive offers and new arrivals.</p>
             <form className="mt-4 flex gap-2">
                <Input type="email" placeholder="Your email" className="bg-background" />
                <Button type="submit" className="bg-primary text-primary-foreground">Subscribe</Button>
             </form>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} LORVÉ. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></Link>
             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></Link>
             <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
