"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddressSchema, upsertUserAddress, getUserAddress } from '@/app/actions';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, totalPrice, clearCart, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  const form = useForm<z.infer<typeof AddressSchema>>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: '',
    },
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Please Log In',
          description: 'You need to be logged in to proceed to checkout.',
        });
        router.push('/login?redirect=/checkout');
      } else if (cartCount === 0) {
        toast({
          title: 'Your Cart is Empty',
          description: 'Please add items to your cart before checking out.',
        });
        router.push('/products');
      }
    }
  }, [user, authLoading, cartCount, router, toast]);

  useEffect(() => {
    async function fetchAddress() {
      if (user) {
        setIsAddressLoading(true);
        const savedAddress = await getUserAddress(user.uid);
        if (savedAddress) {
          form.reset(savedAddress);
        }
        setIsAddressLoading(false);
      }
    }
    fetchAddress();
  }, [user, form]);
  
  async function onSubmit(values: z.infer<typeof AddressSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      // Save address
      const result = await upsertUserAddress(user.uid, values);
      if (!result.success) {
        throw new Error(result.error || 'Failed to save address.');
      }
      
      // Mock payment process
      toast({
        title: "Processing Payment...",
        description: "Redirecting to confirmation page."
      });

      // Clear cart and redirect
      clearCart();
      router.push('/checkout/success');

    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Checkout Error',
        description: error.message || "An unexpected error occurred.",
      });
       setIsSubmitting(false);
    }
  }
  
  if (authLoading || cartCount === 0 || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Button variant="ghost" onClick={() => router.push('/products')} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shopping
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isAddressLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
              ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="addressLine1" render={({ field }) => (
                    <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input placeholder="123 Perfume Lane" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="addressLine2" render={({ field }) => (
                    <FormItem><FormLabel>Address Line 2 <span className='text-muted-foreground'>(Optional)</span></FormLabel><FormControl><Input placeholder="Apt, suite, etc." {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="New York" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="state" render={({ field }) => (
                      <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input placeholder="NY" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="postalCode" render={({ field }) => (
                      <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="10001" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="United States" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
                   <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>

                  {/* This button is part of the form and triggers submit */}
                  <Button type="submit" size="lg" className="w-full mt-6" disabled={isSubmitting}>
                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Pay Now - ${totalPrice.toFixed(2)}
                  </Button>
                </form>
              </Form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
               <CardDescription>You have {cartCount} item(s) in your cart.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-md border overflow-hidden">
                       <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" data-ai-hint="perfume bottle" />
                       <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-xs rounded-bl-md px-1.5 py-0.5">
                         {item.quantity}
                       </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Shipping</p>
                  <p>Free</p>
                </div>
                 <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxes</p>
                  <p>Calculated at next step</p>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="flex justify-between font-bold text-xl">
                <p>Total</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}