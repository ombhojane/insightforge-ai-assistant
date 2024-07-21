'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useChat } from "ai/react";
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

  const [gotMessages, setGotMessages] = useState(false);
  const [context, setContext] = useState<string[] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onFinish: async () => {
      setGotMessages(true);
    },
  });

  const prevMessagesLengthRef = useRef(messages.length);

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setContext(null);
    setGotMessages(false);
  };

  useEffect(() => {
    const getContext = async () => {
      const response = await fetch("/api/context", {
        method: "POST",
        body: JSON.stringify({ messages }),
      });
      const { context } = await response.json();
      setContext(context.map((c: any) => c.id));
    };

    if (gotMessages && messages.length >= prevMessagesLengthRef.current) {
      getContext();
    }

    prevMessagesLengthRef.current = messages.length;
  }, [messages, gotMessages]);

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

  const handleBackToHome = () => {
    router.push('/');
  };

  console.log('Dashboard: Rendering - user:', user, 'loading:', loading);

  // Render a fallback until the client-side JavaScript is hydrated
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col justify-between h-screen bg-gray-800 p-7 mx-auto max-w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img src="/Insights.forge.png" alt="Logo" className="h-16 w-16 mr-2" />
            <span className="flex justify-left text-4xl font-bold mb-0">
              <a href="/" className="text-green-500">Insights</a>
              <a href="/" className="text-white">.Forge</a>
            </span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleBackToHome}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              BACK TO HOME
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
              Logout
            </button>
          </div>
        </div>
        <p className="flex justify-left mb-5 text-white">Welcome, {user?.displayName || user?.email}</p>
        <div className='absolute bottom-12 z-[2]'>
          <FileManager />
        </div>
        <div className="flex w-full flex-grow overflow-hidden relative">
          <Search
            input={input}
            handleInputChange={handleInputChange}
            handleMessageSubmit={handleMessageSubmit}
            messages={messages}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
