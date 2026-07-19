'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useReservations } from '../../context/ReservationContext';

export default function ReservationsPage() {
  const { user, isAuthenticated } = useAuth();
  const { reservations, cancelReservation } = useReservations();
  const router = useRouter();
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/reservations');
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const myReservations = reservations.filter(r => r.userId === user.id);
  const now = new Date();

  const getD = (r: import('../../types').Reservation) => r.details as unknown as Record<string, unknown>;
  const getDate = (r: import('../../types').Reservation) => ((getD(r).checkIn || getD(r).departureDate || getD(r).date || '') as string);
  const getTime = (r: import('../../types').Reservation) => ((getD(r).time || getD(r).departureTime || '') as string);
  const getLabel = (r: import('../../types').Reservation) => ((getD(r).hotelName || getD(r).restaurantName || getD(r).vehicleName || `${getD(r).airline ?? ''} ${getD(r).flightNumber ?? ''}`.trim() || r.type) as string);
  const upcoming = myReservations.filter(r => r.status === 'confirmed' && new Date(getDate(r)) >= now);
  const past = myReservations.filter(r => r.status === 'cancelled' || new Date(getDate(r)) < now);
  const displayed = tab === 'upcoming' ? upcoming : tab === 'past' ? past : myReservations;

  const typeIcon: Record<string, string> = { hotel: '🏨', flight: '✈️', taxi: '🚗', dining: '🍽️' };
  const typeColor: Record<string, string> = { hotel: 'border-amber-500/30', flight: 'border-sky-500/30', taxi: 'border-emerald-500/30', dining: 'border-rose-500/30' };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Reservations</h1>
          <p className="text-slate-400">{myReservations.length} total reservations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'past', 'all'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
                tab === t ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t} {t === 'upcoming' ? `(${upcoming.length})` : t === 'past' ? `(${past.length})` : `(${myReservations.length})`}
            </button>
          ))}
        </div>

        {/* Reservations */}
        {displayed.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center">
            <div className="text-5xl mb-4">🌴</div>
            <p className="text-slate-400 text-lg">No reservations here yet.</p>
            <p className="text-amber-400 text-sm mt-3">💬 Ask the AI to help you plan your trip!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayed.map(r => (
              <div key={r.id} className={`p-6 rounded-2xl bg-slate-800/50 border ${typeColor[r.type] || 'border-slate-700/50'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{typeIcon[r.type] || '🎫'}</div>
                    <div>
                      <div className="text-white font-bold text-lg">{getLabel(r)}</div>
                      <div className="text-slate-400 text-sm mt-1">
                        {getDate(r)}{getTime(r) ? ` at ${getTime(r)}` : ''}
                        {(getD(r).guests as number) ? ` · ${getD(r).guests} guests` : ''}
                        {(getD(r).partySize as number) ? ` · Party of ${getD(r).partySize}` : ''}
                        {(getD(r).passengers as number) ? ` · ${getD(r).passengers} passengers` : ''}
                      </div>
                      {Boolean(getD(r).roomType) && <div className="text-slate-500 text-xs mt-1">Room: {getD(r).roomType as string}</div>}
                      {Boolean(getD(r).cabinClass) && <div className="text-slate-500 text-xs mt-1">Class: {getD(r).cabinClass as string}</div>}
                      {Boolean(getD(r).vehicleType) && <div className="text-slate-500 text-xs mt-1">Vehicle: {getD(r).vehicleType as string}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      r.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                      r.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>{r.status}</span>
                    {Boolean((getD(r).totalPrice as number)) && <div className="text-amber-400 font-bold">${getD(r).totalPrice as number}</div>}
                    {r.status === 'confirmed' && (
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
