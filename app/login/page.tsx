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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access AI-powered travel booking</p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold transition-colors">
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-slate-500 text-xs text-center mb-3">Demo Accounts</p>
            <div className="space-y-2">
              {demoUsers.map(u => (
                <button
                  key={u.email}
                  onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  className="w-full px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-left transition-colors"
                >
                  <div className="text-white text-sm font-medium">{u.name}</div>
                  <div className="text-slate-500 text-xs">{u.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="text-amber-400 hover:text-amber-300">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}><LoginContent /></Suspense>;
}
