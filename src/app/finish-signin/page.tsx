// @ts-nocheck
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FinishSignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function completeSignIn() {
      // Check if the current URL is a sign-in link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Get the email from localStorage
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // If the email is not in localStorage, the user may be on a different device.
          // We can't proceed without it.
          setError("Your sign-in link is valid, but we couldn't find your email. Please try signing in again from the same device and browser.");
          return;
        }

        try {
          // Complete the sign-in process
          await signInWithEmailLink(auth, email, window.location.href);
          
          // Clean up the email from localStorage
          window.localStorage.removeItem('emailForSignIn');

          // Notify the user and redirect
          toast({
            title: "Sign In Successful",
            description: "Welcome! You have been successfully signed in.",
          });
          router.push('/');
          
        } catch (err: any) {
          console.error("Sign-in error:", err);
          let errorMessage = "An unknown error occurred. Please try again.";
          if (err.code === 'auth/invalid-action-code') {
            errorMessage = "The sign-in link is invalid or has expired. Please request a new one.";
          }
          setError(errorMessage);
        }
      } else {
         setError("This is not a valid sign-in link.");
      }
    }

    completeSignIn();
  }, [router, toast]);

  if (error) {
     return (
        <div className="container flex min-h-[80vh] items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-destructive">Sign-In Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">{error}</p>
                    <Button asChild className="w-full">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">Finalizing your sign-in...</p>
    </div>
  );
}
