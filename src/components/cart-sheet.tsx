
// @ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from 'next/navigation';
import { Button } from "./ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "./ui/sheet";
import { ShoppingBag, X } from "lucide-react";

export function CartSheet() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  }

  return (
    <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
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
    </SheetContent>
  );
}
