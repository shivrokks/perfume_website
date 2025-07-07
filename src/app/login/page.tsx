"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MailCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

const getAuthErrorDescription = (error: any) => {
    if (!error.code) return error.message || "An unexpected error occurred.";
    switch (error.code) {
        case 'auth/invalid-api-key':
            return "Your Firebase configuration is invalid. Please check your environment variables.";
        default:
            return "An error occurred while sending the link. Please try again.";
    }
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { sendSignInLink } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await sendSignInLink(values.email);
      setLinkSent(true);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: getAuthErrorDescription(error) });
    } finally {
      setIsLoading(false);
    }
  };

  if (linkSent) {
    return (
       <div className="container flex min-h-[80vh] items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MailCheck className="h-8 w-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="font-headline text-3xl">Check your inbox</CardTitle>
                <CardDescription className="mt-4 text-lg">
                    We've sent a secure sign-in link to <span className="font-bold text-foreground">{form.getValues('email')}</span>.
                </CardDescription>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Sign In or Sign Up</CardTitle>
          <CardDescription>Enter your email to receive a secure sign-in link.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Sign-In Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
