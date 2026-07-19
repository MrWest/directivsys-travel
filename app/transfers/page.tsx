'use client';

import { useState } from 'react';
import Image from 'next/image';
import { TAXIS as taxis } from '../../data/sampleData';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function TransfersPage() {
  const { isAuthenticated } = useAuth();
  const [vehicleType, setVehicleType] = useState('');

  const types = [...new Set(taxis.map(t => t.vehicleType))];
  const filtered = taxis.filter(t => !vehicleType || t.vehicleType === vehicleType);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Island Transfers</h1>
          <p className="text-slate-400">Airport pickups, hotel transfers, and island tours</p>
        </div>

        <div className="flex gap-4 mb-8">
          <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm focus:outline-none focus:border-emerald-500">
            <option value="">All Vehicles</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(taxi => (
            <div key={taxi.id} className="rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all overflow-hidden">
              {/* Vehicle photo */}
              <div className="relative w-full" style={{ height: '180px' }}>
                <Image
                  src={taxi.image || `/taxis/${taxi.vehicleType}.jpg`}
                  alt={taxi.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sky-600 text-xs font-semibold shadow-sm capitalize">{taxi.vehicleType}</span>
              </div>
              <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">
                  {taxi.vehicleType === 'sedan' ? '🚗' : taxi.vehicleType === 'suv' ? '🚙' : taxi.vehicleType === 'minivan' ? '🚐' : taxi.vehicleType === 'luxury' ? '🏎️' : '🚌'}
                </span>
                <h3 className="text-slate-800 font-bold text-lg">{taxi.name}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4">{taxi.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Capacity</span>
                  <span className="text-slate-600">{taxi.capacity} passengers</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Base fare</span>
                  <span className="text-emerald-600 font-bold">${taxi.priceUSD}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Per km</span>
                  <span className="text-slate-600">{taxi.estimatedMinutes} min est.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {taxi.features.map(f => (
                  <span key={f} className="px-2 py-1 rounded-lg bg-slate-100/80 text-slate-400 text-xs">{f}</span>
                ))}
              </div>
              {isAuthenticated ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs text-center">
                  💬 Ask AI to book this transfer
                </div>
              ) : (
                <Link href="/login" className="block w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-800 text-sm font-medium text-center transition-colors">
                  Sign In to Book
                </Link>
              )}
              </div>{/* end p-5 */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
