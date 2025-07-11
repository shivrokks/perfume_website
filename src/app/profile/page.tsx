// @ts-nocheck
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { upsertUserAddress, getUserAddress } from '@/app/actions';
import { AddressSchema } from '@/lib/schemas';
import type { Address } from '@/lib/types';


export default function ProfilePage() {
  const { user, loading, refreshUserData } = useAuth();
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
    if (!loading && !user) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You must be logged in to view the profile page.',
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  useEffect(() => {
    async function fetchAddress() {
      if (user) {
        setIsAddressLoading(true);
        const savedAddress = await getUserAddress(user.uid);
        if (savedAddress) {
          form.reset({
            fullName: savedAddress.fullName || '',
            addressLine1: savedAddress.addressLine1 || '',
            addressLine2: savedAddress.addressLine2 || '',
            city: savedAddress.city || '',
            state: savedAddress.state || '',
            postalCode: savedAddress.postalCode || '',
            country: savedAddress.country || 'United States',
            phone: savedAddress.phone || '',
          });
        }
        setIsAddressLoading(false);
      }
    }
    fetchAddress();
  }, [user, form]);


  async function onSubmit(values: z.infer<typeof AddressSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    setIsSubmitting(true);
    const result = await upsertUserAddress(user.uid, values);
    if (result.success) {
      toast({ title: 'Success', description: 'Your profile has been saved.' });
      await refreshUserData(); // Refresh user data to update header
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSubmitting(false);
  }

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
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your personal and shipping details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal & Shipping Information</CardTitle>
          <CardDescription>This information will be used for shipping and contact purposes.</CardDescription>
        </CardHeader>
        <CardContent>
          {isAddressLoading ? (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
             </div>
          ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="you@example.com" disabled value={user.email || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl><Input placeholder="123 Perfume Lane" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 <span className='text-muted-foreground'>(Optional)</span></FormLabel>
                      <FormControl><Input placeholder="Apt, suite, etc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl><Input placeholder="New York" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl><Input placeholder="NY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl><Input placeholder="10001" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input placeholder="United States" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Profile
              </Button>
            </form>
          </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
