'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reservation } from '../types/index';
import { DEMO_RESERVATIONS } from '../data/sampleData';
import { useAuth } from './AuthContext';

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (r: Reservation) => void;
  updateReservation: (r: Reservation) => void;
  cancelReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | null>(null);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Re-seed reservations whenever the logged-in user changes
  useEffect(() => {
    if (user) {
      setReservations(DEMO_RESERVATIONS.filter(r => r.userId === user.id));
    } else {
      setReservations([]);
    }
  }, [user]);

  const addReservation = (r: Reservation) => setReservations(prev => [...prev, r]);

  const updateReservation = (updated: Reservation) =>
    setReservations(prev => prev.map(r => r.id === updated.id ? updated : r));

  const cancelReservation = (id: string) =>
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));

  return (
    <ReservationContext.Provider value={{ reservations, addReservation, updateReservation, cancelReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationProvider');
  return ctx;
}
