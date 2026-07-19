import { User, Reservation, HotelReservationDetails, FlightReservationDetails, TaxiReservationDetails, DiningReservationDetails } from '../types/index';

interface ViewingItem {
  id: string;
  name: string;
  type: string;
  price: number;
  description?: string;
  characteristics?: string;
}

interface CurrentContext {
  userId: string;
  userName?: string;
  userPreferences?: string;
  userRecentActivity?: string;
  interfaceState: {
    currentPageName: string;
    currentPageUrl?: string;
    currentPageDescription?: string;
    viewingItems?: ViewingItem[];
  };
}

function formatReservationSummary(r: Reservation): string {
  if (r.type === 'hotel') {
    const d = r.details as HotelReservationDetails;
    return `Hotel: ${d.hotelName} (${d.checkIn} → ${d.checkOut})`;
  }
  if (r.type === 'flight') {
    const d = r.details as FlightReservationDetails;
    return `Flight: ${d.airline} ${d.flightNumber} ${d.origin}→${d.destination} on ${d.departureDate}`;
  }
  if (r.type === 'taxi') {
    const d = r.details as TaxiReservationDetails;
    return `Transfer: ${d.vehicleName} on ${d.date} at ${d.time}`;
  }
  if (r.type === 'dining') {
    const d = r.details as DiningReservationDetails;
    return `Dining: ${d.restaurantName} on ${d.date} at ${d.time}`;
  }
  return `Reservation: ${r.id}`;
}

function reservationToViewingItem(r: Reservation): ViewingItem {
  if (r.type === 'hotel') {
    const d = r.details as HotelReservationDetails;
    return { id: r.id, name: d.hotelName, type: 'Hotel Reservation', price: d.totalPrice, description: `${d.checkIn} → ${d.checkOut}`, characteristics: d.roomType };
  }
  if (r.type === 'flight') {
    const d = r.details as FlightReservationDetails;
    return { id: r.id, name: `${d.airline} ${d.flightNumber}`, type: 'Flight Reservation', price: d.totalPrice, description: `${d.origin} → ${d.destination}`, characteristics: d.departureDate };
  }
  if (r.type === 'taxi') {
    const d = r.details as TaxiReservationDetails;
    return { id: r.id, name: d.vehicleName, type: 'Transfer Reservation', price: d.totalPrice, description: `${d.pickupLocation} → ${d.dropoffLocation}`, characteristics: `${d.date} ${d.time}` };
  }
  if (r.type === 'dining') {
    const d = r.details as DiningReservationDetails;
    return { id: r.id, name: d.restaurantName, type: 'Dining Reservation', price: 0, description: `${d.date} at ${d.time}`, characteristics: `${d.partySize} guests` };
  }
  return { id: r.id, name: r.id, type: r.type, price: 0 };
}

export function buildUserContext(
  user: User,
  reservations: Reservation[],
  pageName: string,
  pageUrl: string,
  pageDescription?: string
): CurrentContext {
  const activeReservations = reservations.filter(r => r.userId === user.id && r.status !== 'cancelled');
  const recentActivity = activeReservations.length > 0
    ? `Active reservations: ${activeReservations.slice(0, 3).map(formatReservationSummary).join('; ')}`
    : 'No active reservations yet.';

  const preferences = [
    `Platform: DirectivSys Travel — Barbados`,
    `Available: 8 luxury hotels, 20 flights, 6 transfer options, 10 restaurants`,
    `Booking rules: Check-in must be future date; cancellation available anytime`,
    `Currency: USD`,
  ].join(' | ');

  return {
    userId: user.id,
    userName: user.name,
    userPreferences: preferences,
    userRecentActivity: recentActivity,
    interfaceState: {
      currentPageName: pageName,
      currentPageUrl: pageUrl,
      currentPageDescription: pageDescription || `User is on the ${pageName} page. ${activeReservations.length} active reservation(s).`,
      viewingItems: activeReservations.slice(0, 5).map(reservationToViewingItem)
    }
  };
}

export function buildGuestContext(
  pageName: string,
  pageUrl: string,
  pageDescription?: string
): CurrentContext {
  return {
    userId: 'guest',
    userPreferences: 'Guest mode: browsing only. Sign in to book hotels, flights, transfers, and dining.',
    interfaceState: {
      currentPageName: pageName,
      currentPageUrl: pageUrl,
      currentPageDescription: pageDescription || `Guest is browsing the ${pageName} page.`,
      viewingItems: []
    }
  };
}
