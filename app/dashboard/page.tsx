'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useReservations } from '../../context/ReservationContext';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { reservations } = useReservations();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/dashboard');
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const myReservations = reservations.filter(r => r.userId === user.id);
  const getResDate = (r: import('../../types').Reservation): string => {
    const d = r.details as unknown as Record<string, unknown>;
    return (d.checkIn || d.departureDate || d.date || '') as string;
  };
  const upcoming = myReservations.filter(r => r.status === 'confirmed' && new Date(getResDate(r)) >= new Date());
  const past = myReservations.filter(r => r.status !== 'confirmed' || new Date(getResDate(r)) < new Date());

  const stats = [
    { label: 'Upcoming Trips', value: upcoming.length, icon: '📅', color: 'text-sky-600' },
    { label: 'Total Reservations', value: myReservations.length, icon: '🎫', color: 'text-sky-600' },
    { label: 'Hotels Booked', value: myReservations.filter(r => r.type === 'hotel').length, icon: '🏨', color: 'text-blue-400' },
    { label: 'Dining Reserved', value: myReservations.filter(r => r.type === 'dining').length, icon: '🍽️', color: 'text-rose-500' },
  ];

  const typeIcon: Record<string, string> = { hotel: '🏨', flight: '✈️', taxi: '🚗', dining: '🍽️' };
  const typeColor: Record<string, string> = { hotel: 'text-sky-600', flight: 'text-sky-600', taxi: 'text-emerald-600', dining: 'text-rose-500' };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-700 mb-2">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-400">Here&apos;s your travel overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map(s => (
            <div key={s.label} className="p-5 rounded-2xl bg-white/80 border border-slate-200">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-slate-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Quick Book</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/hotels', label: 'Find a Hotel', icon: '🏨', color: 'border-sky-200 hover:border-sky-400' },
              { href: '/flights', label: 'Book a Flight', icon: '✈️', color: 'border-sky-200 hover:border-sky-500/60' },
              { href: '/transfers', label: 'Get a Transfer', icon: '🚗', color: 'border-emerald-200 hover:border-emerald-500/60' },
              { href: '/dining', label: 'Reserve Dining', icon: '🍽️', color: 'border-rose-200 hover:border-rose-500/60' },
            ].map(a => (
              <Link key={a.href} href={a.href} className={`p-4 rounded-2xl bg-white/80 border ${a.color} text-center transition-all hover:bg-slate-100/80`}>
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="text-slate-700 text-sm font-medium">{a.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-700">Upcoming Reservations</h2>
            <Link href="/reservations" className="text-sky-600 hover:text-sky-500 text-sm">View all →</Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/80 border border-slate-200 text-center">
              <div className="text-4xl mb-3">🌴</div>
              <p className="text-slate-400">No upcoming trips. Start planning your Barbados adventure!</p>
              <div className="mt-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 text-sm inline-block">
                💬 Ask the AI: &quot;Book Sandy Lane for 3 nights starting next week&quot;
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-slate-200">
                  <div className="text-2xl">{typeIcon[r.type] || '🎫'}</div>
                  <div className="flex-1">
                    {(() => {
                      const d = r.details as unknown as Record<string, unknown>;
                      const label = (d.hotelName || d.restaurantName || d.vehicleName || `${d.airline ?? ''} ${d.flightNumber ?? ''}`.trim() || r.type) as string;
                      const dateStr = (d.checkIn || d.departureDate || d.date || '') as string;
                      const timeStr = (d.time || d.departureTime || '') as string;
                      return (<>
                        <div className="text-slate-700 font-medium">{label}</div>
                        <div className="text-slate-400 text-sm">{dateStr}{timeStr ? ` at ${timeStr}` : ''}</div>
                      </>);
                    })()}
                  </div>
                  <div className={`text-sm font-medium ${typeColor[r.type] || 'text-slate-400'}`}>{r.type}</div>
                  <div className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs">{r.status}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
