'use client';

import Signup from '../../components/Signup';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <Signup />
    </div>
  )
}