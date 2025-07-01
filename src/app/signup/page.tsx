"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MailCheck } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { isSignInWithEmailLink } from 'firebase/auth';

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

const passwordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const getAuthErrorDescription = (error: any) => {
    if (!error.code) return error.message || "An unexpected error occurred.";
    switch (error.code) {
        case 'auth/invalid-api-key':
            return "Your Firebase configuration is invalid. Please check your environment variables.";
        case 'auth/invalid-action-code':
            return "The verification link is invalid or has expired. Please try signing up again.";
        case 'auth/expired-action-code':
            return "The verification link has expired. Please try signing up again.";
        default:
            return error.message;
    }
}

export default function SignupPage() {
  const [step, setStep] = useState<'email' | 'linkSent' | 'setPassword'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { sendSignUpLink, completeSignUp, updateUserPassword, user } = useAuth();
  const { toast } = useToast();

  const currentSchema = step === 'setPassword' ? passwordSchema : emailSchema;

  const form = useForm({
    resolver: zodResolver(currentSchema),
  });

  useEffect(() => {
    const link = window.location.href;
    if (isSignInWithEmailLink(auth, link)) {
      const emailFromStorage = window.localStorage.getItem('emailForSignIn');
      if (!emailFromStorage) {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Could not find your email. Please restart the sign-up process from the same device and browser.",
        });
        return;
      }
      
      setIsLoading(true);
      completeSignUp(emailFromStorage, link)
        .then(() => {
          window.localStorage.removeItem('emailForSignIn');
          setEmail(emailFromStorage);
          setStep('setPassword');
        })
        .catch((error: any) => {
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: getAuthErrorDescription(error),
          });
        })
        .finally(() => {
          setIsLoading(false);
          // Clean the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, [completeSignUp, toast]);
  
  // If user is already logged in and needs to set a password
  useEffect(() => {
      if(user && !user.emailVerified) { // A new user from link signin is not verified yet
          setEmail(user.email || '');
          setStep('setPassword');
      }
  }, [user]);


  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      await sendSignUpLink(values.email);
      setEmail(values.email);
      setStep('linkSent');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign-up Failed",
        description: getAuthErrorDescription(error),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
      setIsLoading(true);
      try {
          await updateUserPassword(values.password);
          toast({
              title: "Account Created!",
              description: "You've been successfully signed up.",
          });
          router.push('/');
      } catch (error: any) {
          toast({
              variant: "destructive",
              title: "Error",
              description: "Could not set password. Please try again.",
          });
      } finally {
          setIsLoading(false);
      }
  }

  const onSubmit = step === 'setPassword' ? handlePasswordSubmit : handleEmailSubmit;

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        {step === 'linkSent' ? (
           <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <MailCheck className="h-16 w-16 text-green-500 mb-6" />
              <CardTitle className="font-headline text-2xl mb-2">Check your inbox</CardTitle>
              <CardDescription>
                  We've sent a secure sign-up link to <span className="font-semibold text-foreground">{email}</span>. Please click the link to continue.
              </CardDescription>
          </CardContent>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">
                {step === 'email' ? 'Create an Account' : 'Set Your Password'}
              </CardTitle>
              <CardDescription>
                {step === 'email' ? 'Join us to discover your signature scent.' : 'Welcome! Create a secure password to protect your account.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {step === 'email' && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                   {step === 'setPassword' && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     {step === 'email' ? 'Send Sign-up Link' : 'Create Account'}
                  </Button>
                </form>
              </Form>
              {step === 'email' && (
                  <p className="mt-6 text-center text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link href="/login" className="font-semibold text-primary hover:underline">
                      Sign in
                      </Link>
                  </p>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}