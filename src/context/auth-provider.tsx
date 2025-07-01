// @ts-nocheck
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, updatePassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithEmail: (email, password) => Promise<any>;
  sendSignUpLink: (email) => Promise<void>;
  completeSignUp: (email, link) => Promise<any>;
  updateUserPassword: (password) => Promise<void>;
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

  const sendSignUpLink = (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/signup`,
      handleCodeInApp: true,
    };
    window.localStorage.setItem('emailForSignIn', email);
    return sendSignInLinkToEmail(auth, email, actionCodeSettings);
  };
  
  const completeSignUp = (email: string, link: string) => {
    return signInWithEmailLink(auth, email, link);
  }
  
  const updateUserPassword = (password: string) => {
    if (!auth.currentUser) {
        return Promise.reject(new Error("No user is signed in to update password."));
    }
    return updatePassword(auth.currentUser, password);
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
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithEmail, sendSignUpLink, completeSignUp, updateUserPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
