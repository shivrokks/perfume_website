
// @ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "./ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./user-nav";
import { CartSheet } from "./cart-sheet";


const navLinks = [
  { href: '/products', label: 'Shop' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const { cartCount } = useCart();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* DESKTOP: LOGO & NAV */}
        <div className="mr-auto hidden md:flex">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Image src="https://res.cloudinary.com/dbwvn4eu9/image/upload/v1752211770/kk_logo-removebg-preview_ysrakm.png" alt="LORVÉ logo" width={100} height={40} className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center space-x-8 text-sm font-medium">
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
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-full flex-col pr-0">
               <SheetHeader className="p-6 pb-0">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image src="https://res.cloudinary.com/dbwvn4eu9/image/upload/v1752211770/kk_logo-removebg-preview_ysrakm.png" alt="LORVÉ logo" width={100} height={40} className="h-10 w-auto" />
                  </Link>
              </SheetHeader>
              <nav className="mt-8 flex-1 px-6">
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
              <SheetFooter className="flex-col items-stretch space-y-4 border-t p-6">
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
                       <CartSheet />
                    </Sheet>

                  {/* Auth & Theme for mobile */}
                  <div className="flex w-full items-center justify-between">
                     <div onClick={() => setIsMobileMenuOpen(false)}>
                       {loading ? null : user ? <UserNav /> : (
                         <div className="flex items-center gap-2">
                           <Button asChild><Link href="/login">Login</Link></Button>
                           <Button asChild variant="outline"><Link href="/signup">Sign Up</Link></Button>
                         </div>
                       )}
                     </div>
                     <ThemeToggle />
                  </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="https://res.cloudinary.com/dbwvn4eu9/image/upload/v1752211770/kk_logo-removebg-preview_ysrakm.png" alt="LORVÉ logo" width={100} height={40} className="h-10 w-auto" />
          </Link>

          {/* Right: Spacer to balance menu button */}
          <div className="w-10" />
        </div>

        {/* DESKTOP: ACTIONS */}
        <div className="hidden flex-1 items-center justify-end gap-2 md:flex">
          {loading ? null : user ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-2">
                <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                    Login
                </Link>
                <Link href="/signup" className={cn(buttonVariants({ variant: "default" }))}>
                    Sign Up
                </Link>
            </div>
          )}

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
                 <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <CartSheet />
          </Sheet>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
