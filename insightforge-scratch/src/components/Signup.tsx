'use client';

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { FaGooglePlusSquare, FaRegEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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

  return(
    <>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="bg-black rounded-2xl shadow-2xl flex w-2/3 max-w-4xl">
          <div className="w-2/5 bg-green-500 rounded-tl-2xl rounded-br-2xl py-36 px-22 text-white">
            <h2 className="text-3xl font-bold mb-2"> Hello, User </h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
              <p className="mb-10 ">
                Fill up personal information and start journey with us
              </p>
              <div className = "flex justify-center">
                <FcGoogle
                  onClick={handleGoogleSignup}
                  className="w-12 h-12 md:text-4xl bg-black rounded-full flex items-center justify-center"
                />
              </div>  
            </div>
          <div className="w-3/5 p-5 ">
            <div className="text-center font-bold">
              <a href="/" className="text-green-500">Insights</a>
              .Forge
            </div>
            <div className="py-10">
              <h2 className="text-3xl font-bold text-green-500 mb-2">
                Create your Account
              </h2>
              <div className="border-2 w-10 border-green-500 inline-block mb-2"></div>
              <p className="text-gray-500 my-3">Use your Email account</p>
              <div className="flex flex-col items-center">
                <form onSubmit={handleEmailSignup}>
                  <div className="bg-gray-100 w-64 p-2 flex items-center rounded-full">
                    <FaRegEnvelope className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      className="bg-gray-100 outline-none flex-1 text-black rounded-full"
                    />
                  </div>
                  <div className="bg-gray-100 w-64 p-2 flex items-center mt-6 mb-6 rounded-full">
                    <FaLock className="text-gray-400 mr-2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="bg-gray-100 outline-none flex-1 text-black rounded-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white"
                  >
                    Sign Up
                  </button>
                  <div>
                    <p className="text-gray-400 my-5">
                      Already have account ?{"        "}
                      <a href="/login" className="text-red-600">
                        Log In Now
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-8 text-white">
          <p>&copy; {new Date().getFullYear()} Insights.Forge. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Signup;
