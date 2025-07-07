// @ts-nocheck
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  sendSignInLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const adminEmail = "shivansh121shukla@gmail.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(user ? user.email?.toLowerCase() === adminEmail.toLowerCase() : false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendSignInLink = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/finish-signin`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem('emailForSignIn', email);
  }

  const signOut = () => {
    return firebaseSignOut(auth);
  }

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, sendSignInLink, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
