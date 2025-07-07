
// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getAdminEmails, addAdminEmail, removeAdminEmail } from '@/app/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ShieldAlert, Trash2, UserPlus } from 'lucide-react';

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export default function AdminSettingsPage() {
  const { user, isAdmin, loading, updatePassword } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You do not have permission to access this page.',
      });
      router.push('/');
    }
  }, [isAdmin, loading, router, toast]);

  useEffect(() => {
    if (isAdmin) {
      const fetchAdmins = async () => {
        setIsFetching(true);
        const { emails, error } = await getAdminEmails();
        if (error) {
          toast({ variant: 'destructive', title: 'Error', description: error });
        } else {
          setAdminEmails(emails || []);
        }
        setIsFetching(false);
      };
      fetchAdmins();
    }
  }, [isAdmin, toast]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addAdminEmail(newAdminEmail);
    if (result.success) {
      toast({ title: 'Admin Added', description: `${newAdminEmail} can now access admin features.` });
      setAdminEmails(prev => [...prev, newAdminEmail.toLowerCase()].sort());
      setNewAdminEmail('');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsSubmitting(false);
  };

  const handleRemoveAdmin = async (email: string) => {
    const result = await removeAdminEmail(email);
    if (result.success) {
      toast({ title: 'Admin Removed', description: `${email} no longer has admin access.` });
      setAdminEmails(prev => prev.filter(e => e !== email));
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsUpdatingPassword(true);
    try {
      await updatePassword(values.password);
      toast({ title: "Success", description: "Your password has been updated." });
      passwordForm.reset();
    } catch (error: any) {
      let description = "An unexpected error occurred.";
      if(error.code === 'auth/requires-recent-login') {
        description = "This is a sensitive operation. Please log out and log back in before changing your password."
      } else if (error.message) {
        description = error.message;
      }
      toast({ variant: 'destructive', title: 'Update Failed', description });
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  
  if (loading || !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const fallbackAdminEmail = "shivansh121shukla@gmail.com";

  return (
    <div className="container mx-auto py-12 max-w-4xl space-y-12">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Admin Management</CardTitle>
          <CardDescription>Add or remove users who can access admin dashboards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAddAdmin} className="flex items-end gap-2">
            <div className="flex-grow">
              <Label htmlFor="new-admin-email">New Admin Email</Label>
              <Input
                id="new-admin-email"
                type="email"
                placeholder="new.admin@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus />}
              Add Admin
            </Button>
          </form>
          
          <div className="space-y-2">
            <h4 className="font-medium">Current Admins</h4>
            {isFetching ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading admins...</span>
              </div>
            ) : (
              <ul className="divide-y rounded-md border">
                {adminEmails.map(email => (
                  <li key={email} className="flex items-center justify-between p-3">
                    <span className="font-mono text-sm">{email}</span>
                    {email.toLowerCase() === fallbackAdminEmail ? (
                       <ShieldAlert className="h-5 w-5 text-yellow-500" title="Primary admin cannot be removed" />
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveAdmin(email)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Account Settings</CardTitle>
          <CardDescription>Manage your personal admin account.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
