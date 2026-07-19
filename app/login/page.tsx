'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const demoUsers = [
    { email: 'alex@travel.com', password: 'TravelDemo2024', name: 'Alex Johnson' },
    { email: 'sarah@travel.com', password: 'TravelDemo2024', name: 'Sarah Williams' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✈️</div>
          <h1 className="text-3xl font-bold text-slate-700 mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access AI-powered travel booking</p>
        </div>

        <div className="p-8 rounded-2xl bg-white shadow-lg border border-sky-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-600 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-600 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold transition-colors">
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-slate-400 text-xs text-center mb-3">Demo Accounts</p>
            <div className="space-y-2">
              {demoUsers.map(u => (
                <button
                  key={u.email}
                  onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  className="w-full px-4 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-100 border border-slate-600/50 text-left transition-colors"
                >
                  <div className="text-slate-700 text-sm font-medium">{u.name}</div>
                  <div className="text-slate-400 text-xs">{u.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          <Link href="/" className="text-sky-600 hover:text-sky-500">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}><LoginContent /></Suspense>;
}
