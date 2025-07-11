
// @ts-nocheck
"use client";

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword as firebaseUpdatePassword } from 'firebase/auth';
import { auth, firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  userData: any; // More specific type can be used, e.g., { address: Address }
  isAdmin: boolean;
  loading: boolean;
  signUp: (email, password) => Promise<any>;
  signIn: (email, password) => Promise<any>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fallbackAdminEmail = "shivansh121shukla@gmail.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserData = useCallback(async (user: User) => {
      if (!user) {
        setUserData(null);
        setIsAdmin(false);
        return;
      }
      try {
        // Fetch user profile data (like name, address)
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          setUserData(null);
        }

        // Check for admin privileges
        const isFallbackAdmin = user.email?.toLowerCase() === fallbackAdminEmail;
        const adminDocRef = doc(firestore, 'settings', 'admin_users');
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
          const adminEmails = adminDoc.data().emails?.map((e: string) => e.toLowerCase()) || [];
          setIsAdmin(isFallbackAdmin || adminEmails.includes(user.email?.toLowerCase() ?? ''));
        } else {
          setIsAdmin(isFallbackAdmin);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAdmin(user.email?.toLowerCase() === fallbackAdminEmail);
        setUserData(null);
      }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const signOut = () => {
    return firebaseSignOut(auth);
  }

  const updatePassword = (newPassword: string) => {
    if (!user) {
      return Promise.reject(new Error("You must be logged in to update your password."));
    }
    return firebaseUpdatePassword(user, newPassword);
  }
  
  const refreshUserData = async () => {
    if (user) {
      setLoading(true);
      await fetchUserData(user);
      setLoading(false);
    }
  }

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading, signUp, signIn, signOut, updatePassword, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
