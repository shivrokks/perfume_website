
'use client';

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart-sheet";
import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCartButton() {
  const { cartCount } = useCart();

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <Sheet>
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <SheetTrigger asChild>
              <Button size="lg" className="relative h-14 w-14 rounded-full shadow-lg">
                <ShoppingBag className="h-6 w-6" />
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-6 w-6 justify-center rounded-full p-0 text-sm"
                >
                  {cartCount}
                </Badge>
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
          </motion.div>
          <CartSheet />
        </Sheet>
      )}
    </AnimatePresence>
  );
}
