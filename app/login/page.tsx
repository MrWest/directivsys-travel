'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

const DEMO_PERSONAS = [
  {
    email: 'sophia@travel.com',
    password: 'Demo1234',
    name: 'Sophia Laurent',
    tagline: 'Luxury Traveller',
    tier: 'Platinum',
    tierColor: 'bg-violet-100 text-violet-700',
    avatar: '/avatars/sophia.jpg',
    accent: 'border-violet-200 hover:border-violet-400',
    emoji: '💎',
  },
  {
    email: 'marcus@travel.com',
    password: 'Demo1234',
    name: 'Marcus Thompson',
    tagline: 'Adventure Seeker',
    tier: 'Gold',
    tierColor: 'bg-amber-100 text-amber-700',
    avatar: '/avatars/marcus.jpg',
    accent: 'border-amber-200 hover:border-amber-400',
    emoji: '🏄',
  },
  {
    email: 'emma@travel.com',
    password: 'Demo1234',
    name: 'Emma & Jake Wilson',
    tagline: 'Honeymoon Couple',
    tier: 'Silver',
    tierColor: 'bg-pink-100 text-pink-700',
    avatar: '/avatars/emma.jpg',
    accent: 'border-pink-200 hover:border-pink-400',
    emoji: '💑',
  },
  {
    email: 'james@travel.com',
    password: 'Demo1234',
    name: 'James Hartley',
    tagline: 'Executive Traveller',
    tier: 'Platinum',
    tierColor: 'bg-violet-100 text-violet-700',
    avatar: '/avatars/james.jpg',
    accent: 'border-violet-200 hover:border-violet-400',
    emoji: '💼',
  },
  {
    email: 'priya@travel.com',
    password: 'Demo1234',
    name: 'Priya Sharma',
    tagline: 'Family Vacation',
    tier: 'Silver',
    tierColor: 'bg-sky-100 text-sky-700',
    avatar: '/avatars/priya.jpg',
    accent: 'border-sky-200 hover:border-sky-400',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    email: 'tom@travel.com',
    password: 'Demo1234',
    name: 'Tom Brennan',
    tagline: 'Budget Explorer',
    tier: 'Standard',
    tierColor: 'bg-green-100 text-green-700',
    avatar: '/avatars/tom.jpg',
    accent: 'border-green-200 hover:border-green-400',
    emoji: '🎒',
  },
];

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingPersona, setLoadingPersona] = useState<string | null>(null);

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

  const handlePersonaLogin = (persona: typeof DEMO_PERSONAS[0]) => {
    setLoadingPersona(persona.email);
    const result = login(persona.email, persona.password);
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } else {
      setError(result.error || 'Login failed');
      setLoadingPersona(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <span className="text-3xl">🌴</span>
            <span className="text-2xl font-bold text-sky-500" style={{ fontFamily: 'Pacifico, cursive' }}>Barbados Bliss</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Sign in to access your AI-powered travel concierge</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Persona Quick-Login — left */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">✨ Demo Personas — One-Click Login</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DEMO_PERSONAS.map(persona => (
                <button
                  key={persona.email}
                  onClick={() => handlePersonaLogin(persona)}
                  disabled={loadingPersona !== null}
                  className={`relative flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-2 ${persona.accent} shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-center disabled:opacity-60`}
                >
                  {loadingPersona === persona.email && (
                    <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white shadow">
                    <Image src={persona.avatar} alt={persona.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-slate-800 text-xs font-semibold leading-tight">{persona.name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{persona.emoji} {persona.tagline}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${persona.tierColor}`}>
                    {persona.tier}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Login Form — right */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Or Sign In Manually</p>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-500 text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-300 focus:outline-none focus:border-sky-400 text-sm"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-sm mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-300 focus:outline-none focus:border-sky-400 text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-colors"
                >
                  Sign In
                </button>
              </form>
              <p className="text-slate-400 text-xs text-center mt-4">
                All demo passwords: <span className="font-mono font-bold text-slate-600">Demo1234</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          <Link href="/" className="text-sky-500 hover:text-sky-400">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
