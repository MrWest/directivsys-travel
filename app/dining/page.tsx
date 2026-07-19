'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RESTAURANTS as restaurants } from '../../data/sampleData';

export default function DiningPage() {
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  const priceRanges = [...new Set(restaurants.map(r => r.priceRange))];

  const filtered = restaurants.filter(r => {
    const q = search.toLowerCase();
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) || r.features.some(f => f.toLowerCase().includes(q));
    const matchesCuisine = !cuisine || r.cuisine === cuisine;
    const matchesPrice = !priceRange || r.priceRange === priceRange;
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dining in Barbados</h1>
          <p className="text-slate-400">{filtered.length} award-winning restaurants</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
          <select value={cuisine} onChange={e => setCuisine(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500">
            <option value="">Any Cuisine</option>
            {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-rose-500">
            <option value="">Any Price</option>
            {priceRanges.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <Link key={r.id} href={`/dining/${r.id}`} className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-rose-500/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <Image src={r.image} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-slate-900/80 text-rose-400 text-xs font-medium">{r.cuisine}</div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 text-slate-300 text-xs">{r.priceRange}</div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-bold text-xl mb-1">{r.name}</h3>
                <p className="text-slate-500 text-sm mb-2">📍 {r.location}</p>
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{r.description}</p>
                <div className="flex flex-wrap gap-2">
                  {r.features.slice(0, 3).map(f => (
                    <span key={f} className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-400 text-xs">{f}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-slate-400 text-lg">No restaurants match your search.</p>
            <button onClick={() => { setSearch(''); setCuisine(''); setPriceRange(''); }} className="mt-4 text-rose-400 hover:text-rose-300 text-sm">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
