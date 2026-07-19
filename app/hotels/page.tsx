'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { HOTELS as hotels } from '../../data/sampleData';

function HotelsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [minStars, setMinStars] = useState<number>(0);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const price = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 0;
    setSearch(q);
    setMaxPrice(price);
  }, [searchParams]);

  const filtered = hotels.filter(h => {
    const q = search.toLowerCase();
    const matchesSearch = !q || h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q) ||
      h.amenities.some(a => a.toLowerCase().includes(q)) || h.location.toLowerCase().includes(q);
    const matchesPrice = !maxPrice || h.roomTypes[0].pricePerNight <= maxPrice;
    const matchesStars = !minStars || h.stars >= minStars;
    return matchesSearch && matchesPrice && matchesStars;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Hotels in Barbados</h1>
          <p className="text-slate-400">{filtered.length} luxury properties available</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search hotels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-400"
          />
          <select
            value={maxPrice}
            onChange={e => setMaxPrice(parseInt(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm focus:outline-none focus:border-sky-400"
          >
            <option value={0}>Any Price</option>
            <option value={300}>Under $300/night</option>
            <option value={600}>Under $600/night</option>
            <option value={1000}>Under $1,000/night</option>
          </select>
          <select
            value={minStars}
            onChange={e => setMinStars(parseInt(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm focus:outline-none focus:border-sky-400"
          >
            <option value={0}>Any Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        {search && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 text-sm">
            🤖 AI search active: showing hotels matching &quot;{search}&quot; — {filtered.length} results
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(hotel => (
            <Link key={hotel.id} href={`/hotels/${hotel.id}`} className="group rounded-2xl overflow-hidden bg-white/80 border border-slate-200 hover:border-sky-200 transition-all">
              <div className="relative h-52 overflow-hidden">
                <Image src={hotel.image} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/80 text-sky-600 text-xs font-medium">
                  {'★'.repeat(hotel.stars)}
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-sky-500 text-white text-sm font-bold">
                  ${hotel.roomTypes[0].pricePerNight}/night
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-slate-800 font-bold text-xl mb-1">{hotel.name}</h3>
                <p className="text-slate-400 text-sm mb-3">📍 {hotel.location}</p>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{hotel.description}</p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 3).map(a => (
                    <span key={a} className="px-2 py-1 rounded-lg bg-slate-100/80 text-slate-400 text-xs">{a}</span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="px-2 py-1 rounded-lg bg-slate-100/80 text-slate-400 text-xs">+{hotel.amenities.length - 3} more</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏨</div>
            <p className="text-slate-400 text-lg">No hotels match your search.</p>
            <button onClick={() => { setSearch(''); setMaxPrice(0); setMinStars(0); }} className="mt-4 text-sky-600 hover:text-sky-500 text-sm">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}><HotelsContent /></Suspense>;
}
