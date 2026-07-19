'use client';

import { useState, Suspense } from 'react';
import { FLIGHTS as flights } from '../../data/sampleData';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

function FlightsContent() {
  const { isAuthenticated } = useAuth();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [cabinClass, setCabinClass] = useState('');

  const origins = [...new Set(flights.map(f => f.origin))];
  const destinations = [...new Set(flights.map(f => f.destination))];

  const filtered = flights.filter(f => {
    const matchesOrigin = !origin || f.origin === origin;
    const matchesDest = !destination || f.destination === destination;
    const matchesClass = !cabinClass || Object.keys(f.classes).some(c => c.toLowerCase() === cabinClass.toLowerCase());
    return matchesOrigin && matchesDest && matchesClass;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Flights to Barbados</h1>
          <p className="text-slate-400">{filtered.length} routes available</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select value={origin} onChange={e => setOrigin(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500">
            <option value="">Any Origin</option>
            {origins.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={destination} onChange={e => setDestination(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500">
            <option value="">Any Destination</option>
            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={cabinClass} onChange={e => setCabinClass(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500">
            <option value="">Any Class</option>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First">First Class</option>
          </select>
        </div>

        {/* Flight Cards */}
        <div className="space-y-4">
          {filtered.map(flight => (
            <div key={flight.id} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-sky-500/30 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{flight.departureTime}</div>
                    <div className="text-slate-400 text-sm">{flight.origin}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sky-400 text-xs mb-1">{`${Math.floor(flight.durationMinutes/60)}h ${flight.durationMinutes%60}m`}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-px bg-slate-600" />
                      <span className="text-sky-400 text-lg">✈</span>
                      <div className="w-16 h-px bg-slate-600" />
                    </div>
                    <div className="text-slate-500 text-xs mt-1">{'Direct'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{flight.arrivalTime}</div>
                    <div className="text-slate-400 text-sm">{flight.destination}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-slate-400 text-xs mb-1">{flight.airline}</div>
                    <div className="flex gap-2">
                      {Object.entries(flight.classes).map(([cls, price]) => (
                        <span key={cls} className="text-xs px-2 py-1 rounded-lg bg-slate-700 text-slate-300 capitalize">
                          {cls} <span className="text-sky-400">${price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  {isAuthenticated ? (
                    <div className="text-sky-400 text-xs text-center max-w-[120px]">
                      💬 Ask AI to book this flight
                    </div>
                  ) : (
                    <Link href="/login" className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors">
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✈️</div>
            <p className="text-slate-400 text-lg">No flights match your search.</p>
            <button onClick={() => { setOrigin(''); setDestination(''); setCabinClass(''); }} className="mt-4 text-sky-400 hover:text-sky-300 text-sm">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlightsPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}><FlightsContent /></Suspense>;
}
