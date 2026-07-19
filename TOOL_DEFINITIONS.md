# DirectivSys Travel — AI Orchestration Tool Definitions

**Platform:** Barbados Bliss — powered by DirectivSys AI Orchestration
**Purpose:** Complete tool reference for the AI agent to fulfill the platform's core promise:
> *"Book hotels, flights, transfers, and dining — all through a single AI-powered conversation."*

This document covers every tool the AI agent needs to orchestrate — from the 16 tools already implemented to the full expanded set that would make this the most impressive travel AI demo ever built. Each tool is ready to be entered into the DirectivSys platform exactly as specified.

---

## Domain Map

| # | Domain | Tools | Status |
|---|--------|-------|--------|
| 1 | Navigation & Global Search | 2 | ✅ Implemented |
| 2 | Hotels & Accommodation | 5 | ✅ Implemented |
| 3 | Flights | 2 | ✅ Implemented |
| 4 | Transfers & Taxis | 2 | ✅ Implemented |
| 5 | Dining & Restaurants | 3 | ✅ Implemented |
| 6 | Reservation Management | 2 | ✅ Implemented |
| 7 | Trip Intelligence & Recommendations | 5 | 🆕 Proposed |
| 8 | Concierge & Experiences | 5 | 🆕 Proposed |
| 9 | Guest Profile & Preferences | 3 | 🆕 Proposed |
| 10 | Real-Time Alerts & Notifications | 3 | 🆕 Proposed |

---

## Domain 1 — Navigation & Global Search

### `navigateTo`
Navigates the user to a specific page or entity detail within the platform. Use when the user asks to go somewhere, or when a completed action should redirect to a relevant page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `destination` | string | No | Named page. Values: `home`, `hotels`, `flights`, `transfers`, `dining`, `reservations`, `dashboard`, `login`, `search` |
| `entityId` | string | No | Entity identifier to navigate to that entity's detail page |
| `entityType` | string | No | Type of entity when `entityId` is provided. Values: `hotel`, `flight`, `taxi`, `restaurant` |

---

### `searchAll`
Searches across all entity types — hotels, restaurants, and transfers — using a single keyword. Use when the user asks a broad question without specifying a category. Returns grouped results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keyword` | string | Yes | Free-text term matched against all entities. Extract the core concept: `luxury`, `beachfront`, `ocean view`, `pet-friendly`, `airport` |

---

## Domain 2 — Hotels & Accommodation

### `searchHotels`
Searches the hotel catalog based on location, price, rating, or specific features. Updates the UI to show filtered results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `location` | string | No | Area or region in Barbados. e.g. `St. James`, `West Coast`, `Bridgetown`, `South Coast` |
| `minStars` | number | No | Minimum star rating (1–5) |
| `maxPrice` | number | No | Maximum price per night in USD |
| `features` | string[] | No | Required amenities. e.g. `beachfront`, `spa`, `all-inclusive`, `adults-only`, `pool` |

**Hotels in catalog:** Sandy Lane Resort (5★, $1,200/night), Coral Reef Club (5★, $850/night), The Crane Resort (4★, $450/night), Hilton Barbados (4★, $320/night), Little Arches Boutique Hotel (4★, $280/night), Bougainvillea Beach Resort (4★, $260/night), Sea Breeze Beach House (3★, $180/night), Accra Beach Hotel (3★, $150/night).

---

### `checkHotelAvailability`
Checks if a specific hotel has rooms available for the requested dates and guest count. Returns available room types with pricing.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hotelId` | string | Yes | Hotel identifier from catalog |
| `checkIn` | string | Yes | Check-in date (YYYY-MM-DD) |
| `checkOut` | string | Yes | Check-out date (YYYY-MM-DD) |
| `guests` | number | Yes | Number of guests |

---

### `bookHotel`
Books a hotel room for the current user. Validates availability before confirming. Navigates to `/reservations` on success.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hotelId` | string | Yes | Hotel identifier |
| `roomType` | string | Yes | Room type ID to book |
| `checkIn` | string | Yes | Check-in date (YYYY-MM-DD) |
| `checkOut` | string | Yes | Check-out date (YYYY-MM-DD) |
| `guests` | number | Yes | Number of guests |
| `specialRequests` | string | No | Special requests or notes for the hotel |

---

### `updateHotelBooking`
Modifies an existing hotel reservation — change dates or guest count.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reservationId` | string | Yes | ID of the existing reservation |
| `newCheckIn` | string | No | New check-in date (YYYY-MM-DD) |
| `newCheckOut` | string | No | New check-out date (YYYY-MM-DD) |
| `newGuests` | number | No | New guest count |

---

### `getAllHotels`
Returns the complete hotel catalog with all details. Navigates to `/hotels`. Use when the user asks to see all hotels without specific filters.

*No parameters.*

---

## Domain 3 — Flights

### `searchFlights`
Searches for available flights based on origin, date, and passenger count. Updates the UI to show results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `origin` | string | No | Departure city or airport code |
| `destination` | string | No | Arrival city or airport code (usually `BGI` for Barbados) |
| `date` | string | No | Departure date (YYYY-MM-DD) |
| `passengers` | number | No | Number of passengers |
| `class` | string | No | Travel class. Values: `economy`, `business`, `first` |

**Airlines in catalog:** Caribbean Airlines (BW), British Airways (BA), American Airlines (AA), Air Canada (AC), Virgin Atlantic (VS), JetBlue (B6), LIAT (LI).

---

### `bookFlight`
Books a flight for the current user. Validates seat availability before confirming. Navigates to `/reservations` on success.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `flightId` | string | Yes | Flight identifier |
| `date` | string | Yes | Departure date (YYYY-MM-DD) |
| `passengers` | number | Yes | Number of passengers |
| `class` | string | Yes | Travel class: `economy`, `business`, `first` |

---

## Domain 4 — Transfers & Taxis

### `searchTaxis`
Searches for available transfer or taxi options based on vehicle type, capacity, or route. Updates the UI to show results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `vehicleType` | string | No | Vehicle type. Values: `sedan`, `suv`, `minivan`, `luxury` |
| `passengers` | number | No | Minimum passenger capacity required |
| `route` | string | No | General route description. e.g. `airport to hotel`, `island tour` |

**Vehicles in catalog:** Island Express Sedan ($35, 3 pax), Caribbean SUV ($55, 6 pax), Group Minivan ($75, 10 pax), Luxury Executive Mercedes ($95, 3 pax), Island Tour SUV ($120, 5 pax, full day), Budget Sedan ($25, 3 pax).

---

### `bookTaxi`
Books a taxi or transfer for the current user. Navigates to `/reservations` on success.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taxiId` | string | Yes | Taxi/transfer identifier |
| `date` | string | Yes | Pickup date (YYYY-MM-DD) |
| `time` | string | Yes | Pickup time (HH:mm) |
| `pickupLocation` | string | Yes | Starting location. e.g. `Grantley Adams Airport`, `Sandy Lane Resort` |
| `dropoffLocation` | string | Yes | Destination location |
| `passengers` | number | Yes | Number of passengers |
| `flightNumber` | string | No | Flight number for airport pickups to enable flight tracking |

---

## Domain 5 — Dining & Restaurants

### `searchRestaurants`
Searches the restaurant catalog based on cuisine, location, price, or vibe. Updates the UI to show results.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cuisine` | string | No | Type of food. e.g. `Seafood`, `Caribbean`, `Italian`, `International` |
| `location` | string | No | Target area. e.g. `Holetown`, `St. Lawrence Gap`, `Bridgetown` |
| `priceRange` | string | No | Price range. Values: `$`, `$$`, `$$$`, `$$$$` |
| `keyword` | string | No | Feature or characteristic. e.g. `beachfront`, `sunset view`, `outdoor`, `romantic`, `live music` |

**Restaurants in catalog:** The Cliff ($$$$, International Fine Dining), Cin Cin By The Sea ($$$, Italian-Mediterranean), The Tides ($$$$, International Fine Dining), Lobster Alive ($$$, Seafood), Oistins Fish Fry ($$, Caribbean), The Boatyard ($$, Caribbean & International), Surfs Barbados ($$, Caribbean & Grill), Café Luna ($$$, Mediterranean), The Cocktail Kitchen ($$$, Modern Caribbean).

---

### `bookDining`
Books a restaurant reservation for the current user. Validates party size and available time slots before confirming. Navigates to `/reservations` on success.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `restaurantId` | string | Yes | Restaurant identifier from catalog |
| `date` | string | Yes | Reservation date (YYYY-MM-DD) |
| `time` | string | Yes | Reservation time (HH:mm) — must match an available slot |
| `partySize` | number | Yes | Number of diners |
| `dietaryRequirements` | string | No | Dietary restrictions or preferences |
| `occasion` | string | No | Special occasion note. e.g. `anniversary`, `birthday`, `proposal` |

---

### `getAllRestaurants`
Returns the complete restaurant catalog. Navigates to `/dining`. Use when the user asks to see all restaurants without specific filters.

*No parameters.*

---

## Domain 6 — Reservation Management

### `getMyReservations`
Returns all active reservations for the current user. Optionally filtered by type. Navigates to `/reservations`. Use before cancel or update operations to find the correct `reservationId`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | string | No | Filter by type. Values: `hotel`, `flight`, `taxi`, `dining`. Omit to return all. |

---

### `cancelReservation`
Cancels an existing reservation owned by the current user. Use `getMyReservations` first to find the correct `reservationId`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reservationId` | string | Yes | ID of the reservation to cancel |

---

## Domain 7 — Trip Intelligence & Recommendations 🆕

These tools give the AI the ability to reason about the user's full trip context and make smart, proactive suggestions — turning the AI from a booking clerk into a genuine travel concierge.

### `buildTripItinerary`
Assembles a complete day-by-day itinerary from the user's existing reservations, filling gaps with AI-generated suggestions for activities, dining, and transfers.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Current user ID |
| `startDate` | string | Yes | Trip start date (YYYY-MM-DD) |
| `endDate` | string | Yes | Trip end date (YYYY-MM-DD) |
| `interests` | string[] | No | User interests. e.g. `beaches`, `food`, `history`, `watersports`, `nightlife` |

---

### `getWeatherForecast`
Returns a 7-day weather forecast for Barbados to help the user plan outdoor activities, beach days, and transfers.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | Start date for forecast (YYYY-MM-DD) |
| `days` | number | No | Number of days to forecast (1–7, default 7) |

---

### `recommendHotel`
Recommends the best hotel match based on the user's stated preferences, budget, travel dates, and party composition.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `budget` | number | No | Maximum budget per night in USD |
| `partyType` | string | No | Type of travel party. Values: `couple`, `family`, `solo`, `group`, `business` |
| `priorities` | string[] | No | What matters most. e.g. `beach access`, `spa`, `kids club`, `adults only`, `value` |
| `checkIn` | string | No | Check-in date (YYYY-MM-DD) |
| `checkOut` | string | No | Check-out date (YYYY-MM-DD) |

---

### `recommendRestaurant`
Recommends the best restaurant match for a specific occasion, mood, or dietary need.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `occasion` | string | No | Purpose of the meal. e.g. `romantic dinner`, `family lunch`, `business dinner`, `birthday` |
| `mood` | string | No | Desired vibe. e.g. `casual`, `fine dining`, `lively`, `quiet`, `beachfront` |
| `dietaryNeeds` | string[] | No | Dietary requirements. e.g. `vegetarian`, `vegan`, `gluten-free`, `halal` |
| `budget` | string | No | Price range. Values: `$`, `$$`, `$$$`, `$$$$` |

---

### `getPriceEstimate`
Calculates a total estimated cost for a proposed trip based on hotel, flights, transfers, and dining selections — before the user commits to booking anything.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hotelId` | string | No | Hotel to include in estimate |
| `checkIn` | string | No | Check-in date (YYYY-MM-DD) |
| `checkOut` | string | No | Check-out date (YYYY-MM-DD) |
| `flightId` | string | No | Flight to include |
| `passengers` | number | No | Number of passengers |
| `flightClass` | string | No | Flight class for pricing |
| `taxiId` | string | No | Transfer to include |
| `restaurantIds` | string[] | No | Restaurants to include (one dinner per night estimate) |

---

## Domain 8 — Concierge & Experiences 🆕

These tools extend the AI beyond booking into genuine island concierge territory — the kind of service that makes guests feel looked after.

### `getIslandActivities`
Returns a curated list of activities and experiences available in Barbados, filtered by type, date, or location.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Activity category. Values: `watersports`, `sightseeing`, `nightlife`, `culture`, `wellness`, `adventure`, `family` |
| `date` | string | No | Date of activity (YYYY-MM-DD) |
| `location` | string | No | Area of Barbados |
| `maxPrice` | number | No | Maximum price per person in USD |

---

### `bookActivity`
Books an activity or experience for the current user.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `activityId` | string | Yes | Activity identifier |
| `date` | string | Yes | Date of activity (YYYY-MM-DD) |
| `participants` | number | Yes | Number of participants |
| `specialRequirements` | string | No | Any special needs or notes |

---

### `getHotelAmenityInfo`
Returns detailed information about a specific hotel's amenities, services, and policies — check-in time, spa hours, pool access, pet policy, etc.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `hotelId` | string | Yes | Hotel identifier |
| `amenity` | string | No | Specific amenity to query. e.g. `spa`, `pool`, `restaurant`, `gym`, `beach`, `parking` |

---

### `requestSpecialArrangement`
Submits a special arrangement request to a hotel or restaurant — champagne on arrival, birthday cake, anniversary decoration, early check-in, late check-out, etc.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reservationId` | string | Yes | The reservation to attach the request to |
| `arrangementType` | string | Yes | Type of arrangement. Values: `champagne`, `flowers`, `cake`, `early_checkin`, `late_checkout`, `room_upgrade`, `airport_signboard`, `dietary_prep`, `custom` |
| `details` | string | No | Free-text description of the specific request |

---

### `getSunriseSunsetTimes`
Returns sunrise and sunset times for Barbados for a given date range — useful for planning sunset dinners, sunrise beach walks, or photography.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date` | string | Yes | Date to query (YYYY-MM-DD) |
| `days` | number | No | Number of consecutive days (1–14, default 1) |

---

## Domain 9 — Guest Profile & Preferences 🆕

These tools allow the AI to build a persistent understanding of the guest across the conversation, enabling truly personalized service.

### `getUserProfile`
Returns the current user's profile, saved preferences, and loyalty status.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Current user ID |

---

### `updateUserPreferences`
Saves the user's stated preferences for future recommendations — dietary needs, preferred hotel style, travel companions, etc.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dietaryRequirements` | string[] | No | Dietary needs. e.g. `vegetarian`, `vegan`, `gluten-free`, `nut allergy` |
| `hotelStyle` | string | No | Preferred hotel style. Values: `luxury`, `boutique`, `family`, `budget`, `adults-only` |
| `travelCompanions` | string | No | Who they typically travel with. Values: `solo`, `partner`, `family`, `friends`, `business` |
| `interests` | string[] | No | Travel interests. e.g. `beaches`, `food`, `history`, `watersports`, `nightlife`, `wellness` |
| `currency` | string | No | Preferred currency for price display. Values: `USD`, `GBP`, `EUR`, `CAD` |

---

### `getBookingHistory`
Returns the user's past booking history for context — useful for repeat guests or when the AI needs to reference a previous stay.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Current user ID |
| `limit` | number | No | Maximum number of past bookings to return (default 5) |

---

## Domain 10 — Real-Time Alerts & Notifications 🆕

These tools give the AI the ability to proactively inform the user about things that affect their trip.

### `checkFlightStatus`
Returns the real-time status of a specific flight — on time, delayed, gate information, etc.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `flightNumber` | string | Yes | IATA flight number. e.g. `BW401`, `BA2157` |
| `date` | string | Yes | Flight date (YYYY-MM-DD) |

---

### `sendBookingConfirmation`
Sends a booking confirmation summary to the user via their registered email or in-app notification.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reservationId` | string | Yes | The reservation to confirm |
| `channel` | string | No | Delivery channel. Values: `email`, `sms`, `push`. Default: `email` |

---

### `checkTransferReadiness`
Verifies that a booked transfer is confirmed, the driver has been assigned, and the pickup time aligns with the user's flight arrival or hotel check-in.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reservationId` | string | Yes | Transfer reservation ID |
| `flightNumber` | string | No | Associated flight number to cross-check arrival time |

---

## Conversation Flow Examples

The following examples illustrate how the AI chains multiple tools together in a single conversation to deliver a complete travel experience.

**Scenario A — First-time visitor, blank slate:**
> "I want to visit Barbados for a week in August with my partner. We love the beach, good food, and a bit of luxury."

The AI would call: `recommendHotel` → `checkHotelAvailability` → `searchFlights` → `bookFlight` → `bookHotel` → `bookTaxi` (airport pickup) → `recommendRestaurant` × 3 → `buildTripItinerary`

**Scenario B — Romantic anniversary trip:**
> "Book me a table at The Cliff for our anniversary on the 15th, and arrange champagne at the hotel."

The AI would call: `bookDining` (with `occasion: anniversary`) → `getMyReservations` → `requestSpecialArrangement` (champagne + room decoration)

**Scenario C — Last-minute change:**
> "My flight got delayed. Can you push my airport transfer back two hours?"

The AI would call: `getMyReservations` → `cancelReservation` (old taxi) → `searchTaxis` → `bookTaxi` (new time)

**Scenario D — Full trip from scratch in one conversation:**
> "Plan everything for me — 5 nights, 2 people, budget around $500/night, arriving from London."

The AI would call: `searchFlights` (LHR→BGI) → `searchHotels` (maxPrice:500) → `checkHotelAvailability` → `bookFlight` → `bookHotel` → `bookTaxi` (airport pickup) → `getWeatherForecast` → `recommendRestaurant` × 5 → `bookDining` × 2 → `getIslandActivities` → `buildTripItinerary` → `getPriceEstimate` → `sendBookingConfirmation`

---

## Tool ID Reference

| toolId | toolName | Domain | Status |
|--------|----------|--------|--------|
| 1 | `searchHotels` | Hotels | ✅ |
| 2 | `checkHotelAvailability` | Hotels | ✅ |
| 3 | `bookHotel` | Hotels | ✅ |
| 4 | `updateHotelBooking` | Hotels | ✅ |
| 5 | `searchFlights` | Flights | ✅ |
| 6 | `bookFlight` | Flights | ✅ |
| 7 | `searchTaxis` | Transfers | ✅ |
| 8 | `bookTaxi` | Transfers | ✅ |
| 9 | `searchRestaurants` | Dining | ✅ |
| 10 | `bookDining` | Dining | ✅ |
| 11 | `getMyReservations` | Reservations | ✅ |
| 12 | `cancelReservation` | Reservations | ✅ |
| 13 | `getAllHotels` | Hotels | ✅ |
| 14 | `getAllRestaurants` | Dining | ✅ |
| 15 | `navigateTo` | Navigation | ✅ |
| 16 | `searchAll` | Navigation | ✅ |
| 17 | `buildTripItinerary` | Trip Intelligence | 🆕 |
| 18 | `getWeatherForecast` | Trip Intelligence | 🆕 |
| 19 | `recommendHotel` | Trip Intelligence | 🆕 |
| 20 | `recommendRestaurant` | Trip Intelligence | 🆕 |
| 21 | `getPriceEstimate` | Trip Intelligence | 🆕 |
| 22 | `getIslandActivities` | Concierge | 🆕 |
| 23 | `bookActivity` | Concierge | 🆕 |
| 24 | `getHotelAmenityInfo` | Concierge | 🆕 |
| 25 | `requestSpecialArrangement` | Concierge | 🆕 |
| 26 | `getSunriseSunsetTimes` | Concierge | 🆕 |
| 27 | `getUserProfile` | Guest Profile | 🆕 |
| 28 | `updateUserPreferences` | Guest Profile | 🆕 |
| 29 | `getBookingHistory` | Guest Profile | 🆕 |
| 30 | `checkFlightStatus` | Alerts | 🆕 |
| 31 | `sendBookingConfirmation` | Alerts | 🆕 |
| 32 | `checkTransferReadiness` | Alerts | 🆕 |

---

*Generated by Manus AI — DirectivSys Travel Platform*
