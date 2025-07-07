// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getAdminEmails, addAdminEmail, removeAdminEmail, sendPasswordReset } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ShieldAlert, Trash2, UserPlus } from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    const result = await sendPasswordReset(user.email);
    if (result.success) {
      toast({ title: 'Email Sent', description: 'A password reset link has been sent to your email.' });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
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
           <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-muted-foreground">A secure link will be sent to your email to reset your password.</p>
              </div>
              <Button onClick={handlePasswordReset}>Send Reset Link</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
