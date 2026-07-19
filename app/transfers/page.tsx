'use client';

import { useState } from 'react';
import { TAXIS as taxis } from '../../data/sampleData';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function TransfersPage() {
  const { isAuthenticated } = useAuth();
  const [vehicleType, setVehicleType] = useState('');

  const types = [...new Set(taxis.map(t => t.vehicleType))];
  const filtered = taxis.filter(t => !vehicleType || t.vehicleType === vehicleType);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Island Transfers</h1>
          <p className="text-slate-400">Airport pickups, hotel transfers, and island tours</p>
        </div>

        <div className="flex gap-4 mb-8">
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500">
            <option value="">All Vehicles</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(taxi => (
            <div key={taxi.id} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">
                  {taxi.vehicleType === 'sedan' ? '🚗' : taxi.vehicleType === 'suv' ? '🚙' : taxi.vehicleType === 'minivan' ? '🚐' : taxi.vehicleType === 'luxury' ? '🏎️' : '🚌'}
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-medium">{taxi.vehicleType}</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-1">{taxi.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{taxi.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Capacity</span>
                  <span className="text-slate-300">{taxi.capacity} passengers</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Base fare</span>
                  <span className="text-emerald-400 font-bold">${taxi.priceUSD}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Per km</span>
                  <span className="text-slate-300">{taxi.estimatedMinutes} min est.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {taxi.features.map(f => (
                  <span key={f} className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-400 text-xs">{f}</span>
                ))}
              </div>
              {isAuthenticated ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center">
                  💬 Ask AI to book this transfer
                </div>
              ) : (
                <Link href="/login" className="block w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium text-center transition-colors">
                  Sign In to Book
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
