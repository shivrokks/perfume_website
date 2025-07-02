
// @ts-nocheck
"use client";

import Link from "next/link";
import { Diamond, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "./ui/sheet";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./user-nav";


const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, totalPrice } = useCart();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  }

  const CartSheetContent = (
    <>
      <SheetHeader className="px-6">
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>
      {cartItems.length > 0 ? (
        <>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                    <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" data-ai-hint="perfume bottle" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => removeFromCart(item.id)}>
                    <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <SheetFooter className="px-6 py-4 bg-secondary mt-auto">
            <div className="w-full space-y-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>Proceed to Checkout</Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button variant="outline" className="w-full">Continue Shopping</Button>
                </SheetClose>
            </div>
        </SheetFooter>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h3 className="font-headline text-xl">Your cart is empty</h3>
          <p className="text-muted-foreground">Add some fragrances to your cart.</p>
          <SheetClose asChild>
            <Button asChild>
                <Link href="/products">Shop Now</Link>
            </Button>
          </SheetClose>
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* DESKTOP: LOGO & NAV */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Diamond className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">LORVÉ</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
             {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === link.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </div>

        {/* MOBILE HEADER */}
        <div className="flex w-full items-center justify-between md:hidden">
          {/* Left: Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-full flex-col">
               <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Diamond className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-lg">LORVÉ</span>
                  </Link>
              </SheetHeader>
              <nav className="mt-8 flex-1">
                 <div className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-lg transition-colors hover:text-foreground/80",
                            pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                    ))}
                 </div>
              </nav>

              {/* ALL ACTIONS INSIDE THE MOBILE MENU */}
              <SheetFooter className="flex-col items-stretch space-y-4 border-t pt-4">
                  {/* Cart trigger for mobile */}
                  <Sheet>
                       <SheetTrigger asChild>
                         <Button variant="outline" className="w-full justify-start text-left relative">
                           <ShoppingBag className="mr-2 h-5 w-5 flex-shrink-0" />
                           My Cart
                           {cartCount > 0 && (
                            <Badge variant="destructive" className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5">{cartCount}</Badge>
                            )}
                         </Button>
                       </SheetTrigger>
                       <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                           {CartSheetContent}
                       </SheetContent>
                    </Sheet>

                  {/* Auth & Theme for mobile */}
                  <div className="flex w-full items-center justify-between">
                     <div onClick={() => setIsMobileMenuOpen(false)}>
                       {loading ? null : user ? <UserNav /> : <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>}
                     </div>
                     <ThemeToggle />
                  </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Diamond className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">LORVÉ</span>
          </Link>

          {/* Right: Spacer to balance menu button */}
          <div className="w-10" />
        </div>

        {/* DESKTOP: ACTIONS */}
        <div className="hidden flex-1 items-center justify-end md:flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-5 w-5 justify-center rounded-full p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                {CartSheetContent}
            </SheetContent>
          </Sheet>

          {loading ? null : user ? (
            <UserNav />
          ) : (
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
