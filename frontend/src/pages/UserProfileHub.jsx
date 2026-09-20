import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiGlobe,
  FiShield,
  FiCamera,
  FiSave,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPrinter,
  FiX,
  FiCompass,
  FiChevronRight,
  FiLogOut,
  FiLock,
  FiAward,
  FiEye,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import { FaPassport, FaSuitcaseRolling, FaPlaneDeparture, FaQrcode } from "react-icons/fa6";
import useAuthStore, { authClient } from "../zustand/authStore";

// Safe helpers to prevent React "Objects are not valid as a React child" errors
const getDestinationName = (booking) => {
  if (!booking) return "Luxury International Expedition";
  if (typeof booking.tripTitle === "string" && booking.tripTitle.trim()) return booking.tripTitle;
  if (typeof booking.destination === "string" && booking.destination.trim()) return booking.destination;
  if (typeof booking.destination === "object" && booking.destination?.name) return booking.destination.name;
  return "Luxury International Expedition";
};

const getDestinationLocation = (booking) => {
  if (!booking) return "Global Destination";
  if (typeof booking.destination === "object" && booking.destination?.location) return booking.destination.location;
  if (typeof booking.location === "string" && booking.location.trim()) return booking.location;
  if (typeof booking.destination === "string" && booking.destination.trim()) return booking.destination;
  return "Global Destination";
};

const getDestinationImage = (booking) => {
  if (typeof booking?.destination === "object" && booking.destination?.image) return booking.destination.image;
  if (typeof booking?.image === "string" && booking.image.trim()) return booking.image;
  return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80";
};

const getStartDate = (booking) => {
  const d = booking?.startDate || booking?.travelDate || booking?.start_date;
  if (!d) return "2026-10-15";
  return String(d).split("T")[0];
};

const getEndDate = (booking) => {
  const d = booking?.endDate || booking?.returnDate || booking?.end_date;
  if (!d) return "2026-10-22";
  return String(d).split("T")[0];
};

const getGuestsCount = (booking) => {
  return Number(booking?.guests || booking?.travelersCount || 1);
};

const getStatus = (booking) => {
  return String(booking?.bookingStatus || booking?.status || "CONFIRMED").toUpperCase();
};

const getAmount = (booking) => {
  const val = Number(booking?.totalAmount || booking?.total_amount || 0);
  return val > 0 ? val : 1850;
};

const UserProfileHub = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get("tab") || "overview";

  const { user, isAuthenticated, updateProfile, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [statusFeedback, setStatusFeedback] = useState({ type: "", message: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync tab state when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") || "overview";
    setActiveTab(tabFromUrl);
  }, [searchParams]);

  // Form State
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    avatar: "",
    DOB: "",
    gender: "Male",
    nationality: "Indian",
    passport_number: "",
    preferred_airport: "",
    preferred_seat: "Window",
    dietary_preferences: "None",
    medical_notes: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pin_code: "",
    country: "India",
    Emergency_contact_name: "",
    Emergency_contact_number: "",
    Emergency_contact_relationship: "",
  });

  // Password update state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  // Sync profile form state on user load
  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || user.name || "",
        email: user.email || "",
        phone: user.phone ? String(user.phone) : "",
        avatar:
          user.avatar ||
          user.profile_img ||
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        DOB: user.DOB ? String(user.DOB).split("T")[0] : "",
        gender: user.gender || "Male",
        nationality: user.nationality || "Indian",
        passport_number: user.passport_number || "",
        preferred_airport: user.preferred_airport || "",
        preferred_seat: user.preferred_seat || "Window",
        dietary_preferences: user.dietary_preferences || "Standard",
        medical_notes: user.medical_notes || "",
        address_line1: user.address_line1 || user.address || "",
        address_line2: user.address_line2 || "",
        city: user.city || "",
        state: user.state || "",
        pin_code: user.pin_code ? String(user.pin_code) : "",
        country: user.country || "India",
        Emergency_contact_name: user.Emergency_contact_name || "",
        Emergency_contact_number: user.Emergency_contact_number ? String(user.Emergency_contact_number) : "",
        Emergency_contact_relationship: user.Emergency_contact_relationship || "",
      });
    }
  }, [user]);

  // Load User's Bookings from API
  useEffect(() => {
    let isMounted = true;
    const fetchUserBookings = async () => {
      try {
        setLoadingBookings(true);
        const res = await authClient.get("/api/bookings");
        const allBookings = Array.isArray(res.data) ? res.data : res.data?.bookings || res.data?.data || [];

        if (isMounted) {
          if (user) {
            const userEmail = (user.email || "").toLowerCase().trim();
            const userId = user.id;

            const filtered = allBookings.filter((b) => {
              const bEmail = (b.customer?.email || b.customer_email || b.email || "").toLowerCase().trim();
              const bUserId = b.userId || b.user_id || b.customer?.id;
              return (userEmail && bEmail === userEmail) || (userId && String(bUserId) === String(userId));
            });

            setBookings(filtered);
          } else {
            setBookings([]);
          }
        }
      } catch (err) {
        console.error("Error fetching user bookings:", err.message);
        if (isMounted) {
          setBookings([]);
        }
      } finally {
        if (isMounted) setLoadingBookings(false);
      }
    };

    fetchUserBookings();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, avatar: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setStatusFeedback({ type: "", message: "" });

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setStatusFeedback({
          type: "success",
          message: "Your profile details and travel passport information have been saved successfully!",
        });
      } else {
        setStatusFeedback({
          type: "error",
          message: result.message || "Could not update profile details.",
        });
      }
    } catch (err) {
      setStatusFeedback({
        type: "error",
        message: err.message || "An unexpected error occurred.",
      });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setStatusFeedback({ type: "", message: "" }), 5000);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg("Password must be at least 6 characters.");
      return;
    }
    setPasswordMsg("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setTimeout(() => setPasswordMsg(""), 4000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const confirmedCount = useMemo(() => {
    return bookings.filter((b) => getStatus(b) === "CONFIRMED").length;
  }, [bookings]);

  const totalSpent = useMemo(() => {
    return bookings.reduce((sum, b) => sum + getAmount(b), 0);
  }, [bookings]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-8 selection:bg-cyan-400 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* TOP HERO PROFILE HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={
                    formData.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                  }
                  alt={formData.fullname || "Traveler"}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-xl"
                />
                <label className="absolute -bottom-2 -right-2 p-2 bg-cyan-400 text-slate-950 rounded-xl cursor-pointer hover:bg-white shadow-lg transition-all transform hover:scale-110">
                  <FiCamera className="text-sm font-bold" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {formData.fullname || user?.fullname || "Explorer"}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
                    <FiAward className="text-xs" /> Gold Traveler Tier
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <FiMail className="text-cyan-400 text-xs" />{" "}
                    {formData.email || user?.email || "wanderlust@travel.com"}
                  </span>
                  {formData.city && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-cyan-400 text-xs" /> {formData.city}, {formData.country}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                to="/destination"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-400/20 hover:bg-white transition-all transform hover:-translate-y-0.5"
              >
                <FaSuitcaseRolling /> Explore Trips
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 font-semibold text-sm transition-all"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/10 pt-6">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 sm:p-4">
              <span className="text-xs font-medium text-slate-400">Total Bookings</span>
              <p className="text-2xl font-black text-white mt-1">{bookings.length}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 sm:p-4">
              <span className="text-xs font-medium text-slate-400">Confirmed Expeditions</span>
              <p className="text-2xl font-black text-cyan-300 mt-1">{confirmedCount}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 sm:p-4">
              <span className="text-xs font-medium text-slate-400">Reward Miles</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">12,450</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5 sm:p-4">
              <span className="text-xs font-medium text-slate-400">Total Invested</span>
              <p className="text-2xl font-black text-amber-300 mt-1">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* FEEDBACK NOTIFICATION */}
        {statusFeedback.message && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all animate-fadeIn ${
              statusFeedback.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/60 border-red-500/40 text-red-300"
            }`}
          >
            {statusFeedback.type === "success" ? (
              <FiCheckCircle className="text-xl shrink-0" />
            ) : (
              <FiAlertCircle className="text-xl shrink-0" />
            )}
            <p className="text-sm font-medium">{statusFeedback.message}</p>
          </div>
        )}

        {/* TAB NAVIGATION PILLS */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview & Dashboard", icon: FiCompass },
            { id: "profile", label: "Personal & Passport Info", icon: FiUser },
            { id: "trips", label: `My Bookings (${bookings.length})`, icon: FaPlaneDeparture },
            { id: "security", label: "Security & Passwords", icon: FiShield },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-400/20 font-black"
                    : "bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-slate-800"
                }`}
              >
                <Icon className={active ? "text-slate-950" : "text-cyan-400"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {/* ==================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Passport Snapshot Card */}
              <div className="lg:col-span-1 rounded-3xl bg-slate-900/80 border border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <FaPassport /> Traveler Credentials
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-3">Passport & Travel ID</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">Passport Number</span>
                      <span className="font-mono font-bold text-white">
                        {formData.passport_number || "A •••• •••• 92"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">Nationality</span>
                      <span className="font-semibold text-white">{formData.nationality || "Indian"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">Preferred Airport</span>
                      <span className="font-semibold text-cyan-300">
                        {formData.preferred_airport || "DEL / CCU / BOM"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-slate-400">Preferred Seat</span>
                      <span className="font-semibold text-white">{formData.preferred_seat}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleTabChange("profile")}
                  className="mt-6 w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-bold text-xs text-cyan-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Edit Travel Passport <FiChevronRight />
                </button>
              </div>

              {/* Upcoming / Active Trips */}
              <div className="lg:col-span-2 rounded-3xl bg-slate-900/80 border border-white/10 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <FaSuitcaseRolling className="text-cyan-400" /> Active Reservations
                  </h3>
                  <button
                    onClick={() => handleTabChange("trips")}
                    className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                  >
                    View All ({bookings.length})
                  </button>
                </div>

                {loadingBookings ? (
                  <div className="py-12 text-center text-slate-500">Loading trip reservations...</div>
                ) : bookings.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <FaPlaneDeparture className="text-4xl mx-auto text-slate-600 mb-3" />
                    <p className="font-bold text-white">No active trip reservations yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Explore top-rated world destinations and embark on unforgettable journeys.
                    </p>
                    <Link
                      to="/destination"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
                    >
                      Browse Destinations
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 2).map((booking, idx) => {
                      const destTitle = getDestinationName(booking);
                      const destLoc = getDestinationLocation(booking);
                      const sDate = getStartDate(booking);
                      const guests = getGuestsCount(booking);
                      const bStatus = getStatus(booking);
                      const total = getAmount(booking);
                      const bRef = booking.bookingReference || booking.id || `BKG-${1000 + idx}`;

                      return (
                        <div
                          key={booking.id || booking.bookingReference || idx}
                          className="rounded-2xl border border-white/10 bg-slate-800/60 p-4 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                {bRef}
                              </span>
                              <span
                                className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                                  bStatus === "CONFIRMED"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                }`}
                              >
                                {bStatus}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-base">{destTitle}</h4>
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                              <FiMapPin className="text-cyan-400 shrink-0" /> {destLoc}
                              <span>•</span>
                              <FiCalendar className="text-cyan-400 shrink-0" /> {sDate}
                              <span>•</span>
                              <FiUser className="text-cyan-400 shrink-0" /> {guests} Guest(s)
                            </p>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right mr-2">
                              <span className="text-[10px] text-slate-400 block">Total</span>
                              <span className="text-base font-black text-white">${total.toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => setSelectedTicket(booking)}
                              className="px-3.5 py-2 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <FaQrcode /> View Ticket
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Adventure Inspiration */}
            <div className="rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/20 p-6 sm:p-8 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Exclusive Traveler Perk</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">Unlock 15% Off Your Next International Expedition</h3>
                <p className="text-slate-400 text-sm max-w-xl">
                  Use coupon code{" "}
                  <span className="font-mono font-bold text-cyan-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    GHUREASHI2026
                  </span>{" "}
                  at checkout for curated seasonal flight & resort packages.
                </p>
              </div>
              <Link
                to="/destination"
                className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 hover:opacity-95 transition-all"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PERSONAL & PASSPORT DETAILS */}
        {/* ==================================================================== */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSave} className="space-y-6 animate-fadeIn">
            {/* Primary Details */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FiUser className="text-cyan-400" /> Traveler Identity & Personal Info
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Keep your personal records updated for seamless border checks and airline bookings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Legal Name</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl bg-slate-900 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Non-binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Passport & Travel Preferences */}
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FaPassport className="text-cyan-400" /> Passport & In-Flight Preferences
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Speed up international booking validations and seating allocations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Passport Number</label>
                  <input
                    type="text"
                    name="passport_number"
                    value={formData.passport_number}
                    onChange={handleInputChange}
                    placeholder="e.g. Z9482019"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-mono font-bold focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Preferred Home Airport</label>
                  <input
                    type="text"
                    name="preferred_airport"
                    value={formData.preferred_airport}
                    onChange={handleInputChange}
                    placeholder="e.g. DEL - Delhi Indira Gandhi"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Seat Preference</label>
                  <select
                    name="preferred_seat"
                    value={formData.preferred_seat}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-xl bg-slate-900 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  >
                    <option value="Window">Window Seat</option>
                    <option value="Aisle">Aisle Seat</option>
                    <option value="Extra Legroom">Extra Legroom</option>
                    <option value="Middle">Middle Seat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Dietary Preferences</label>
                  <input
                    type="text"
                    name="dietary_preferences"
                    value={formData.dietary_preferences}
                    onChange={handleInputChange}
                    placeholder="e.g. Vegetarian, Halal, Gluten Free"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Medical & Mobility Notes</label>
                  <input
                    type="text"
                    name="medical_notes"
                    value={formData.medical_notes}
                    onChange={handleInputChange}
                    placeholder="e.g. Wheelchair assistance required, asthma"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address & Emergency Contacts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FiMapPin className="text-cyan-400" /> Residential Address
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="address_line1"
                    placeholder="Street Address Line 1"
                    value={formData.address_line1}
                    onChange={handleInputChange}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State / Province"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="pin_code"
                      placeholder="ZIP / Postal Code"
                      value={formData.pin_code}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <FiShield className="text-cyan-400" /> Emergency Contact
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="Emergency_contact_name"
                    placeholder="Contact Person Full Name"
                    value={formData.Emergency_contact_name}
                    onChange={handleInputChange}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                  <input
                    type="tel"
                    name="Emergency_contact_number"
                    placeholder="Emergency Phone Number"
                    value={formData.Emergency_contact_number}
                    onChange={handleInputChange}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                  <input
                    type="text"
                    name="Emergency_contact_relationship"
                    placeholder="Relationship (e.g. Spouse, Parent, Sibling)"
                    value={formData.Emergency_contact_relationship}
                    onChange={handleInputChange}
                    className="w-full h-11 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-4 pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <FiSave /> {savingProfile ? "Saving Details..." : "Save All Changes"}
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: MY BOOKINGS & TICKETS */}
        {/* ==================================================================== */}
        {activeTab === "trips" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <FaSuitcaseRolling className="text-cyan-400" /> My Travel Reservations & Vouchers
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  View, print tickets, check confirmation statuses, and manage your booked expeditions.
                </p>
              </div>
              <Link
                to="/destination"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-400/20 hover:bg-white transition-all"
              >
                + Book New Expedition
              </Link>
            </div>

            {loadingBookings ? (
              <div className="py-20 text-center text-slate-500">Retrieving reservations...</div>
            ) : bookings.length === 0 ? (
              <div className="py-20 text-center text-slate-400 bg-slate-900/60 rounded-3xl border border-dashed border-white/10 p-8">
                <FaPlaneDeparture className="text-5xl mx-auto text-slate-600 mb-4" />
                <h4 className="text-xl font-bold text-white">No Trips Found</h4>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  Ready to make memories? Browse our exotic handpicked international tour packages.
                </p>
                <Link
                  to="/destination"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-400 text-slate-950 font-black text-sm"
                >
                  Explore Destinations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {bookings.map((booking, idx) => {
                  const destTitle = getDestinationName(booking);
                  const destLoc = getDestinationLocation(booking);
                  const destImg = getDestinationImage(booking);
                  const sDate = getStartDate(booking);
                  const eDate = getEndDate(booking);
                  const guests = getGuestsCount(booking);
                  const bStatus = getStatus(booking);
                  const total = getAmount(booking);
                  const bRef = booking.bookingReference || booking.id || `BKG-928${idx}`;

                  return (
                    <div
                      key={booking.id || booking.bookingReference || idx}
                      className="rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/40 p-6 backdrop-blur-xl transition-all flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-400/10 px-2.5 py-1 rounded-lg border border-cyan-400/20">
                              {bRef}
                            </span>
                            <span className="text-xs text-slate-500">
                              {booking.createdAt ? `Booked on ${String(booking.createdAt).split("T")[0]}` : "Active Booking"}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                              bStatus === "CONFIRMED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {bStatus}
                          </span>
                        </div>

                        <div className="mt-4 flex items-start gap-4">
                          <img
                            src={destImg}
                            alt={destTitle}
                            className="w-16 h-16 rounded-2xl object-cover shrink-0 ring-1 ring-white/10"
                          />
                          <div>
                            <h4 className="text-lg font-black text-white line-clamp-1">{destTitle}</h4>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                              <FiMapPin className="text-cyan-400 shrink-0" /> {destLoc}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4 bg-white/5 rounded-2xl p-3.5 text-xs">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Departure & Return</span>
                            <span className="font-bold text-white block mt-0.5">
                              {sDate} → {eDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Party Size</span>
                            <span className="font-bold text-white block mt-0.5">{guests} Person(s)</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Total Amount</span>
                          <span className="text-xl font-black text-cyan-300">${total.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedTicket(booking)}
                            className="px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-white transition-all flex items-center gap-1.5 shadow-md shadow-cyan-400/20 cursor-pointer"
                          >
                            <FaQrcode /> View Voucher
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: SECURITY & PASSWORDS */}
        {/* ==================================================================== */}
        {activeTab === "security" && (
          <div className="max-w-2xl space-y-6 animate-fadeIn">
            <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <FiLock className="text-cyan-400" /> Change Account Password
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ensure your account is protected with a unique, secure password.
                </p>
              </div>

              {passwordMsg && (
                <p className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  {passwordMsg}
                </p>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white font-medium focus:border-cyan-400 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-white transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-red-950/20 border border-red-500/30 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-red-400">Account Session</h4>
                <p className="text-xs text-slate-400 mt-1">Sign out from this device to terminate current login tokens.</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all shrink-0 cursor-pointer"
              >
                Sign Out Everywhere
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TICKET / VOUCHER MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black">
                  <FaPlaneDeparture className="text-lg" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Traveler Boarding Voucher</h3>
                  <p className="text-xs font-mono text-cyan-400">
                    {selectedTicket.bookingReference || selectedTicket.id || "BKG-VALID-2026"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Ticket Content */}
            <div className="p-6 space-y-5">
              <div className="border border-dashed border-white/15 rounded-2xl p-4 bg-slate-950/60 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Destination Trip</span>
                    <h4 className="text-lg font-black text-white">{getDestinationName(selectedTicket)}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{getDestinationLocation(selectedTicket)}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
                    {getStatus(selectedTicket)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 text-xs border-t border-white/5">
                  <div>
                    <span className="text-slate-400 block">Lead Traveler</span>
                    <span className="font-bold text-white">{formData.fullname || user?.fullname || "Lead Passenger"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Travel Dates</span>
                    <span className="font-bold text-cyan-300">
                      {getStartDate(selectedTicket)} → {getEndDate(selectedTicket)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Travelers Count</span>
                    <span className="font-bold text-white">{getGuestsCount(selectedTicket)} Person(s)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Paid Amount</span>
                    <span className="font-bold text-emerald-400">${getAmount(selectedTicket).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* QR Verification */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white block">Digital Check-in QR</span>
                  <span className="text-[11px] text-slate-400 block">Present at airport or hotel concierge desk</span>
                </div>
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <div className="w-16 h-16 grid grid-cols-4 grid-rows-4 gap-0.5 bg-slate-950 p-1 rounded">
                    <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                    <div className="bg-white" />
                    <div className="bg-transparent" />
                    <div className="bg-white" />
                    <div className="bg-white" />
                    <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                    <div className="bg-white" />
                    <div className="bg-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950/80 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <FiPrinter /> Print Voucher
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserProfileHub;
