'use client';

import { useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';
import FileManager from '../../components/FileManager';
import Search from '../../components/Search';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Dashboard: useEffect - user:', user, 'loading:', loading);
  }, [user, loading]);

  const handleLogout = async () => {
    try {
      console.log('Dashboard: Attempting to sign out');
      await signOut(auth);
      console.log('Dashboard: Sign out successful');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  console.log('Dashboard: Rendering - user:', user, 'loading:', loading);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <p className="mb-4">Welcome, {user?.displayName || user?.email}</p>
        <FileManager />
        <Search />
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
}