'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HOTELS as hotels, RESTAURANTS as restaurants } from '../data/sampleData';

const categories = [
  { href: '/hotels', label: 'Hotels', icon: '🏨', description: 'Luxury stays in Barbados', count: 8, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30' },
  { href: '/flights', label: 'Flights', icon: '✈️', description: 'Direct & connecting routes', count: 20, color: 'from-sky-500/20 to-sky-600/10 border-sky-500/30' },
  { href: '/transfers', label: 'Transfers', icon: '🚗', description: 'Airport & island transfers', count: 6, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' },
  { href: '/dining', label: 'Dining', icon: '🍽️', description: 'Award-winning restaurants', count: 10, color: 'from-rose-500/20 to-rose-600/10 border-rose-500/30' },
];

export default function HomePage() {
  const featuredHotels = hotels.slice(0, 3);
  const featuredRestaurants = restaurants.slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-950 z-10" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hotels/sandy-lane.jpg')" }} />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
            <span>✨</span><span>Powered by DirectivSys AI Orchestration</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Barbados
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Dream Trip</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Book hotels, flights, transfers, and dining — all through a single AI-powered conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hotels" className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg transition-all">Explore Hotels</Link>
            <Link href="/login" className="px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 text-white font-medium text-lg transition-all hover:bg-white/5">Sign In to Book</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Plan Every Part of Your Trip</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat.href} href={cat.href} className={`group p-6 rounded-2xl border bg-gradient-to-br ${cat.color} hover:scale-105 transition-all duration-200`}>
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-white font-bold text-lg mb-1">{cat.label}</div>
              <div className="text-slate-400 text-sm mb-2">{cat.description}</div>
              <div className="text-slate-500 text-xs">{cat.count} options</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Hotels</h2>
          <Link href="/hotels" className="text-amber-400 hover:text-amber-300 text-sm font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHotels.map(hotel => (
            <Link key={hotel.id} href={`/hotels/${hotel.id}`} className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <Image src={hotel.image} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 text-amber-400 text-xs font-medium">{'★'.repeat(hotel.stars)}</div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-1">{hotel.name}</h3>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{hotel.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">{hotel.location}</span>
                  <span className="text-amber-400 font-bold">${hotel.roomTypes[0].pricePerNight}<span className="text-slate-500 font-normal text-xs">/night</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Top Dining Experiences</h2>
          <Link href="/dining" className="text-amber-400 hover:text-amber-300 text-sm font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRestaurants.map(r => (
            <Link key={r.id} href={`/dining/${r.id}`} className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <Image src={r.image} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 text-rose-400 text-xs font-medium">{r.priceRange}</div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-1">{r.name}</h3>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs">{r.cuisine}</span>
                  <span className="text-slate-400 text-xs">{r.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-12 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-3xl font-bold text-white mb-4">Let AI Plan Your Entire Trip</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Just tell the assistant what you need — hotel, flight, transfer, dinner — and watch it handle everything in one conversation.
          </p>
          <p className="text-amber-400 text-sm font-medium">
            💬 Try: &quot;Book Sandy Lane for 3 nights, a business class flight from Miami, and dinner at The Cliff&quot;
          </p>
        </div>
      </section>
    </div>
  );
}
