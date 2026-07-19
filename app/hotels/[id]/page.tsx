'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HOTELS as hotels } from '../../../data/sampleData';
import { useAuth } from '../../../context/AuthContext';

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const hotel = hotels.find(h => h.id === id);

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏨</div>
          <p className="text-slate-400 text-lg">Hotel not found.</p>
          <Link href="/hotels" className="mt-4 text-amber-400 hover:text-amber-300 text-sm block">← Back to Hotels</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link href="/hotels" className="text-slate-400 hover:text-white text-sm mb-3 block">← Back to Hotels</Link>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-amber-400 text-lg mb-1">{'★'.repeat(hotel.stars)}</div>
              <h1 className="text-4xl font-bold text-white">{hotel.name}</h1>
              <p className="text-slate-300 mt-1">📍 {hotel.location}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-amber-400">${hotel.roomTypes[0].pricePerNight}</div>
              <div className="text-slate-400 text-sm">per night</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">About</h2>
              <p className="text-slate-400 leading-relaxed">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map(a => (
                  <span key={a} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm">{a}</span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-3">Room Types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotel.roomTypes.map(room => (
                  <div key={room.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{room.name}</span>
                      <span className="text-amber-400 font-bold">${room.pricePerNight}/night</span>
                    </div>
                    <span className="text-slate-500 text-xs">Max {room.capacity} guests</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <h3 className="text-white font-bold text-xl mb-4">Book This Hotel</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Starting from</span>
                  <span className="text-amber-400 font-bold text-lg">${hotel.roomTypes[0].pricePerNight}/night</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Check-in</span>
                  <span className="text-slate-300">Flexible</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Check-out</span>
                  <span className="text-slate-300">Flexible</span>
                </div>
              </div>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-slate-400 text-sm text-center">Use the AI assistant to book this hotel with your preferred dates and room type.</p>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs text-center">
                    💬 Try: &quot;Book {hotel.name} for 3 nights starting July 25&quot;
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/login" className="block w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-center transition-colors">
                    Sign In to Book
                  </Link>
                  <p className="text-slate-500 text-xs text-center">Sign in to access AI-powered booking</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
