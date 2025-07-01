// @ts-nocheck
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithEmail: (email, password) => Promise<any>;
  signUpWithEmail: (email, password) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(user ? user.email === adminEmail : false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const signUpWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
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
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
