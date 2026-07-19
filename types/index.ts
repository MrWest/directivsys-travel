// ─── HOTEL ───────────────────────────────────────────────────────────────────

export interface RoomType {
  id: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
  available: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  region: string;
  stars: number;
  priceFrom: number;
  description: string;
  longDescription: string;
  amenities: string[];
  features: string[];
  roomTypes: RoomType[];
  image: string;
  gallery: string[];
  coordinates?: { lat: number; lng: number };
  checkInTime: string;
  checkOutTime: string;
  tags: string[];
}

// ─── FLIGHT ──────────────────────────────────────────────────────────────────

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  durationMinutes: number;
  classes: {
    economy: number;
    business: number;
    first?: number;
  };
  availableSeats: {
    economy: number;
    business: number;
    first?: number;
  };
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ...
  image: string;
}

// ─── TAXI / TRANSFER ─────────────────────────────────────────────────────────

export interface TaxiOption {
  id: string;
  name: string;
  vehicleType: 'sedan' | 'suv' | 'minivan' | 'luxury';
  capacity: number;
  priceUSD: number;
  description: string;
  features: string[];
  estimatedMinutes: number;
  image: string;
  routes: string[]; // e.g. ["Airport → Any Hotel", "Hotel → City Center"]
}

// ─── RESTAURANT ──────────────────────────────────────────────────────────────

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  description: string;
  longDescription: string;
  amenities: string[];
  features: string[];
  dietaryOptions: string[];
  openingHours: string;
  timeSlots: string[]; // available booking times HH:mm
  maxPartySize: number;
  image: string;
  gallery: string[];
  tags: string[];
}

// ─── RESERVATIONS ────────────────────────────────────────────────────────────

export type ReservationType = 'hotel' | 'flight' | 'taxi' | 'dining';
export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface HotelReservationDetails {
  hotelId: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  pricePerNight: number;
  totalPrice: number;
  specialRequests?: string;
}

export interface FlightReservationDetails {
  flightId: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  departureTime: string;
  arrivalTime: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
  totalPrice: number;
  seatPreference?: string;
}

export interface TaxiReservationDetails {
  taxiId: string;
  vehicleName: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  passengers: number;
  totalPrice: number;
  flightNumber?: string;
}

export interface DiningReservationDetails {
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  dietaryRequirements?: string;
  specialOccasion?: string;
}

export type ReservationDetails =
  | HotelReservationDetails
  | FlightReservationDetails
  | TaxiReservationDetails
  | DiningReservationDetails;

export interface Reservation {
  id: string;
  type: ReservationType;
  userId: string;
  status: ReservationStatus;
  createdAt: string;
  details: ReservationDetails;
}

// ─── USER ────────────────────────────────────────────────────────────────────

export interface UserPreferences {
  travelStyle: string;       // e.g. 'luxury', 'adventure', 'family', 'budget', 'romantic'
  dietaryNeeds: string[];    // e.g. ['vegetarian', 'gluten-free']
  interests: string[];       // e.g. ['beaches', 'food', 'watersports']
  loyaltyTier: 'standard' | 'silver' | 'gold' | 'platinum';
  preferredClass: 'economy' | 'business' | 'first';
  tagline: string;           // short persona description shown on login card
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  preferences?: UserPreferences;
}

// ─── DIRECTIVSYS SDK ─────────────────────────────────────────────────────────

export interface ViewingItem {
  id: string;
  name: string;
  type: string;
  price: number;
  description?: string;
  characteristics?: string;
}

export interface InterfaceState {
  currentPageName: string;
  currentPageUrl?: string;
  currentPageDescription?: string;
  viewingItems?: ViewingItem[];
}

export interface CurrentContext {
  userId: string;
  userName?: string;
  userPreferences?: string;
  userRecentActivity?: string;
  interfaceState: InterfaceState;
}

// ─── TOOL RESULT ─────────────────────────────────────────────────────────────

export interface ToolResult {
  status: 'success' | 'error' | 'partial';
  summary: string;
  result_items?: ViewingItem[];
  detailed_data?: Record<string, unknown> | unknown[] | null;
}
