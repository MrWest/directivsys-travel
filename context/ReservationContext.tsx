'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Reservation } from '../types/index';
import { DEMO_RESERVATIONS } from '../data/sampleData';
import { useAuth } from './AuthContext';

const RESERVATIONS_STORAGE_KEY = 'barbados_bliss_reservations';

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
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
        if (stored) {
          const allReservations: Reservation[] = JSON.parse(stored);
          setReservations(allReservations);
        } else {
          // First time: seed with demo data
          setReservations(DEMO_RESERVATIONS);
        }
      } catch (error) {
        console.error('Failed to hydrate reservations from localStorage:', error);
        setReservations(DEMO_RESERVATIONS);
      }
      setIsHydrated(true);
    }
  }, []);

  // Persist to localStorage whenever reservations change
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
      } catch (error) {
        console.error('Failed to persist reservations to localStorage:', error);
      }
    }
  }, [reservations, isHydrated]);

  // Filter by current user (if logged in)
  const userReservations = user
    ? reservations.filter(r => r.userId === user.id)
    : [];

  const addReservation = (r: Reservation) => {
    setReservations(prev => [...prev, r]);
  };

  const updateReservation = (updated: Reservation) => {
    setReservations(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const cancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' as const } : r));
  };

  return (
    <ReservationContext.Provider value={{ reservations: userReservations, addReservation, updateReservation, cancelReservation }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationProvider');
  return ctx;
}
