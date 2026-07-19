'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/hotels', label: 'Hotels' },
    { href: '/flights', label: 'Flights' },
    { href: '/transfers', label: 'Transfers' },
    { href: '/dining', label: 'Dining' },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">✈</span>
            </div>
            <div>
              <span className="text-white font-bold text-base">Directiv</span>
              <span className="text-amber-400 font-bold text-base">Travel</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  href="/reservations"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/reservations')
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  My Trips
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-xs">{user.name.charAt(0)}</span>
                  </div>
                  <span className="text-slate-300 text-sm">{user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
