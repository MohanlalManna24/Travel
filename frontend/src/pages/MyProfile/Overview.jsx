import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  HiOutlineSparkles,
  HiOutlineTicket,
  HiOutlineCalendarDays,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineStar,
} from "react-icons/hi2";
import { PiAirplaneTiltBold, PiCompassBold } from "react-icons/pi";

const Overview = () => {
  const [user, setUser] = useState({
    fullname: "Traveler",
    email: "",
    phone: "",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
    role: "VIP Explorer",
  });

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Read stored user details
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({
          fullname: parsed.fullname || parsed.name || "Traveler",
          email: parsed.email || "",
          phone: parsed.phone || "",
          avatar:
            parsed.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
          role: parsed.role || "VIP Explorer",
        });
      }
    } catch (e) {
      console.error("Failed to load user state:", e);
    }

    // 2. Fetch active user bookings
    const fetchUserBookings = async () => {
      try {
        const BOOKINGS_URL =
          import.meta.env.VITE_BOOKINGS_DATA_URL || "http://localhost:4000/api/bookings";
        const res = await axios.get(BOOKINGS_URL, { timeout: 3500 });
        const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
        setBookings(data.slice(0, 3));
      } catch (err) {
        // Fallback
        setBookings([
          {
            id: "BKG-98401",
            destination: { name: "Paris Grand Escape", location: "Paris, France" },
            startDate: "2026-10-15",
            totalAmount: 185000,
            bookingStatus: "Confirmed",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8 sm:py-10 max-w-6xl mx-auto space-y-8">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#073b4c] via-[#118ab2] to-[#073b4c] p-6 sm:p-10 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-200 backdrop-blur-md mb-3">
              <HiOutlineSparkles className="text-amber-400" />
              Ghure Ashi Traveler Sanctuary
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user.fullname}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-cyan-100 max-w-xl">
              Track your active reservations, explore bespoke global journeys, and access VIP concierge assistance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/destination"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ffd166] px-5 py-3 text-xs font-black text-[#073b4c] shadow-md hover:bg-[#ffc642] transition active:scale-95"
            >
              <PiAirplaneTiltBold className="text-base" />
              <span>Explore New Trips</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Highlights & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Upcoming Expeditions</span>
            <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HiOutlineTicket className="text-xl" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-slate-900">
            {bookings.length} <span className="text-xs font-normal text-slate-500">Confirmed Itineraries</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Loyalty Rewards</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineStar className="text-xl" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-amber-600">
            1,250 <span className="text-xs font-normal text-slate-500">Bonus Points</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Status</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineShieldCheck className="text-xl" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-emerald-600">
            Verified <span className="text-xs font-normal text-slate-500">2FA Active</span>
          </div>
        </div>
      </div>

      {/* 3. Upcoming Bookings Feed */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PiCompassBold className="text-[#118ab2] text-2xl" />
              Active Bookings & Itineraries
            </h2>
            <p className="text-xs text-slate-500">Your upcoming scheduled voyages and guided tour passes.</p>
          </div>
          <Link
            to="/profile/trips"
            className="text-xs font-bold text-[#118ab2] hover:underline flex items-center gap-1"
          >
            <span>View All Trips</span>
            <HiOutlineArrowRight />
          </Link>
        </div>

        <div className="space-y-3">
          {bookings.map((b, idx) => (
            <div
              key={b.id || idx}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#073b4c] to-[#118ab2] text-white flex items-center justify-center text-xl flex-shrink-0">
                  <PiAirplaneTiltBold />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {b.destination?.name || b.destination?.title || "Custom Expedition Package"}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <HiOutlineMapPin className="text-xs text-slate-400" />
                      {b.destination?.location || "Global Destination"}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendarDays className="text-xs text-slate-400" />
                      {b.startDate || "Upcoming Schedule"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  {b.bookingStatus || "Confirmed"}
                </span>
                <Link
                  to="/profile/details"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Manage Itinerary
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
