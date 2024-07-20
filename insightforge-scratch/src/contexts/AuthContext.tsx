'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up onAuthStateChanged listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthProvider: Auth state changed', user);
      setUser(user);
      setLoading(false);
      console.log('AuthProvider: Updated user:', user, 'loading:', false);
    }, (error) => {
      console.error('AuthProvider: Error in onAuthStateChanged:', error);
    });

    // Check initial auth state
    const currentUser = auth.currentUser;
    console.log('AuthProvider: Initial auth state -', currentUser);

    return () => {
      console.log('AuthProvider: Unsubscribing from onAuthStateChanged');
      unsubscribe();
    };
  }, []);

  console.log('AuthProvider: Rendering with user:', user, 'loading:', loading);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};