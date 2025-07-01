"use client";

import { useCart } from "@/hooks/use-cart";
import type { Perfume } from "@/lib/types";
import { Button } from "./ui/button";

export default function AddToCartButton({ perfume }: { perfume: Perfume }) {
    const { addToCart } = useCart();
    return (
        <Button onClick={() => addToCart(perfume)} className="w-full">
            Add to Cart
        </Button>
    );
}
