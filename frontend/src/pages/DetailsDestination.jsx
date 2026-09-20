import React, { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiImage,
  FiMapPin,
  FiUsers,
  FiShield,
  FiCheck,
  FiX,
  FiPrinter,
} from "react-icons/fi";
import { FaPlaneDeparture, FaQrcode, FaSuitcaseRolling } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../zustand/authStore";

const normalizeDestination = (payload) => {
  const data = payload?.destination || payload?.data || payload;
  if (!data || typeof data !== "object") return null;

  const rawLocation =
    data.location ||
    [data.state, data.country].filter(Boolean).join(", ") ||
    "Global Sanctuary";

  const price = Number(data.pricePerHead ?? data.price ?? 0);
  const days = Number(data.days || 3);
  const heroImg =
    data.image ||
    data.heroImage ||
    data.coverImage ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

  return {
    id: data.id,
    name: data.name || data.title || "Curated Destination",
    title: data.title || data.name || "Curated Destination",
    location: rawLocation,
    duration: `${days} Days / ${Math.max(1, days - 1)} Nights`,
    description:
      data.description ||
      "Bespoke itinerary with curated private access, 5-star luxury accommodations, gourmet dining, and private chauffeur transfers.",
    image: heroImg,
    pricePerHead: price,
    currency: "$",
    highlights: Array.isArray(data.highlights) && data.highlights.length > 0
      ? data.highlights
      : [
          {
            title: "5-Star Luxury Stay",
            description: "Private villa or palace suite with bespoke 24/7 butler service.",
            image: heroImg,
          },
          {
            title: "Private Guided Expeditions",
            description: "Dedicated local specialist and VIP priority admissions without queues.",
            image: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=800&q=80",
          },
          {
            title: "Gourmet Culinary Journey",
            description: "Private sommelier tastings and curated multi-course chef tables.",
            image: "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=800&q=80",
          },
        ],
    itinerary: Array.isArray(data.itinerary) && data.itinerary.length > 0
      ? data.itinerary
      : [
          {
            day: "Day 1",
            title: "Private Arrival & Welcome Reception",
            description: "VIP airport transfer, luxury suite check-in, and an intimate welcome dinner.",
          },
          {
            day: "Day 2",
            title: "Exclusive Private Expedition",
            description: "Full-day curated tour of iconic landmarks and private sanctuaries.",
          },
          {
            day: "Day 3",
            title: "Haute Gastronomy & Leisure",
            description: "Relaxed morning followed by bespoke culinary masterclasses and sunset excursions.",
          },
        ],
    gallery: Array.isArray(data.gallery) && data.gallery.length > 0
      ? data.gallery
      : [heroImg],
  };
};

const DetailsDestination = () => {
  const { destinationId = "1" } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [travelerCount, setTravelerCount] = useState(2);
  const [startDate, setStartDate] = useState("2026-10-15");
  const [endDate, setEndDate] = useState("2026-10-22");
  const [isTravelerMenuOpen, setIsTravelerMenuOpen] = useState(false);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [bookingError, setBookingError] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    if (user) {
      setContactName(user.fullname || user.name || "");
      setContactEmail(user.email || "");
      setContactPhone(user.phone ? String(user.phone) : "");
    }
  }, [user]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    axios
      .get(`${API_URL}/api/destinations/${destinationId}`)
      .then((res) => {
        const norm = normalizeDestination(res.data);
        setDestination(norm);
      })
      .catch((err) => {
        console.error("Error fetching destination:", err.message);
        setDestination(null);
      })
      .finally(() => setIsLoading(false));
  }, [destinationId]);

  // Close booking modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && bookingModalOpen) {
        setBookingModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bookingModalOpen]);

  const pricePerPerson = Number(destination?.pricePerHead || 0);
  const totalCalculated = pricePerPerson * travelerCount;

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      navigate("/auth/signin", { state: { from: `/destination/${destinationId}` } });
      return;
    }
    setBookingModalOpen(true);
    setBookingError("");
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsBookingSubmitting(true);
    setBookingError("");

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
      const bookingPayload = {
        customerName: contactName.trim() || user?.fullname || "Traveler",
        customerEmail: contactEmail.trim() || user?.email || "user@example.com",
        customerPhone: contactPhone.trim() || user?.phone || "N/A",
        destination: destination?.name || "Custom Trip",
        tripTitle: destination?.name || "Custom Trip",
        startDate: startDate,
        endDate: endDate,
        travelDate: startDate,
        returnDate: endDate,
        travelersCount: Number(travelerCount),
        guests: Number(travelerCount),
        totalAmount: totalCalculated,
        status: "CONFIRMED",
        paymentStatus: "PAID",
      };

      const res = await axios.post(`${API_URL}/api/bookings/create`, bookingPayload, {
        withCredentials: true,
      });

      const savedBooking = res.data?.booking || res.data?.data || res.data || {
        ...bookingPayload,
        bookingReference: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setConfirmedBooking(savedBooking);
    } catch (err) {
      console.error("Booking error:", err.message);
      setBookingError(err.response?.data?.message || "Failed to create booking reservation. Please retry.");
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="text-sm font-semibold tracking-wide">Retrieving Destination Details...</p>
        </div>
      </main>
    );
  }

  if (!destination) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 px-4 py-20">
        <div className="max-w-md w-full text-center bg-slate-900/60 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
          <h2 className="text-2xl font-black text-white mb-2">Destination Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">
            The requested destination record does not exist or may have been removed.
          </p>
          <Link
            to="/destination"
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-cyan-300 transition"
          >
            <FiArrowLeft /> Return to All Destinations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* HERO SECTION */}
      <section className="relative h-[480px] sm:h-[540px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-4 pb-12 pt-8 sm:px-6 lg:px-8">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-xl transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-slate-950"
            >
              <FiArrowLeft className="text-sm" /> Back to Destinations
            </button>
          </div>

          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-3.5 py-1 backdrop-blur-md">
                <FiClock /> {destination.duration || "5 Days / 4 Nights"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white border border-white/20 px-3.5 py-1 backdrop-blur-md">
                <FiMapPin className="text-cyan-400" /> {destination.location}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              {destination.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Highlights & Itinerary */}
          <div className="lg:col-span-8 space-y-12">
            {/* Highlights */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <FiCheckCircle className="text-cyan-400" /> Curated Experience Highlights
                </h2>
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">All-Inclusive</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 transition-all p-4 space-y-3"
                  >
                    <div className="relative aspect-16/9 overflow-hidden rounded-xl bg-slate-800">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Day-by-day Itinerary */}
            <section className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <FaPlaneDeparture className="text-cyan-400" /> Daily Expedition Itinerary
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Thoughtfully paced schedules designed for seamless exploration and luxury relaxation.
                </p>
              </div>

              <div className="space-y-4">
                {destination.itinerary.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 backdrop-blur-xl flex gap-4 items-start"
                  >
                    <div className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase whitespace-nowrap shrink-0">
                      {item.day || `Day ${idx + 1}`}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            <section className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
                  <FiImage className="text-cyan-400" /> Visual Journey
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {destination.gallery.map((img, i) => (
                  <div key={i} className="aspect-square overflow-hidden rounded-2xl border border-white/10 bg-slate-800">
                    <img src={img} alt="Gallery view" className="h-full w-full object-cover hover:scale-105 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Booking Widget Sticky Card */}
          <aside className="lg:col-span-4 sticky top-24">
            <div className="rounded-3xl border border-cyan-500/30 bg-slate-900/90 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl space-y-6">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-slate-400 block font-bold">Package Rate</span>
                  <span className="text-3xl font-black text-white">${pricePerPerson.toLocaleString()}</span>
                  <span className="text-xs text-slate-400"> / guest</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <FiCheck className="text-xs" /> Instant Voucher
                </span>
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Travel Window
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Departure Date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Return Date</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Travelers Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTravelerCount(num)}
                      className={`flex-1 h-11 rounded-xl font-bold text-xs transition-all ${
                        travelerCount === num
                          ? "bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20 font-black"
                          : "bg-white/5 text-slate-300 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>${pricePerPerson.toLocaleString()} × {travelerCount} traveler(s)</span>
                  <span className="font-semibold text-white">${totalCalculated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes & VIP Concierge</span>
                  <span className="text-emerald-400 font-bold">Included Free</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                  <span>Total Payable</span>
                  <span className="text-cyan-300 text-lg">${totalCalculated.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA Booking Button */}
              <button
                type="button"
                onClick={handleOpenBooking}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <FaSuitcaseRolling /> Book This Trip Now
              </button>
              <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <FiShield className="text-cyan-400" /> Free cancellation up to 7 days before departure.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* INSTANT BOOKING MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
            {confirmedBooking ? (
              <div className="p-6 sm:p-8 space-y-6 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400 text-slate-950 grid place-items-center text-3xl font-black mx-auto shadow-lg shadow-emerald-400/20">
                  <FiCheckCircle />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Booking Confirmed</span>
                  <h3 className="text-2xl font-black text-white mt-1">Pack Your Bags!</h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Your reservation for <strong className="text-cyan-300">{destination.name}</strong> is confirmed.
                  </p>
                </div>

                <div className="bg-slate-950 rounded-2xl border border-white/10 p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Booking Reference</span>
                    <span className="font-mono font-bold text-cyan-300">{confirmedBooking.bookingReference || "BK-CONFIRMED"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Travel Dates</span>
                    <span className="font-bold text-white">{startDate} to {endDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Travelers</span>
                    <span className="font-bold text-white">{travelerCount} Person(s)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Total Charged</span>
                    <span className="font-black text-emerald-400">${totalCalculated.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to="/profile?tab=trips"
                    className="flex-1 py-3 rounded-xl bg-cyan-400 text-slate-950 font-black text-xs hover:bg-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <FaSuitcaseRolling /> View in Profile Hub
                  </Link>
                  <button
                    onClick={() => {
                      setBookingModalOpen(false);
                      setConfirmedBooking(null);
                    }}
                    className="px-5 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-white">Confirm Travel Reservation</h3>
                    <p className="text-xs text-cyan-400">{destination.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Lead Traveler Name</label>
                    <input
                      required
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Email for Voucher Delivery</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Duration:</span>
                    <span className="font-bold text-white">{startDate} – {endDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Party Size:</span>
                    <span className="font-bold text-white">{travelerCount} Travelers</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-white/10">
                    <span>Total Investment:</span>
                    <span className="text-cyan-300">${totalCalculated.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBookingSubmitting ? "Generating Vouchers..." : "Authorize & Complete Reservation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default DetailsDestination;
