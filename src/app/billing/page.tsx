// @ts-nocheck
"use client";

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !user) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You must be logged in to view the billing page.',
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your subscription and payment details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the free plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
             <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Unlimited product browsing
                </li>
                <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Save items to cart
                </li>
                 <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Standard checkout
                </li>
             </ul>
          </CardContent>
          <CardFooter>
            <Button disabled>Your Current Plan</Button>
          </CardFooter>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle>LORVÉ Premium</CardTitle>
            <CardDescription className="text-primary-foreground/80">Upgrade for exclusive benefits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="text-4xl font-bold">$10<span className="text-lg font-normal text-primary-foreground/80">/month</span></div>
             <ul className="space-y-2 text-primary-foreground/80">
                <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                    Everything in Free, plus:
                </li>
                <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                    Early access to new arrivals
                </li>
                 <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                    Exclusive member discounts
                </li>
                 <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-accent" />
                    Free shipping on all orders
                </li>
             </ul>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full">Upgrade to Premium</Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12">
        <Card>
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>This is a placeholder for a payment gateway like Stripe.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary">
                    <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Visa ending in 1234</p>
                            <p className="text-sm text-muted-foreground">Expires 08/2026</p>
                        </div>
                    </div>
                    <Button variant="outline">Update</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
