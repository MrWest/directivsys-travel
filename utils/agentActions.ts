import { v4 as uuidv4 } from 'uuid';
import {
  Hotel, Flight, TaxiOption, Restaurant, Reservation,
  HotelReservationDetails, FlightReservationDetails,
  TaxiReservationDetails, DiningReservationDetails,
  ToolResult, ViewingItem
} from '../types/index';
import {
  HOTELS as hotels, FLIGHTS as flights, TAXIS as taxis,
  RESTAURANTS as restaurants, DEMO_RESERVATIONS as sampleReservations,
  getHotelById, getFlightById, getTaxiById, getRestaurantById
} from '../data/sampleData';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function ok(summary: string, data: Record<string, unknown> = {}): ToolResult {
  return { status: 'success', summary, result_items: [], detailed_data: data };
}
function fail(summary: string): ToolResult {
  return { status: 'error', summary, result_items: [], detailed_data: {} };
}
function hotelToItem(h: Hotel): ViewingItem {
  return {
    id: h.id, name: h.name, type: 'Hotel',
    price: h.priceFrom,
    description: h.description,
    characteristics: `${h.stars}★ | ${h.location} | ${h.amenities.slice(0, 3).join(', ')}`
  };
}
function restaurantToItem(r: Restaurant): ViewingItem {
  const priceMap: Record<string, number> = { '$': 20, '$$': 50, '$$$': 100, '$$$$': 200 };
  return {
    id: r.id, name: r.name, type: 'Restaurant',
    price: priceMap[r.priceRange] || 50,
    description: r.description,
    characteristics: `${r.cuisine} | ${r.location} | ${r.features.slice(0, 2).join(', ')}`
  };
}
function flightToItem(f: Flight): ViewingItem {
  return {
    id: f.id, name: `${f.airline} ${f.flightNumber}`, type: 'Flight',
    price: f.classes.economy,
    description: `${f.origin} → ${f.destination}`,
    characteristics: `${f.departureTime} → ${f.arrivalTime} | ${Math.floor(f.durationMinutes / 60)}h ${f.durationMinutes % 60}m`
  };
}
function taxiToItem(t: TaxiOption): ViewingItem {
  return {
    id: t.id, name: t.name, type: 'Transfer',
    price: t.priceUSD,
    description: t.description,
    characteristics: `${t.capacity} pax | ${t.vehicleType} | ${t.features.slice(0, 2).join(', ')}`
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. searchEntities
// Unified search across hotels, flights, taxis, restaurants, or all.
// Replaces: searchHotels, searchFlights, searchTaxis, searchRestaurants, searchAll
// ─────────────────────────────────────────────────────────────────────────────
function handleSearchEntities(
  params: Record<string, unknown>,
  onNavigate?: (path: string) => void
): ToolResult {
  const {
    type, keyword, location, maxPrice, minStars,
    passengers, class: cabinClass, features
  } = params as {
    type: string;
    keyword?: string;
    location?: string;
    maxPrice?: number;
    minStars?: number;
    passengers?: number;
    class?: string;
    features?: string[];
  };

  const kw = keyword?.toLowerCase();
  const loc = location?.toLowerCase();
  const feats = features?.map(f => f.toLowerCase()) ?? [];

  if (type === 'hotel') {
    let results = [...hotels];
    if (kw) results = results.filter(h =>
      h.name.toLowerCase().includes(kw) || h.description.toLowerCase().includes(kw) ||
      h.amenities.some(a => a.toLowerCase().includes(kw)) || h.features.some(f => f.toLowerCase().includes(kw))
    );
    if (loc) results = results.filter(h => h.location.toLowerCase().includes(loc));
    if (maxPrice) results = results.filter(h => h.priceFrom <= maxPrice);
    if (minStars) results = results.filter(h => h.stars >= minStars);
    if (feats.length > 0) results = results.filter(h =>
      feats.every(feat =>
        h.amenities.some(a => a.toLowerCase().includes(feat)) ||
        h.features.some(f => f.toLowerCase().includes(feat))
      )
    );
    if (onNavigate) onNavigate('/hotels');
    if (results.length === 0) return fail('No hotels found matching your criteria. Try adjusting your filters.');
    return {
      status: 'success',
      summary: `Found ${results.length} hotel${results.length !== 1 ? 's' : ''} matching your search. Opening the hotels catalog.`,
      result_items: results.map(hotelToItem),
      detailed_data: { hotels: results, count: results.length }
    };
  }

  if (type === 'flight') {
    let results = [...flights];
    if (kw) results = results.filter(f =>
      f.airline.toLowerCase().includes(kw) || f.origin.toLowerCase().includes(kw) ||
      f.destination.toLowerCase().includes(kw) || f.originCode.toLowerCase().includes(kw) ||
      f.destinationCode.toLowerCase().includes(kw)
    );
    if (loc) results = results.filter(f =>
      f.origin.toLowerCase().includes(loc) || f.originCode.toLowerCase().includes(loc)
    );
    if (passengers) results = results.filter(f => f.availableSeats.economy >= passengers);
    if (maxPrice && cabinClass) {
      results = results.filter(f => {
        const price = cabinClass === 'business' ? f.classes.business :
          cabinClass === 'first' ? (f.classes.first || f.classes.business) : f.classes.economy;
        return price <= maxPrice;
      });
    } else if (maxPrice) {
      results = results.filter(f => f.classes.economy <= maxPrice);
    }
    if (onNavigate) onNavigate('/flights');
    if (results.length === 0) return fail('No flights found for those criteria.');
    return {
      status: 'success',
      summary: `Found ${results.length} flight${results.length !== 1 ? 's' : ''}. Opening the flights catalog.`,
      result_items: results.map(flightToItem),
      detailed_data: { flights: results, count: results.length }
    };
  }

  if (type === 'taxi') {
    let results = [...taxis];
    if (kw) results = results.filter(t =>
      t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw) ||
      t.vehicleType.toLowerCase().includes(kw) || t.features.some(f => f.toLowerCase().includes(kw))
    );
    if (passengers) results = results.filter(t => t.capacity >= passengers);
    if (maxPrice) results = results.filter(t => t.priceUSD <= maxPrice);
    if (feats.length > 0) results = results.filter(t =>
      feats.every(feat => t.features.some(f => f.toLowerCase().includes(feat)))
    );
    if (onNavigate) onNavigate('/transfers');
    if (results.length === 0) return fail('No transfers found for those criteria.');
    return {
      status: 'success',
      summary: `Found ${results.length} transfer option${results.length !== 1 ? 's' : ''}. Opening the transfers catalog.`,
      result_items: results.map(taxiToItem),
      detailed_data: { taxis: results, count: results.length }
    };
  }

  if (type === 'restaurant') {
    let results = [...restaurants];
    if (kw) results = results.filter(r =>
      r.name.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw) ||
      r.cuisine.toLowerCase().includes(kw) || r.features.some(f => f.toLowerCase().includes(kw)) ||
      r.tags.some(t => t.toLowerCase().includes(kw))
    );
    if (loc) results = results.filter(r => r.location.toLowerCase().includes(loc));
    if (feats.length > 0) results = results.filter(r =>
      feats.every(feat =>
        r.features.some(f => f.toLowerCase().includes(feat)) ||
        r.tags.some(t => t.toLowerCase().includes(feat))
      )
    );
    if (onNavigate) onNavigate('/dining');
    if (results.length === 0) return fail('No restaurants found for those criteria.');
    return {
      status: 'success',
      summary: `Found ${results.length} restaurant${results.length !== 1 ? 's' : ''}. Opening the dining catalog.`,
      result_items: results.map(restaurantToItem),
      detailed_data: { restaurants: results, count: results.length }
    };
  }

  if (type === 'all') {
    const matchedHotels = hotels.filter(h =>
      !kw || h.name.toLowerCase().includes(kw) || h.description.toLowerCase().includes(kw) ||
      h.amenities.some(a => a.toLowerCase().includes(kw)) || h.features.some(f => f.toLowerCase().includes(kw))
    );
    const matchedFlights = flights.filter(f =>
      !kw || f.airline.toLowerCase().includes(kw) || f.origin.toLowerCase().includes(kw) ||
      f.destination.toLowerCase().includes(kw)
    );
    const matchedTaxis = taxis.filter(t =>
      !kw || t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw) ||
      t.features.some(f => f.toLowerCase().includes(kw))
    );
    const matchedRestaurants = restaurants.filter(r =>
      !kw || r.name.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw) ||
      r.features.some(f => f.toLowerCase().includes(kw)) || r.tags.some(t => t.toLowerCase().includes(kw))
    );
    const allItems: ViewingItem[] = [
      ...matchedHotels.map(hotelToItem),
      ...matchedFlights.map(flightToItem),
      ...matchedTaxis.map(taxiToItem),
      ...matchedRestaurants.map(restaurantToItem),
    ];
    const total = allItems.length;
    if (total === 0) return fail(`No results found${kw ? ` for "${keyword}"` : ''}.`);
    return {
      status: 'success',
      summary: `Found ${total} result${total !== 1 ? 's' : ''}${kw ? ` for "${keyword}"` : ''}: ${matchedHotels.length} hotel(s), ${matchedFlights.length} flight(s), ${matchedTaxis.length} transfer(s), ${matchedRestaurants.length} restaurant(s).`,
      result_items: allItems,
      detailed_data: { hotels: matchedHotels, flights: matchedFlights, taxis: matchedTaxis, restaurants: matchedRestaurants, total }
    };
  }

  return fail(`Unknown entity type "${type}". Use: hotel, flight, taxi, restaurant, or all.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. getEntityDetails
// Full details for a specific entity by id + type.
// Replaces: checkHotelAvailability, getAllHotels, getAllRestaurants
// ─────────────────────────────────────────────────────────────────────────────
function handleGetEntityDetails(
  params: Record<string, unknown>,
  reservations: Reservation[],
  onNavigate?: (path: string) => void
): ToolResult {
  const { entityId, type, checkIn, checkOut, guests } = params as {
    entityId: string; type: string;
    checkIn?: string; checkOut?: string; guests?: number;
  };

  if (type === 'hotel') {
    const hotel = getHotelById(entityId);
    if (!hotel) return fail(`Hotel "${entityId}" not found.`);
    if (onNavigate) onNavigate(`/hotels/${entityId}`);
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkInDate >= checkOutDate) return fail('Check-out must be after check-in.');
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const conflicts = reservations.filter(r => {
        if (r.type !== 'hotel') return false;
        const d = r.details as HotelReservationDetails;
        if (d.hotelId !== entityId) return false;
        const rIn = new Date(d.checkIn); const rOut = new Date(d.checkOut);
        return checkInDate < rOut && checkOutDate > rIn;
      });
      const available = conflicts.length === 0;
      const roomSummary = hotel.roomTypes.map(rt => ({
        name: rt.name, pricePerNight: rt.pricePerNight,
        totalPrice: rt.pricePerNight * nights,
        capacity: rt.capacity,
        available: guests ? guests <= rt.capacity : true
      }));
      return {
        status: 'success',
        summary: available
          ? `${hotel.name} is available ${checkIn} → ${checkOut} (${nights} nights). ${hotel.roomTypes.length} room type(s) available.`
          : `${hotel.name} appears booked for those dates. Consider adjusting your dates.`,
        result_items: [hotelToItem(hotel)],
        detailed_data: { hotel, available, nights, roomTypes: roomSummary, conflicts: conflicts.length }
      };
    }
    return {
      status: 'success',
      summary: `${hotel.name} — ${hotel.stars}★ in ${hotel.location}. From $${hotel.priceFrom}/night. ${hotel.roomTypes.length} room types available.`,
      result_items: [hotelToItem(hotel)],
      detailed_data: { hotel }
    };
  }

  if (type === 'flight') {
    const flight = getFlightById(entityId);
    if (!flight) return fail(`Flight "${entityId}" not found.`);
    return {
      status: 'success',
      summary: `${flight.airline} ${flight.flightNumber}: ${flight.origin} → ${flight.destination}. Departs ${flight.departureTime}, arrives ${flight.arrivalTime}. Economy from $${flight.classes.economy}.`,
      result_items: [flightToItem(flight)],
      detailed_data: { flight }
    };
  }

  if (type === 'taxi') {
    const taxi = getTaxiById(entityId);
    if (!taxi) return fail(`Transfer "${entityId}" not found.`);
    return {
      status: 'success',
      summary: `${taxi.name}: ${taxi.vehicleType}, capacity ${taxi.capacity} pax. Base fare $${taxi.priceUSD}. Features: ${taxi.features.join(', ')}.`,
      result_items: [taxiToItem(taxi)],
      detailed_data: { taxi }
    };
  }

  if (type === 'restaurant') {
    const restaurant = getRestaurantById(entityId);
    if (!restaurant) return fail(`Restaurant "${entityId}" not found.`);
    if (onNavigate) onNavigate(`/dining/${entityId}`);
    return {
      status: 'success',
      summary: `${restaurant.name}: ${restaurant.cuisine} in ${restaurant.location}. ${restaurant.priceRange} | Max party: ${restaurant.maxPartySize}. Available times: ${restaurant.timeSlots.join(', ')}.`,
      result_items: [restaurantToItem(restaurant)],
      detailed_data: { restaurant }
    };
  }

  return fail(`Unknown entity type "${type}". Use: hotel, flight, taxi, or restaurant.`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. navigateTo
// ─────────────────────────────────────────────────────────────────────────────
const NAVIGATION_ROUTES: Record<string, string> = {
  home: '/', hotels: '/hotels', flights: '/flights',
  transfers: '/transfers', taxis: '/transfers',
  dining: '/dining', restaurants: '/dining',
  dashboard: '/dashboard', reservations: '/reservations',
  'my-reservations': '/reservations', login: '/login', 'sign-in': '/login',
};

function handleNavigateTo(
  params: Record<string, unknown>,
  onNavigate: (path: string) => void
): ToolResult {
  const { destination, entityId, entityType } = params as {
    destination?: string; entityId?: string; entityType?: string;
  };
  if (entityId && entityType) {
    const typeMap: Record<string, string> = {
      hotel: `/hotels/${entityId}`, restaurant: `/dining/${entityId}`,
      flight: '/flights', taxi: '/transfers',
    };
    const path = typeMap[entityType.toLowerCase()];
    if (path) { onNavigate(path); return ok(`Navigating to ${entityType} detail page.`, { path }); }
  }
  if (destination) {
    const path = NAVIGATION_ROUTES[destination.toLowerCase()] || '/';
    onNavigate(path);
    return ok(`Navigating to ${destination}.`, { path });
  }
  return fail('Please specify a destination or entity to navigate to.');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. bookHotel
// ─────────────────────────────────────────────────────────────────────────────
function handleBookHotel(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { hotelId, checkIn, checkOut, guests, roomType, specialRequests } = params as {
    hotelId: string; checkIn: string; checkOut: string;
    guests: number; roomType?: string; specialRequests?: string;
  };
  const hotel = getHotelById(hotelId);
  if (!hotel) return fail(`Hotel "${hotelId}" not found.`);
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkInDate >= checkOutDate) return fail('Check-out must be after check-in.');
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const requestedRoom = roomType
    ? hotel.roomTypes.find(rt => rt.name.toLowerCase().includes(roomType.toLowerCase()))
    : hotel.roomTypes[0];
  if (!requestedRoom) return fail(`Room type "${roomType}" not found at ${hotel.name}.`);
  if (guests > requestedRoom.capacity) return fail(`${requestedRoom.name} accommodates max ${requestedRoom.capacity} guests.`);
  const conflict = reservations.find(r => {
    if (r.type !== 'hotel') return false;
    const d = r.details as HotelReservationDetails;
    if (d.hotelId !== hotelId) return false;
    const rIn = new Date(d.checkIn); const rOut = new Date(d.checkOut);
    return checkInDate < rOut && checkOutDate > rIn;
  });
  if (conflict) return fail(`${hotel.name} is not available for those dates.`);
  const totalPrice = requestedRoom.pricePerNight * nights;
  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`, type: 'hotel', userId, status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      hotelId, hotelName: hotel.name, checkIn, checkOut, guests,
      roomType: requestedRoom.name, pricePerNight: requestedRoom.pricePerNight,
      totalPrice, specialRequests: specialRequests || ''
    } as HotelReservationDetails
  };
  onReservationAdded(reservation);
  if (onNavigate) onNavigate('/reservations');
  return {
    status: 'success',
    summary: `Hotel booked! ${hotel.name} — ${requestedRoom.name} for ${nights} nights (${checkIn} → ${checkOut}). Total: $${totalPrice}. Confirmation: ${reservation.id}.`,
    result_items: [hotelToItem(hotel)],
    detailed_data: { reservation, hotel, nights, totalPrice }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. bookFlight
// ─────────────────────────────────────────────────────────────────────────────
function handleBookFlight(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { flightId, date, passengers, class: cabinClass } = params as {
    flightId: string; date: string; passengers: number; class: 'economy' | 'business' | 'first';
  };
  const flight = getFlightById(flightId);
  if (!flight) return fail(`Flight "${flightId}" not found.`);
  const classPrice = cabinClass === 'business' ? flight.classes.business :
    cabinClass === 'first' ? (flight.classes.first || flight.classes.business) : flight.classes.economy;
  const availSeats = cabinClass === 'business' ? flight.availableSeats.business :
    cabinClass === 'first' ? (flight.availableSeats.first || 0) : flight.availableSeats.economy;
  if (passengers > availSeats) return fail(`Not enough ${cabinClass} seats. Only ${availSeats} available.`);
  const totalPrice = classPrice * passengers;
  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`, type: 'flight', userId, status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      flightId, airline: flight.airline, flightNumber: flight.flightNumber,
      origin: flight.origin, destination: flight.destination,
      departureDate: date, departureTime: flight.departureTime, arrivalTime: flight.arrivalTime,
      passengers, class: cabinClass, totalPrice, seatPreference: ''
    } as FlightReservationDetails
  };
  onReservationAdded(reservation);
  if (onNavigate) onNavigate('/reservations');
  return {
    status: 'success',
    summary: `Flight booked! ${flight.airline} ${flight.flightNumber} on ${date} — ${cabinClass} class, ${passengers} pax. Total: $${totalPrice}. Confirmation: ${reservation.id}.`,
    result_items: [flightToItem(flight)],
    detailed_data: { reservation, flight, totalPrice }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. bookTaxi
// ─────────────────────────────────────────────────────────────────────────────
function handleBookTaxi(
  params: Record<string, unknown>,
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { taxiId, date, time, pickupLocation, dropoffLocation, passengers, flightNumber } = params as {
    taxiId: string; date: string; time: string;
    pickupLocation: string; dropoffLocation: string;
    passengers: number; flightNumber?: string;
  };
  const taxi = getTaxiById(taxiId);
  if (!taxi) return fail(`Transfer "${taxiId}" not found.`);
  if (passengers > taxi.capacity) return fail(`This vehicle fits max ${taxi.capacity} passengers.`);
  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`, type: 'taxi', userId, status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      taxiId, vehicleName: taxi.name, pickupLocation, dropoffLocation,
      date, time, passengers, totalPrice: taxi.priceUSD, flightNumber: flightNumber || ''
    } as TaxiReservationDetails
  };
  onReservationAdded(reservation);
  if (onNavigate) onNavigate('/reservations');
  return {
    status: 'success',
    summary: `Transfer booked! ${taxi.name} on ${date} at ${time} from ${pickupLocation} to ${dropoffLocation}. Price: $${taxi.priceUSD}. Confirmation: ${reservation.id}.`,
    result_items: [taxiToItem(taxi)],
    detailed_data: { reservation, taxi }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. bookDining
// ─────────────────────────────────────────────────────────────────────────────
function handleBookDining(
  params: Record<string, unknown>,
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { restaurantId, date, time, partySize, dietaryRequirements, occasion } = params as {
    restaurantId: string; date: string; time: string;
    partySize: number; dietaryRequirements?: string; occasion?: string;
  };
  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return fail(`Restaurant "${restaurantId}" not found.`);
  if (partySize > restaurant.maxPartySize) return fail(`${restaurant.name} accommodates max ${restaurant.maxPartySize} guests.`);
  if (!restaurant.timeSlots.includes(time)) {
    return fail(`${time} is not available at ${restaurant.name}. Available times: ${restaurant.timeSlots.join(', ')}.`);
  }
  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`, type: 'dining', userId, status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      restaurantId, restaurantName: restaurant.name, date, time, partySize,
      dietaryRequirements: dietaryRequirements || '', specialOccasion: occasion || ''
    } as DiningReservationDetails
  };
  onReservationAdded(reservation);
  if (onNavigate) onNavigate('/reservations');
  return {
    status: 'success',
    summary: `Dining reserved! ${restaurant.name} on ${date} at ${time} for ${partySize} guest(s)${occasion ? ` (${occasion})` : ''}. Confirmation: ${reservation.id}.`,
    result_items: [restaurantToItem(restaurant)],
    detailed_data: { reservation, restaurant }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. getMyReservations
// ─────────────────────────────────────────────────────────────────────────────
function handleGetMyReservations(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onNavigate?: (path: string) => void
): ToolResult {
  const { type } = params as { type?: string };
  let myRes = reservations.filter(r => r.userId === userId && r.status !== 'cancelled');
  if (type) myRes = myRes.filter(r => r.type === type);
  if (onNavigate) onNavigate('/reservations');
  if (myRes.length === 0) return ok('You have no active reservations matching those criteria.', { reservations: [] });
  const typeIcon: Record<string, string> = { hotel: '🏨', flight: '✈️', taxi: '🚗', dining: '🍽️' };
  const items: ViewingItem[] = myRes.map(r => {
    const det = r.details as unknown as Record<string, unknown>;
    return {
      id: r.id,
      name: (det.hotelName || det.restaurantName || det.vehicleName ||
        (det.airline ? `${det.airline} ${det.flightNumber}` : null) || r.type) as string,
      type: typeIcon[r.type] || r.type,
      price: (det.totalPrice as number) || 0,
      description: `${r.type} reservation — ${r.status}`,
      characteristics: `Date: ${(det.checkIn || det.departureDate || det.date) as string || 'N/A'}`
    };
  });
  return {
    status: 'success',
    summary: `You have ${myRes.length} active reservation${myRes.length !== 1 ? 's' : ''}. Opening your reservations page.`,
    result_items: items,
    detailed_data: { reservations: myRes, count: myRes.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. updateReservation
// Unified update for hotel, flight, taxi, and dining reservations.
// Replaces: updateHotelBooking
// ─────────────────────────────────────────────────────────────────────────────
function handleUpdateReservation(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationUpdated: (r: Reservation) => void
): ToolResult {
  const { reservationId, newDate, newEndDate, newTime, newGuests, newClass } = params as {
    reservationId: string; newDate?: string; newEndDate?: string;
    newTime?: string; newGuests?: number; newClass?: 'economy' | 'business' | 'first';
  };
  const reservation = reservations.find(r => r.id === reservationId);
  if (!reservation) return fail(`Reservation "${reservationId}" not found.`);
  if (reservation.userId !== userId) return fail('You can only update your own reservations.');
  if (reservation.status === 'cancelled') return fail('Cannot update a cancelled reservation.');

  if (reservation.type === 'hotel') {
    const details = { ...reservation.details } as HotelReservationDetails;
    const hotel = getHotelById(details.hotelId);
    if (!hotel) return fail('Hotel not found.');
    if (newDate) details.checkIn = newDate;
    if (newEndDate) details.checkOut = newEndDate;
    if (newGuests) {
      const room = hotel.roomTypes.find(rt => rt.name === details.roomType);
      if (room && newGuests > room.capacity) return fail(`${room.name} accommodates max ${room.capacity} guests.`);
      details.guests = newGuests;
    }
    const nights = Math.ceil((new Date(details.checkOut).getTime() - new Date(details.checkIn).getTime()) / (1000 * 60 * 60 * 24));
    details.totalPrice = details.pricePerNight * nights;
    const updated: Reservation = { ...reservation, details };
    onReservationUpdated(updated);
    return ok(`Hotel booking updated. ${hotel.name} — ${details.roomType} for ${nights} nights. New total: $${details.totalPrice}.`, { reservation: updated });
  }

  if (reservation.type === 'flight') {
    const details = { ...reservation.details } as FlightReservationDetails;
    const flight = getFlightById(details.flightId);
    if (!flight) return fail('Flight not found.');
    if (newDate) details.departureDate = newDate;
    if (newGuests) details.passengers = newGuests;
    if (newClass) {
      const classPrice = newClass === 'business' ? flight.classes.business :
        newClass === 'first' ? (flight.classes.first || flight.classes.business) : flight.classes.economy;
      details.class = newClass;
      details.totalPrice = classPrice * details.passengers;
    } else {
      const classPrice = details.class === 'business' ? flight.classes.business :
        details.class === 'first' ? (flight.classes.first || flight.classes.business) : flight.classes.economy;
      details.totalPrice = classPrice * details.passengers;
    }
    const updated: Reservation = { ...reservation, details };
    onReservationUpdated(updated);
    return ok(`Flight updated. ${flight.airline} ${flight.flightNumber}${newDate ? ` on ${newDate}` : ''} — ${details.class}, ${details.passengers} pax. New total: $${details.totalPrice}.`, { reservation: updated });
  }

  if (reservation.type === 'taxi') {
    const details = { ...reservation.details } as TaxiReservationDetails;
    const taxi = getTaxiById(details.taxiId);
    if (!taxi) return fail('Transfer not found.');
    if (newDate) details.date = newDate;
    if (newTime) details.time = newTime;
    if (newGuests) {
      if (newGuests > taxi.capacity) return fail(`This vehicle fits max ${taxi.capacity} passengers.`);
      details.passengers = newGuests;
    }
    const updated: Reservation = { ...reservation, details };
    onReservationUpdated(updated);
    return ok(`Transfer updated. ${taxi.name} on ${details.date} at ${details.time}.`, { reservation: updated });
  }

  if (reservation.type === 'dining') {
    const details = { ...reservation.details } as DiningReservationDetails;
    const restaurant = getRestaurantById(details.restaurantId);
    if (!restaurant) return fail('Restaurant not found.');
    if (newDate) details.date = newDate;
    if (newTime) {
      if (!restaurant.timeSlots.includes(newTime)) {
        return fail(`${newTime} is not available at ${restaurant.name}. Available: ${restaurant.timeSlots.join(', ')}.`);
      }
      details.time = newTime;
    }
    if (newGuests) {
      if (newGuests > restaurant.maxPartySize) return fail(`${restaurant.name} accommodates max ${restaurant.maxPartySize} guests.`);
      details.partySize = newGuests;
    }
    const updated: Reservation = { ...reservation, details };
    onReservationUpdated(updated);
    return ok(`Dining updated. ${restaurant.name} on ${details.date} at ${details.time} for ${details.partySize} guest(s).`, { reservation: updated });
  }

  return fail(`Cannot update reservation of type "${reservation.type}".`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. cancelReservation
// ─────────────────────────────────────────────────────────────────────────────
function handleCancelReservation(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationCancelled: (id: string) => void
): ToolResult {
  const { reservationId } = params as { reservationId: string };
  const reservation = reservations.find(r => r.id === reservationId);
  if (!reservation) return fail(`Reservation "${reservationId}" not found.`);
  if (reservation.userId !== userId) return fail('You can only cancel your own reservations.');
  if (reservation.status === 'cancelled') return fail('This reservation is already cancelled.');
  onReservationCancelled(reservationId);
  return ok(`Reservation ${reservationId} has been successfully cancelled.`, { reservationId });
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. requestSpecialArrangement
// Concierge requests attached to an existing reservation.
// ─────────────────────────────────────────────────────────────────────────────
function handleRequestSpecialArrangement(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationUpdated: (r: Reservation) => void
): ToolResult {
  const { reservationId, arrangementType, details: arrangementDetails } = params as {
    reservationId: string; arrangementType: string; details?: string;
  };
  const reservation = reservations.find(r => r.id === reservationId);
  if (!reservation) return fail(`Reservation "${reservationId}" not found.`);
  if (reservation.userId !== userId) return fail('You can only add arrangements to your own reservations.');
  if (reservation.status === 'cancelled') return fail('Cannot add arrangements to a cancelled reservation.');

  const arrangementLabels: Record<string, string> = {
    champagne: '🥂 Champagne on arrival',
    flowers: '💐 Flower arrangement',
    cake: '🎂 Birthday/celebration cake',
    early_checkin: '⏰ Early check-in',
    late_checkout: '🕐 Late check-out',
    room_upgrade: '⬆️ Room upgrade request',
    airport_signboard: '🪧 Airport meet & greet signboard',
    dietary_prep: '🥗 Dietary preparation',
    custom: '✨ Custom arrangement',
  };

  const label = arrangementLabels[arrangementType] || arrangementType;
  const note = arrangementDetails ? ` — "${arrangementDetails}"` : '';
  const det = { ...reservation.details } as Record<string, unknown>;
  const existing = (det.specialRequests as string) || (det.specialOccasion as string) || '';
  const newNote = existing ? `${existing}; ${label}${note}` : `${label}${note}`;

  if (reservation.type === 'hotel') (det as unknown as HotelReservationDetails).specialRequests = newNote;
  if (reservation.type === 'dining') (det as unknown as DiningReservationDetails).specialOccasion = newNote;

  const updated: Reservation = { ...reservation, details: det as unknown as typeof reservation.details };
  onReservationUpdated(updated);
  return ok(
    `Special arrangement confirmed: ${label}${note} added to reservation ${reservationId}. The team will be notified.`,
    { reservationId, arrangementType, details: arrangementDetails, label }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. sendBookingConfirmation
// ─────────────────────────────────────────────────────────────────────────────
function handleSendBookingConfirmation(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string
): ToolResult {
  const { reservationId, channel = 'email' } = params as {
    reservationId: string; channel?: 'email' | 'sms' | 'push';
  };
  const reservation = reservations.find(r => r.id === reservationId);
  if (!reservation) return fail(`Reservation "${reservationId}" not found.`);
  if (reservation.userId !== userId) return fail('You can only confirm your own reservations.');
  if (reservation.status === 'cancelled') return fail('Cannot send confirmation for a cancelled reservation.');
  const channelLabel = channel === 'sms' ? 'SMS' : channel === 'push' ? 'push notification' : 'email';
  const typeLabel: Record<string, string> = {
    hotel: '🏨 hotel booking', flight: '✈️ flight booking',
    taxi: '🚗 transfer booking', dining: '🍽️ dining reservation',
  };
  return ok(
    `Confirmation ${channelLabel} sent for your ${typeLabel[reservation.type] || 'reservation'} (${reservationId}). Check your ${channel === 'email' ? 'inbox' : channel === 'sms' ? 'messages' : 'notifications'}.`,
    { reservationId, channel, type: reservation.type, status: 'sent' }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main dispatcher
// ─────────────────────────────────────────────────────────────────────────────
export interface AgentCallbacks {
  reservations: Reservation[];
  userId: string;
  onReservationAdded: (r: Reservation) => void;
  onReservationUpdated: (r: Reservation) => void;
  onReservationCancelled: (id: string) => void;
  onNavigate: (path: string) => void;
}

export function createAgentActions(callbacks: AgentCallbacks) {
  const {
    reservations, userId,
    onReservationAdded, onReservationUpdated, onReservationCancelled, onNavigate
  } = callbacks;

  return async (toolName: string, params: Record<string, unknown>): Promise<ToolResult> => {
    switch (toolName) {
      // ── Lean 12-tool canonical set ────────────────────────────────────────────
      case 'searchEntities':
        return handleSearchEntities(params, onNavigate);
      case 'getEntityDetails':
        return handleGetEntityDetails(params, reservations, onNavigate);
      case 'navigateTo':
        return handleNavigateTo(params, onNavigate);
      case 'bookHotel':
        return handleBookHotel(params, reservations, userId, onReservationAdded, onNavigate);
      case 'bookFlight':
        return handleBookFlight(params, reservations, userId, onReservationAdded, onNavigate);
      case 'bookTaxi':
        return handleBookTaxi(params, userId, onReservationAdded, onNavigate);
      case 'bookDining':
        return handleBookDining(params, userId, onReservationAdded, onNavigate);
      case 'getMyReservations':
        return handleGetMyReservations(params, reservations, userId, onNavigate);
      case 'updateReservation':
        return handleUpdateReservation(params, reservations, userId, onReservationUpdated);
      case 'cancelReservation':
        return handleCancelReservation(params, reservations, userId, onReservationCancelled);
      case 'requestSpecialArrangement':
        return handleRequestSpecialArrangement(params, reservations, userId, onReservationUpdated);
      case 'sendBookingConfirmation':
        return handleSendBookingConfirmation(params, reservations, userId);

      // ── Legacy aliases (backwards compatibility) ──────────────────────────────
      case 'searchHotels':
        return handleSearchEntities({ ...params, type: 'hotel' }, onNavigate);
      case 'searchFlights':
        return handleSearchEntities({ ...params, type: 'flight' }, onNavigate);
      case 'searchTaxis':
        return handleSearchEntities({ ...params, type: 'taxi' }, onNavigate);
      case 'searchRestaurants':
        return handleSearchEntities({ ...params, type: 'restaurant' }, onNavigate);
      case 'searchAll':
        return handleSearchEntities({ ...params, type: 'all' }, onNavigate);
      case 'getAllHotels':
        return handleSearchEntities({ type: 'hotel' }, onNavigate);
      case 'getAllRestaurants':
        return handleSearchEntities({ type: 'restaurant' }, onNavigate);
      case 'checkHotelAvailability': {
        const p = params as Record<string, unknown>;
        return handleGetEntityDetails({ ...p, type: 'hotel', entityId: p.hotelId }, reservations, onNavigate);
      }
      case 'updateHotelBooking':
        return handleUpdateReservation(params, reservations, userId, onReservationUpdated);

      default:
        return fail(`Unknown tool: "${toolName}". Available tools: searchEntities, getEntityDetails, navigateTo, bookHotel, bookFlight, bookTaxi, bookDining, getMyReservations, updateReservation, cancelReservation, requestSpecialArrangement, sendBookingConfirmation.`);
    }
  };
}

// Export sample data for use in contexts
export { sampleReservations };
