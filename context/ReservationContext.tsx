'use client';

import React, { createContext, useContext, useState } from 'react';
import { Reservation } from '../types/index';
import { DEMO_RESERVATIONS as sampleReservations } from '../data/sampleData';

interface ReservationContextType {
  reservations: Reservation[];
  addReservation: (r: Reservation) => void;
  updateReservation: (r: Reservation) => void;
  cancelReservation: (id: string) => void;
}

const ReservationContext = createContext<ReservationContextType | null>(null);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>(sampleReservations);

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
