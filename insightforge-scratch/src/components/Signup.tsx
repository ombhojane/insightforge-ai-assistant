'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { useRouter } from 'next/navigation';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to sign up with email and password');
      console.error('Error signing up:', error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (error) {
      setError('Failed to sign up with Google');
      console.error('Error signing up with Google:', error);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Sign Up with Email
        </button>
      </form>
      <button
        onClick={handleGoogleSignup}
        className="w-full p-2 bg-red-500 text-white rounded"
      >
        Sign Up with Google
      </button>
    </div>
  );
};

export default Signup;