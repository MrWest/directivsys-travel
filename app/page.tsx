"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HOTELS as hotels,
  RESTAURANTS as restaurants,
} from "../data/sampleData";

const categories = [
  {
    href: "/hotels",
    label: "Hotels",
    icon: "🏨",
    description: "Luxury stays in Barbados",
    count: 8,
    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  },
  {
    href: "/flights",
    label: "Flights",
    icon: "✈️",
    description: "Direct & connecting routes",
    count: 20,
    color: "from-sky-500/20 to-sky-600/10 border-sky-200",
  },
  {
    href: "/transfers",
    label: "Transfers",
    icon: "🚗",
    description: "Airport & island transfers",
    count: 6,
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-200",
  },
  {
    href: "/dining",
    label: "Dining",
    icon: "🍽️",
    description: "Award-winning restaurants",
    count: 10,
    color: "from-rose-500/20 to-rose-600/10 border-rose-200",
  },
];

export default function HomePage() {
  const featuredHotels = hotels.slice(0, 3);
  const featuredRestaurants = restaurants.slice(0, 3);
  const router = useRouter();

  const [searchTab, setSearchTab] = useState<"hotels" | "flights" | "dining">(
    "hotels",
  );
  const [destination, setDestination] = useState("Barbados");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [flightFrom, setFlightFrom] = useState("");
  const [flightDate, setFlightDate] = useState("");
  const [flightClass, setFlightClass] = useState("Economy");
  const [diningDate, setDiningDate] = useState("");
  const [diningParty, setDiningParty] = useState("2");

  return (
    <div className="min-h-screen bg-white">
      {/* HERO — Concept C: vivid photo, title centered near top, smooth fade to white, subtitle+CTAs on white */}
      <section className="relative" style={{ minHeight: "calc(100vh - 64px)" }}>
        {/* Video background — full hero height, muted, looping, no audio */}
        <div className="relative w-full" style={{ height: "70vh" }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src="/hero_bg.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Smooth fade to white at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "15%",
              background:
                "linear-gradient(to top, #ffffff 0%, rgba(255,255,255,0.9) 20%, transparent 80%)",
            }}
          >
            {/* Subtitle + badge + CTAs — on white below the photo */}
            <div className="pt-3 pb-8 flex flex-col items-center px-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-600 text-sm font-medium mb-6 shadow-sm">
                <span>✨</span>
                <span>Powered by DirectivSys AI Orchestration</span>
              </div>
              <p className="text-md md:text-lg text-slate-600 text-center max-w-3xl mb-6">
                Book hotels, flights, transfers, and dining — all through a
                single AI-powered conversation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/hotels"
                  className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-base transition-all shadow-md"
                >
                  Explore Hotels
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-3.5 rounded-xl bg-white hover:bg-sky-50 text-sky-600 font-bold text-base border border-sky-200 transition-all shadow-sm"
                >
                  Sign In to Book
                </Link>
              </div>
            </div>
          </div>
          {/* Title — centered, near top of photo */}
          <div className="absolute inset-0 flex items-start justify-center pt-20 px-4 z-10">
            <h1
              className="text-5xl md:text-7xl font-extrabold text-center leading-tight"
              style={{
                color: "#ffffff",
                textShadow:
                  "0 2px 24px rgba(0,0,0,0.5), 0 1px 8px rgba(0,0,0,0.7)",
              }}
            >
              Your Barbados Dream Trip
            </h1>
          </div>
        </div>
      </section>

      {/* BOOKING SEARCH BAR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pb-12 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {(["hotels", "flights", "dining"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSearchTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                  searchTab === tab
                    ? "text-sky-600 border-b-2 border-sky-500 bg-sky-50/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Hotel Search */}
          {searchTab === "hotels" && (
            <div className="p-5 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Barbados"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="min-w-[110px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => router.push("/hotels")}
                className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all shadow-sm whitespace-nowrap"
              >
                Search Hotels
              </button>
            </div>
          )}

          {/* Flight Search */}
          {searchTab === "flights" && (
            <div className="p-5 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Flying from
                </label>
                <input
                  type="text"
                  value={flightFrom}
                  onChange={(e) => setFlightFrom(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Miami, New York…"
                />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Flying to
                </label>
                <input
                  type="text"
                  value="Barbados (BGI)"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-500 bg-slate-50 text-sm"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Departure
                </label>
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="min-w-[130px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Class
                </label>
                <select
                  value={flightClass}
                  onChange={(e) => setFlightClass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option>Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
              </div>
              <button
                onClick={() => router.push("/flights")}
                className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all shadow-sm whitespace-nowrap"
              >
                Search Flights
              </button>
            </div>
          )}

          {/* Dining Search */}
          {searchTab === "dining" && (
            <div className="p-5 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Restaurant or cuisine
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Seafood, The Cliff, beachfront…"
                />
              </div>
              <div className="min-w-[140px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Date
                </label>
                <input
                  type="date"
                  value={diningDate}
                  onChange={(e) => setDiningDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <div className="min-w-[120px]">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Party size
                </label>
                <select
                  value={diningParty}
                  onChange={(e) => setDiningParty(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "person" : "people"}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => router.push("/dining")}
                className="px-7 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm transition-all shadow-sm whitespace-nowrap"
              >
                Find a Table
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORY CARDS — Clean, professional grid. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-800 mb-3">
            Plan Every Part of Your Trip
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Explore accommodations, flights, transfers, and dining all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group p-8 rounded-2xl border border-slate-200 bg-white hover:border-sky-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-slate-800 font-bold text-xl mb-3">
                {cat.label}
              </div>
              <div className="text-slate-500 text-sm mb-4 leading-relaxed">
                {cat.description}
              </div>
              <div className="text-slate-400 text-xs font-medium">
                {cat.count} {cat.count === 1 ? 'option' : 'options'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-700">Featured Hotels</h2>
          <Link
            href="/hotels"
            className="text-sky-600 hover:text-sky-500 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredHotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-sky-200 hover:shadow-lg transition-all"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 text-sky-600 text-xs font-bold shadow-sm">
                  {"★".repeat(hotel.stars)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-slate-800 font-bold text-lg mb-1">
                  {hotel.name}
                </h3>
                <p className="text-slate-500 text-xs mb-2">
                  📍 {hotel.location}
                </p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  {hotel.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {hotel.amenities.slice(0, 2).map((a: string) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-600 text-xs"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <span className="text-sky-600 font-bold text-sm">
                    ${hotel.roomTypes[0].pricePerNight}
                    <span className="text-slate-400 font-normal text-xs">
                      /night
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOP DINING — Professional, no emojis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Top Dining Experiences
          </h2>
          <Link
            href="/dining"
            className="text-sky-600 hover:text-sky-500 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRestaurants.map((r) => (
            <Link
              key={r.id}
              href={`/dining/${r.id}`}
              className="group rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-sky-200 hover:shadow-lg transition-all"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={r.image}
                  alt={r.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 text-slate-700 text-xs font-bold shadow-sm">
                  {r.priceRange}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-slate-800 font-bold text-lg mb-1">
                  {r.name}
                </h3>
                <p className="text-slate-500 text-xs mb-2">{r.location}</p>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                  {r.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {r.cuisine}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {r.features[0]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI CTA — Sophisticated, no robot emoji */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-4 pb-20">
        <div className="rounded-3xl bg-white border border-slate-200 p-4 md:p-8 text-center">
          {/* Decorative line accent */}
          <div className="w-12 h-1 bg-sky-500 mx-auto mb-4"></div>

          <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight">
            Orchestrate Your Perfect Getaway
          </h2>

          <p className="text-slate-600 text-md max-w-3xl mx-auto mb-4 leading-relaxed">
            Describe your ideal trip in natural language. Our AI assistant handles all the details — from finding the perfect suite to booking transfers, reservations, and dining experiences — all coordinated seamlessly in a single conversation.
          </p>

          {/* Example box — subtle, professional */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
            <p className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wide">Example</p>
            <p className="text-slate-700 text-base italic">
              "I need a luxury business trip to Barbados for September 10-13. Book me a 5-star resort with golf courses, first-class flights from New York, a luxury car transfer, and fine dining reservations. I'm platinum tier, so I expect premium everything."
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/chat"
            className="inline-block px-10 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-base transition-all shadow-md"
          >
            Start Planning
          </Link>
        </div>
      </section>
    </div>
  );
}
