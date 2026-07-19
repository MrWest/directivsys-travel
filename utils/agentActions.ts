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
    characteristics: `${t.capacity} pax | ${t.features.slice(0, 2).join(', ')}`
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. searchHotels
// ─────────────────────────────────────────────────────────────────────────────
function handleSearchHotels(
  params: Record<string, unknown>,
  onNavigate?: (path: string) => void
): ToolResult {
  const { destination, guests, maxPricePerNight, minStars, keyword } = params as {
    destination?: string; guests?: number; maxPricePerNight?: number;
    minStars?: number; keyword?: string;
  };

  let results = [...hotels];

  if (destination) {
    const d = destination.toLowerCase();
    results = results.filter(h =>
      h.location.toLowerCase().includes(d) ||
      h.name.toLowerCase().includes(d) ||
      h.description.toLowerCase().includes(d)
    );
  }
  if (guests) results = results.filter(h => Math.max(...h.roomTypes.map((r: { capacity: number }) => r.capacity)) >= guests);
  if (maxPricePerNight) results = results.filter(h => h.priceFrom <= maxPricePerNight);
  if (minStars) results = results.filter(h => h.stars >= minStars);
  if (keyword) {
    const kw = keyword.toLowerCase();
    results = results.filter(h =>
      h.name.toLowerCase().includes(kw) ||
      h.description.toLowerCase().includes(kw) ||
      h.amenities.some(a => a.toLowerCase().includes(kw)) ||
      h.features.some(f => f.toLowerCase().includes(kw))
    );
  }

  if (onNavigate) onNavigate('/hotels');

  if (results.length === 0) return fail('No hotels found matching your criteria. Try adjusting your filters.');

  return {
    status: 'success',
    summary: `Found ${results.length} hotel${results.length !== 1 ? 's' : ''} matching your search. Opening the hotels catalog.`,
    result_items: results.map(hotelToItem),
    detailed_data: { hotels: results, count: results.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. checkHotelAvailability
// ─────────────────────────────────────────────────────────────────────────────
function handleCheckHotelAvailability(
  params: Record<string, unknown>,
  reservations: Reservation[],
  onNavigate?: (path: string) => void
): ToolResult {
  const { hotelId, checkIn, checkOut, guests, roomType } = params as {
    hotelId: string; checkIn: string; checkOut: string;
    guests?: number; roomType?: string;
  };

  const hotel = getHotelById(hotelId);
  if (!hotel) return fail(`Hotel "${hotelId}" not found.`);

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  if (checkInDate >= checkOutDate) return fail('Check-out must be after check-in.');

  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const conflicts = reservations.filter(r => {
    if (r.type !== 'hotel') return false;
    const d = r.details as HotelReservationDetails;
    if (d.hotelId !== hotelId) return false;
    const rIn = new Date(d.checkIn);
    const rOut = new Date(d.checkOut);
    return checkInDate < rOut && checkOutDate > rIn;
  });

  const requestedRoom = roomType
    ? hotel.roomTypes.find(rt => rt.name.toLowerCase().includes(roomType.toLowerCase()))
    : hotel.roomTypes[0];

  if (!requestedRoom) return fail(`Room type "${roomType}" not available at ${hotel.name}.`);
  if (guests && guests > requestedRoom.capacity) {
    return fail(`${requestedRoom.name} accommodates max ${requestedRoom.capacity} guests. You requested ${guests}.`);
  }

  const available = conflicts.length === 0;
  const totalPrice = requestedRoom.pricePerNight * nights;

  if (onNavigate) onNavigate(`/hotels/${hotelId}`);

  return {
    status: 'success',
    summary: available
      ? `${hotel.name} is available from ${checkIn} to ${checkOut} (${nights} nights). ${requestedRoom.name} at $${requestedRoom.pricePerNight}/night — total $${totalPrice}.`
      : `${hotel.name} is not available for those dates. Consider adjusting your dates.`,
    result_items: [hotelToItem(hotel)],
    detailed_data: { hotel, available, nights, totalPrice, roomType: requestedRoom, conflicts: conflicts.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. bookHotel
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
  if (checkInDate < new Date()) return fail('Check-in date cannot be in the past.');

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
    const rIn = new Date(d.checkIn);
    const rOut = new Date(d.checkOut);
    return checkInDate < rOut && checkOutDate > rIn;
  });
  if (conflict) return fail(`${hotel.name} is already booked for those dates.`);

  const totalPrice = requestedRoom.pricePerNight * nights;
  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`,
    type: 'hotel',
    userId,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      hotelId, hotelName: hotel.name,
      checkIn, checkOut, guests,
      roomType: requestedRoom.name,
      pricePerNight: requestedRoom.pricePerNight,
      totalPrice,
      specialRequests: specialRequests || ''
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
// 4. updateHotelBooking
// ─────────────────────────────────────────────────────────────────────────────
function handleUpdateHotelBooking(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationUpdated: (r: Reservation) => void
): ToolResult {
  const { reservationId, checkIn, checkOut, guests, roomType, specialRequests } = params as {
    reservationId: string; checkIn?: string; checkOut?: string;
    guests?: number; roomType?: string; specialRequests?: string;
  };

  const reservation = reservations.find(r => r.id === reservationId && r.type === 'hotel');
  if (!reservation) return fail(`Hotel reservation "${reservationId}" not found.`);
  if (reservation.userId !== userId) return fail('You can only update your own reservations.');

  const details = { ...reservation.details } as HotelReservationDetails;
  const hotel = getHotelById(details.hotelId);
  if (!hotel) return fail('Hotel not found.');

  if (checkIn) details.checkIn = checkIn;
  if (checkOut) details.checkOut = checkOut;
  if (guests) details.guests = guests;
  if (specialRequests !== undefined) details.specialRequests = specialRequests;

  if (roomType) {
    const room = hotel.roomTypes.find(rt => rt.name.toLowerCase().includes(roomType.toLowerCase()));
    if (!room) return fail(`Room type "${roomType}" not found at ${hotel.name}.`);
    details.roomType = room.name;
    details.pricePerNight = room.pricePerNight;
  }

  const nights = Math.ceil(
    (new Date(details.checkOut).getTime() - new Date(details.checkIn).getTime()) / (1000 * 60 * 60 * 24)
  );
  details.totalPrice = details.pricePerNight * nights;

  const updated: Reservation = { ...reservation, details };
  onReservationUpdated(updated);

  return ok(
    `Hotel booking updated. ${hotel.name} — ${details.roomType} for ${nights} nights. New total: $${details.totalPrice}.`,
    { reservation: updated }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. searchFlights
// ─────────────────────────────────────────────────────────────────────────────
function handleSearchFlights(
  params: Record<string, unknown>,
  onNavigate?: (path: string) => void
): ToolResult {
  const { origin, destination, passengers, maxPrice, cabinClass } = params as {
    origin?: string; destination?: string;
    passengers?: number; maxPrice?: number; cabinClass?: string;
  };

  let results = [...flights];

  if (origin) {
    const o = origin.toLowerCase();
    results = results.filter(f =>
      f.origin.toLowerCase().includes(o) || f.originCode.toLowerCase().includes(o)
    );
  }
  if (destination) {
    const d = destination.toLowerCase();
    results = results.filter(f =>
      f.destination.toLowerCase().includes(d) || f.destinationCode.toLowerCase().includes(d)
    );
  }
  if (passengers) results = results.filter(f => f.availableSeats.economy >= passengers);
  if (maxPrice && cabinClass) {
    results = results.filter(f => {
      const price = cabinClass === 'business' ? f.classes.business : f.classes.economy;
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

// ─────────────────────────────────────────────────────────────────────────────
// 6. bookFlight
// ─────────────────────────────────────────────────────────────────────────────
function handleBookFlight(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { flightId, departureDate, passengers, cabinClass, seatPreference } = params as {
    flightId: string; departureDate: string;
    passengers: number; cabinClass: 'economy' | 'business' | 'first'; seatPreference?: string;
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
    id: `res-${uuidv4().slice(0, 8)}`,
    type: 'flight',
    userId,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      flightId, airline: flight.airline, flightNumber: flight.flightNumber,
      origin: flight.origin, destination: flight.destination,
      departureDate, departureTime: flight.departureTime, arrivalTime: flight.arrivalTime,
      passengers, class: cabinClass, totalPrice,
      seatPreference: seatPreference || ''
    } as FlightReservationDetails
  };

  onReservationAdded(reservation);
  if (onNavigate) onNavigate('/reservations');

  return {
    status: 'success',
    summary: `Flight booked! ${flight.airline} ${flight.flightNumber} on ${departureDate} — ${cabinClass} class, ${passengers} passenger(s). Total: $${totalPrice}. Confirmation: ${reservation.id}.`,
    result_items: [flightToItem(flight)],
    detailed_data: { reservation, flight, totalPrice }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. searchTaxis
// ─────────────────────────────────────────────────────────────────────────────
function handleSearchTaxis(
  params: Record<string, unknown>,
  onNavigate?: (path: string) => void
): ToolResult {
  const { passengers, vehicleType, maxPrice } = params as {
    passengers?: number; vehicleType?: string; maxPrice?: number;
  };

  let results = [...taxis];

  if (passengers) results = results.filter(t => t.capacity >= passengers);
  if (vehicleType) results = results.filter(t => t.vehicleType.toLowerCase() === vehicleType.toLowerCase());
  if (maxPrice) results = results.filter(t => t.priceUSD <= maxPrice);

  if (onNavigate) onNavigate('/transfers');
  if (results.length === 0) return fail('No transfers found for those criteria.');

  return {
    status: 'success',
    summary: `Found ${results.length} transfer option${results.length !== 1 ? 's' : ''}. Opening the transfers catalog.`,
    result_items: results.map(taxiToItem),
    detailed_data: { taxis: results, count: results.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. bookTaxi
// ─────────────────────────────────────────────────────────────────────────────
function handleBookTaxi(
  params: Record<string, unknown>,
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { taxiId, pickupLocation, dropoffLocation, date, time, passengers, flightNumber } = params as {
    taxiId: string; pickupLocation: string; dropoffLocation: string;
    date: string; time: string; passengers: number; flightNumber?: string;
  };

  const taxi = getTaxiById(taxiId);
  if (!taxi) return fail(`Transfer "${taxiId}" not found.`);
  if (passengers > taxi.capacity) return fail(`This vehicle fits max ${taxi.capacity} passengers.`);

  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`,
    type: 'taxi',
    userId,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      taxiId, vehicleName: taxi.name,
      pickupLocation, dropoffLocation,
      date, time, passengers,
      totalPrice: taxi.priceUSD,
      flightNumber: flightNumber || ''
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
// 9. searchRestaurants
// ─────────────────────────────────────────────────────────────────────────────
function handleSearchRestaurants(
  params: Record<string, unknown>,
  onNavigate?: (path: string) => void
): ToolResult {
  const { cuisine, partySize, priceRange, keyword } = params as {
    cuisine?: string; partySize?: number; priceRange?: string; keyword?: string;
  };

  let results = [...restaurants];

  if (cuisine) results = results.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
  if (partySize) results = results.filter(r => r.maxPartySize >= partySize);
  if (priceRange) results = results.filter(r => r.priceRange === priceRange);
  if (keyword) {
    const kw = keyword.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(kw) ||
      r.description.toLowerCase().includes(kw) ||
      r.features.some(f => f.toLowerCase().includes(kw)) ||
      r.tags.some(t => t.toLowerCase().includes(kw))
    );
  }

  if (onNavigate) onNavigate('/dining');
  if (results.length === 0) return fail('No restaurants found for those criteria.');

  return {
    status: 'success',
    summary: `Found ${results.length} restaurant${results.length !== 1 ? 's' : ''}. Opening the dining catalog.`,
    result_items: results.map(restaurantToItem),
    detailed_data: { restaurants: results, count: results.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. bookDining
// ─────────────────────────────────────────────────────────────────────────────
function handleBookDining(
  params: Record<string, unknown>,
  userId: string,
  onReservationAdded: (r: Reservation) => void,
  onNavigate?: (path: string) => void
): ToolResult {
  const { restaurantId, date, time, partySize, dietaryRequirements, specialOccasion } = params as {
    restaurantId: string; date: string; time: string;
    partySize: number; dietaryRequirements?: string; specialOccasion?: string;
  };

  const restaurant = getRestaurantById(restaurantId);
  if (!restaurant) return fail(`Restaurant "${restaurantId}" not found.`);
  if (partySize > restaurant.maxPartySize) return fail(`${restaurant.name} accommodates max ${restaurant.maxPartySize} guests.`);
  if (!restaurant.timeSlots.includes(time)) {
    return fail(`${time} is not available at ${restaurant.name}. Available times: ${restaurant.timeSlots.join(', ')}.`);
  }

  const reservation: Reservation = {
    id: `res-${uuidv4().slice(0, 8)}`,
    type: 'dining',
    userId,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    details: {
      restaurantId, restaurantName: restaurant.name,
      date, time, partySize,
      dietaryRequirements: dietaryRequirements || '',
      specialOccasion: specialOccasion || ''
    } as DiningReservationDetails
  };

  onReservationAdded(reservation);
  if (onNavigate) onNavigate('/reservations');

  return {
    status: 'success',
    summary: `Dining reserved! ${restaurant.name} on ${date} at ${time} for ${partySize} guest(s). Confirmation: ${reservation.id}.`,
    result_items: [restaurantToItem(restaurant)],
    detailed_data: { reservation, restaurant }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. getMyReservations
// ─────────────────────────────────────────────────────────────────────────────
function handleGetMyReservations(
  params: Record<string, unknown>,
  reservations: Reservation[],
  userId: string,
  onNavigate?: (path: string) => void
): ToolResult {
  const { type, status } = params as { type?: string; status?: string };

  let myRes = reservations.filter(r => r.userId === userId);
  if (type) myRes = myRes.filter(r => r.type === type);
  if (status) myRes = myRes.filter(r => r.status === status);

  if (onNavigate) onNavigate('/reservations');

  if (myRes.length === 0) return ok('You have no reservations matching those criteria.', { reservations: [] });

  const typeIcon: Record<string, string> = { hotel: '🏨', flight: '✈️', taxi: '🚗', dining: '🍽️' };
  const items: ViewingItem[] = myRes.map(r => {
    const det = r.details as unknown as Record<string, unknown>;
    return {
      id: r.id,
      name: (det.hotelName || det.restaurantName || det.vehicleName || `${det.airline} ${det.flightNumber}` || r.type) as string,
      type: typeIcon[r.type] || r.type,
      price: (det.totalPrice as number) || 0,
      description: `${r.type} reservation — ${r.status}`,
      characteristics: `Date: ${(det.checkIn || det.departureDate || det.date) as string || 'N/A'}`
    };
  });

  return {
    status: 'success',
    summary: `You have ${myRes.length} reservation${myRes.length !== 1 ? 's' : ''}. Opening your reservations page.`,
    result_items: items,
    detailed_data: { reservations: myRes, count: myRes.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. cancelReservation
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

  return ok(`Reservation ${reservationId} has been cancelled successfully.`, { reservationId });
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. getAllHotels
// ─────────────────────────────────────────────────────────────────────────────
function handleGetAllHotels(onNavigate?: (path: string) => void): ToolResult {
  if (onNavigate) onNavigate('/hotels');
  return {
    status: 'success',
    summary: `There are ${hotels.length} hotels available in Barbados. Opening the hotels catalog.`,
    result_items: hotels.map(hotelToItem),
    detailed_data: { hotels, count: hotels.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. getAllRestaurants
// ─────────────────────────────────────────────────────────────────────────────
function handleGetAllRestaurants(onNavigate?: (path: string) => void): ToolResult {
  if (onNavigate) onNavigate('/dining');
  return {
    status: 'success',
    summary: `There are ${restaurants.length} restaurants available in Barbados. Opening the dining catalog.`,
    result_items: restaurants.map(restaurantToItem),
    detailed_data: { restaurants, count: restaurants.length }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. navigateTo
// ─────────────────────────────────────────────────────────────────────────────
const NAVIGATION_ROUTES: Record<string, string> = {
  home: '/',
  hotels: '/hotels',
  flights: '/flights',
  transfers: '/transfers',
  taxis: '/transfers',
  dining: '/dining',
  restaurants: '/dining',
  dashboard: '/dashboard',
  reservations: '/reservations',
  'my-reservations': '/reservations',
  login: '/login',
  'sign-in': '/login',
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
      hotel: `/hotels/${entityId}`,
      restaurant: `/dining/${entityId}`,
    };
    const path = typeMap[entityType.toLowerCase()];
    if (path) {
      onNavigate(path);
      return ok(`Navigating to ${entityType} detail page.`, { path });
    }
  }

  if (destination) {
    const path = NAVIGATION_ROUTES[destination.toLowerCase()] || '/';
    onNavigate(path);
    return ok(`Navigating to ${destination}.`, { path });
  }

  return fail('Please specify a destination or entity to navigate to.');
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. searchAll
// ─────────────────────────────────────────────────────────────────────────────
function handleSearchAll(
  params: Record<string, unknown>
): ToolResult {
  const { keyword } = params as { keyword: string };
  const kw = keyword.toLowerCase();

  const matchedHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(kw) || h.description.toLowerCase().includes(kw) ||
    h.amenities.some(a => a.toLowerCase().includes(kw)) || h.features.some(f => f.toLowerCase().includes(kw))
  );
  const matchedRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(kw) || r.description.toLowerCase().includes(kw) ||
    r.features.some(f => f.toLowerCase().includes(kw)) || r.tags.some(t => t.toLowerCase().includes(kw))
  );
  const matchedTaxis = taxis.filter(t =>
    t.name.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw) ||
    t.features.some(f => f.toLowerCase().includes(kw))
  );

  const allItems: ViewingItem[] = [
    ...matchedHotels.map(hotelToItem),
    ...matchedRestaurants.map(restaurantToItem),
    ...matchedTaxis.map(taxiToItem),
  ];

  const total = matchedHotels.length + matchedRestaurants.length + matchedTaxis.length;
  if (total === 0) return fail(`No results found for "${keyword}".`);

  return {
    status: 'success',
    summary: `Found ${total} result${total !== 1 ? 's' : ''} for "${keyword}": ${matchedHotels.length} hotel(s), ${matchedRestaurants.length} restaurant(s), ${matchedTaxis.length} transfer(s).`,
    result_items: allItems,
    detailed_data: {
      hotels: matchedHotels,
      restaurants: matchedRestaurants,
      taxis: matchedTaxis,
      total
    }
  };
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
  const { reservations, userId, onReservationAdded, onReservationUpdated, onReservationCancelled, onNavigate } = callbacks;

  return async (toolName: string, params: Record<string, unknown>): Promise<ToolResult> => {
    switch (toolName) {
      case 'searchHotels':
        return handleSearchHotels(params, onNavigate);
      case 'checkHotelAvailability':
        return handleCheckHotelAvailability(params, reservations, onNavigate);
      case 'bookHotel':
        return handleBookHotel(params, reservations, userId, onReservationAdded, onNavigate);
      case 'updateHotelBooking':
        return handleUpdateHotelBooking(params, reservations, userId, onReservationUpdated);
      case 'searchFlights':
        return handleSearchFlights(params, onNavigate);
      case 'bookFlight':
        return handleBookFlight(params, reservations, userId, onReservationAdded, onNavigate);
      case 'searchTaxis':
        return handleSearchTaxis(params, onNavigate);
      case 'bookTaxi':
        return handleBookTaxi(params, userId, onReservationAdded, onNavigate);
      case 'searchRestaurants':
        return handleSearchRestaurants(params, onNavigate);
      case 'bookDining':
        return handleBookDining(params, userId, onReservationAdded, onNavigate);
      case 'getMyReservations':
        return handleGetMyReservations(params, reservations, userId, onNavigate);
      case 'cancelReservation':
        return handleCancelReservation(params, reservations, userId, onReservationCancelled);
      case 'getAllHotels':
        return handleGetAllHotels(onNavigate);
      case 'getAllRestaurants':
        return handleGetAllRestaurants(onNavigate);
      case 'navigateTo':
        return handleNavigateTo(params, onNavigate);
      case 'searchAll':
        return handleSearchAll(params);
      default:
        return fail(`Unknown tool: ${toolName}`);
    }
  };
}

// Export sample data for use in contexts
export { sampleReservations };
