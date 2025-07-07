
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';

const auth = getAuth(app);

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

const loginSchema = z.object({
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password.length >= 6, {
    message: "Password must be at least 6 characters.",
    path: ["password"],
});


// Helper function to generate a user-friendly error description
const getAuthErrorDescription = (error: any) => {
    if (!error.code) return error.message || "An unexpected error occurred.";
    switch (error.code) {
        case 'auth/invalid-api-key':
            return "Your Firebase configuration is invalid. Please check your environment variables.";
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
             return "Invalid email or password. Please try again.";
        case 'auth/popup-closed-by-user':
            return "The sign-in popup was closed before completing. Please try again.";
        case 'auth/email-already-in-use':
            return "This email address is already taken. Please use a different email or log in.";
        case 'auth/weak-password':
            return "The password is too weak. Please use a stronger password.";
        default:
            return error.message;
    }
}

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'login' | 'signup'>('email');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { password: "" },
  });

  const handleEmailSubmit = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      const methods = await fetchSignInMethodsForEmail(auth, values.email);
      setUserEmail(values.email);
      if (methods.length > 0) {
        setStep('login');
      } else {
        setStep('signup');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: getAuthErrorDescription(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmail(userEmail, values.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login Failed", description: getAuthErrorDescription(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(userEmail, values.password);
      toast({ title: "Account Created!", description: "You've been successfully signed up." });
      router.push('/');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sign-up Failed", description: getAuthErrorDescription(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setIsLoading(false);
    setStep('email');
    // Keep email in form for better UX
    emailForm.setValue('email', userEmail);
    // Reset other forms
    loginForm.reset();
    signupForm.reset();
  };

  const renderHeader = () => {
    switch(step) {
      case 'login':
        return { title: "Welcome Back", description: `Signing in as ${userEmail}` };
      case 'signup':
        return { title: "Create an Account", description: `Creating an account for ${userEmail}` };
      case 'email':
      default:
        return { title: "Sign In or Sign Up", description: "Enter your email to continue." };
    }
  };

  const { title, description } = renderHeader();

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          {step !== 'email' && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1"
              onClick={goBack}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <CardTitle className="font-headline text-3xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
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
                  Continue
                </Button>
              </form>
            </Form>
          )}

          {step === 'login' && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} autoFocus /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          )}

          {step === 'signup' && (
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Create a Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} autoFocus /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
