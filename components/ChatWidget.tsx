'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DirectivSysChatbox } from '@directivsys/react-sdk';
import type { ToolCall, ToolResult } from '@directivsys/react-sdk';
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../context/ReservationContext';
import { createAgentActions } from '../utils/agentActions';
import { buildUserContext, buildGuestContext } from '../utils/buildContext';
import { Reservation } from '../types/index';

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/hotels': 'Hotels Catalog',
  '/flights': 'Flights Catalog',
  '/transfers': 'Transfers Catalog',
  '/dining': 'Dining Catalog',
  '/reservations': 'My Reservations',
  '/dashboard': 'Dashboard',
  '/login': 'Sign In',
  '/search': 'Search',
};

function getPageMeta(pathname: string): { name: string; url: string } {
  if (PAGE_NAMES[pathname]) return { name: PAGE_NAMES[pathname], url: pathname };
  if (pathname.startsWith('/hotels/')) {
    const id = pathname.split('/hotels/')[1];
    return { name: `Hotel Detail: ${id}`, url: pathname };
  }
  if (pathname.startsWith('/dining/')) {
    const id = pathname.split('/dining/')[1];
    return { name: `Restaurant Detail: ${id}`, url: pathname };
  }
  return { name: 'Travel Platform', url: pathname };
}

export default function ChatWidget() {
  const { user, isAuthenticated } = useAuth();
  const { reservations, addReservation, updateReservation, cancelReservation } = useReservations();
  const pathname = usePathname();
  const router = useRouter();
  const reservationsRef = useRef<Reservation[]>(reservations);

  useEffect(() => { reservationsRef.current = reservations; }, [reservations]);

  const currentPage = getPageMeta(pathname || '/');

  const context = isAuthenticated && user
    ? buildUserContext(user, reservations, currentPage.name, currentPage.url)
    : buildGuestContext(currentPage.name, currentPage.url);

  const handleToolCall = createAgentActions({
    userId: user?.id || 'guest',
    reservations: reservationsRef.current,
    onReservationAdded: addReservation,
    onReservationUpdated: updateReservation,
    onReservationCancelled: cancelReservation,
    onNavigate: (path: string) => router.push(path),
  });

  const handleIntentDetected = async (toolCall: ToolCall): Promise<ToolResult> => {
    return handleToolCall(toolCall.toolName, toolCall.parameters as Record<string, unknown>);
  };

  return (
    <DirectivSysChatbox
      onIntentDetected={handleIntentDetected}
      currentContext={context}
      renderMode="standard"
      boxLocation="bottom-right"
      titleText="Travel Assistant"
      placeholder={
        isAuthenticated
          ? 'Book hotels, flights, transfers, dining...'
          : 'Ask about hotels, flights, or dining in Barbados...'
      }
      height="600px"
      width="420px"
      defaultOpen={false}
    />
  );
}
