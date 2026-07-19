'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RESTAURANTS as restaurants } from '../../../data/sampleData';
import { useAuth } from '../../../context/AuthContext';

export default function DiningDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const restaurant = restaurants.find(r => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-slate-400 text-lg">Restaurant not found.</p>
          <Link href="/dining" className="mt-4 text-rose-400 hover:text-rose-300 text-sm block">← Back to Dining</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="relative h-[45vh] overflow-hidden">
        <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link href="/dining" className="text-slate-400 hover:text-white text-sm mb-3 block">← Back to Dining</Link>
          <div className="flex items-end justify-between">
            <div>
              <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-sm font-medium mb-2 inline-block">{restaurant.cuisine}</span>
              <h1 className="text-4xl font-bold text-white">{restaurant.name}</h1>
              <p className="text-slate-300 mt-1">📍 {restaurant.location}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-rose-400">{restaurant.priceRange}</div>
              <div className="text-slate-400 text-sm">price range</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">About</h2>
              <p className="text-slate-400 leading-relaxed">{restaurant.description}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {restaurant.features.map(f => (
                  <span key={f} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm">{f}</span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Hours & Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-slate-500 text-xs mb-1">Hours</div>
                  <div className="text-white text-sm">{restaurant.openingHours}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div className="text-slate-500 text-xs mb-1">Capacity</div>
                  <div className="text-white text-sm">Up to {restaurant.maxPartySize} guests</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-white font-bold text-xl mb-4">Reserve a Table</h3>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm">Use the AI assistant to make a reservation with your preferred date, time, and party size.</p>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center">
                    💬 Try: &quot;Book a table at {restaurant.name} for 2 on Friday at 7 PM&quot;
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" className="block w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-center transition-colors">
                    Sign In to Reserve
                  </Link>
                  <p className="text-slate-500 text-xs text-center">Sign in to access AI-powered reservations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
