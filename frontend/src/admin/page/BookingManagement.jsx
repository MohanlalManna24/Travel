import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  HiOutlineTicket,
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineArrowPath,
  HiOutlineCurrencyRupee,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineUserGroup,
  HiOutlineCreditCard,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineArrowUpTray,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlinePlus,
  HiOutlinePrinter,
} from "react-icons/hi2";
import { AdminToast } from "../components/AdminToast";

const BookingManagement = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBookingStatus, setSelectedBookingStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // "create" | "edit" | "view"
  const [currentBooking, setCurrentBooking] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' | 'info' }

  // Form State for create / edit
  const initialFormState = {
    id: "",
    customer: {
      name: "",
      email: "",
      phone: "",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
      city: "Kolkata, India",
    },
    destination: {
      id: "destination-1",
      name: "Paris Grand Escape",
      location: "Paris, France",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS-8XeEWA3EoWb2GUYM5ihW5eV5pWQCcdbPl_a8dOjDw&s=10",
    },
    startDate: "2026-10-15",
    endDate: "2026-10-19",
    guests: 2,
    totalAmount: 79998,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card (Visa)",
    transactionId: "TXN-88492019",
    bookingStatus: "Confirmed",
    specialNotes: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // API Endpoint
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const BOOKINGS_URL = import.meta.env.VITE_BOOKINGS_DATA_URL || `${API_BASE_URL}/api/bookings`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // ---------------------------------------------------------------------------
  // DATA FETCHING VIA API
  // ---------------------------------------------------------------------------
  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      let response;
      try {
        response = await axios.get(BOOKINGS_URL);
      } catch (backendErr) {
        console.warn("Backend bookings endpoint failed, falling back to /bookingsData.json:", backendErr);
        response = await axios.get("/bookingsData.json");
      }

      const rawData = response.data;
      const fetchedBookings = Array.isArray(rawData)
        ? rawData
        : rawData?.bookings || rawData?.data || [];

      if (Array.isArray(fetchedBookings)) {
        setBookings(fetchedBookings);
      } else {
        throw new Error("Invalid format received from server");
      }
    } catch (err) {
      console.error("Failed to fetch booking records:", err);
      setError("Unable to load booking records. Please check the network connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ---------------------------------------------------------------------------
  // FILTERING, SEARCHING & SORTING LOGIC
  // ---------------------------------------------------------------------------
  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    // Search query filter (customer name, email, phone, destination, ID)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.customer?.name?.toLowerCase().includes(q) ||
          b.customer?.email?.toLowerCase().includes(q) ||
          b.customer?.phone?.toLowerCase().includes(q) ||
          b.destination?.name?.toLowerCase().includes(q) ||
          b.destination?.location?.toLowerCase().includes(q) ||
          b.id?.toLowerCase().includes(q) ||
          b.transactionId?.toLowerCase().includes(q)
      );
    }

    // Booking Status filter
    if (selectedBookingStatus !== "all") {
      result = result.filter((b) => b.bookingStatus === selectedBookingStatus);
    }

    // Payment Status filter
    if (selectedPaymentStatus !== "all") {
      result = result.filter((b) => b.paymentStatus === selectedPaymentStatus);
    }

    // Sorting
    if (sortBy === "amount-desc") {
      result.sort((a, b) => Number(b.totalAmount || 0) - Number(a.totalAmount || 0));
    } else if (sortBy === "amount-asc") {
      result.sort((a, b) => Number(a.totalAmount || 0) - Number(b.totalAmount || 0));
    } else if (sortBy === "date-desc") {
      result.sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
    } else if (sortBy === "guests-desc") {
      result.sort((a, b) => Number(b.guests || 0) - Number(a.guests || 0));
    }

    return result;
  }, [bookings, searchQuery, selectedBookingStatus, selectedPaymentStatus, sortBy]);

  // Calculated Metrics
  const stats = useMemo(() => {
    const totalCount = bookings.length;
    const confirmedCount = bookings.filter((b) => b.bookingStatus === "Confirmed").length;
    const pendingCount = bookings.filter((b) => b.bookingStatus === "Pending" || b.paymentStatus === "Pending").length;
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "Paid")
      .reduce((acc, curr) => acc + (Number(curr.totalAmount) || 0), 0);

    return { totalCount, confirmedCount, pendingCount, totalRevenue };
  }, [bookings]);

  // ---------------------------------------------------------------------------
  // HANDLERS (Create, Edit, View, Delete, Export, Print)
  // ---------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      ...initialFormState,
      id: `BKG-${Math.floor(90000 + Math.random() * 9999)}`,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (booking) => {
    setModalMode("edit");
    setCurrentBooking(booking);
    setFormData({
      ...booking,
    });
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (booking) => {
    setModalMode("view");
    setCurrentBooking(booking);
    setFormData({
      ...booking,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer?.name?.trim() || !formData.destination?.name?.trim()) {
      showToast("Please fill in customer and destination information.", "error");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      bookingReference: formData.id,
      customerName: formData.customer.name,
      customerEmail: formData.customer.email,
      customerPhone: formData.customer.phone,
      customerCity: formData.customer.city,
      customerAvatar: formData.customer.avatar,
      destinationName: formData.destination.name,
      destinationLocation: formData.destination.location,
      destinationImage: formData.destination.image,
      guests: Number(formData.guests || 1),
      totalAmount: Number(formData.totalAmount || 0),
    };

    try {
      if (modalMode === "create") {
        let created = null;
        try {
          const res = await axios.post(`${API_BASE_URL}/api/bookings`, payload, {
            withCredentials: true,
          });
          if (res.data?.booking || res.data?.data) {
            created = res.data.booking || res.data.data;
          }
        } catch (apiErr) {
          console.warn("POST /api/bookings failed:", apiErr);
        }

        const finalBooking = created || payload;
        setBookings((prev) => [finalBooking, ...prev]);
        showToast(`Booking #${payload.id} successfully created!`, "success");
      } else {
        const targetId = payload.db_id || payload.bookingReference || payload.id;
        let updatedBooking = payload;
        try {
          const res = await axios.put(`${API_BASE_URL}/api/bookings/${targetId}`, payload, {
            withCredentials: true,
          });
          if (res.data?.booking || res.data?.data) {
            updatedBooking = res.data.booking || res.data.data;
          }
        } catch (apiErr) {
          console.warn(`PUT /api/bookings/${targetId} failed:`, apiErr);
        }

        setBookings((prev) =>
          prev.map((b) =>
            b.id === payload.id || b.db_id === payload.db_id ? updatedBooking : b
          )
        );
        showToast(`Booking #${payload.id} updated!`, "success");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving booking:", err);
      showToast("An error occurred while saving the reservation.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!id) return;
    setDeleting(true);

    try {
      const target = bookings.find((b) => b.id === id || b.db_id === id);
      const targetId = target?.db_id || target?.bookingReference || id;

      try {
        await axios.delete(`${API_BASE_URL}/api/bookings/${targetId}`, {
          withCredentials: true,
        });
      } catch (apiErr) {
        console.warn(`DELETE /api/bookings/${targetId} failed:`, apiErr);
      }

      setBookings((prev) => prev.filter((b) => b.id !== id && b.db_id !== id));
      setDeleteConfirmId(null);
      showToast(`Reservation #${id} was cancelled & removed.`, "success");
    } catch (err) {
      console.error("Error removing booking:", err);
      showToast(`Failed to cancel booking: ${err.message}`, "error");
    } finally {
      setDeleting(false);
    }
  };


  const handleExportCSV = () => {
    if (!bookings.length) return;
    const headers = [
      "BookingID",
      "CustomerName",
      "CustomerEmail",
      "Phone",
      "Destination",
      "StartDate",
      "EndDate",
      "Guests",
      "TotalAmount",
      "PaymentStatus",
      "BookingStatus",
      "TransactionID",
    ];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.customer?.name || ""}"`,
      `"${b.customer?.email || ""}"`,
      `"${b.customer?.phone || ""}"`,
      `"${b.destination?.name || ""}"`,
      b.startDate,
      b.endDate,
      b.guests,
      b.totalAmount,
      b.paymentStatus,
      b.bookingStatus,
      b.transactionId,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Booking reports exported to CSV!");
  };

  // Helper for Booking Status Badge
  const getBookingStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-500/30";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-500/30";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-500/30";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-500/30";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Helper for Payment Status Badge
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      case "Refunded":
        return "bg-rose-500/10 text-rose-700 border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-500/20";
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Banner & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <HiOutlineTicket className="text-sm text-cyan-600" />
            <span>Reservations & Ticket Operations</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl font-sans">
            Booking & Order Management
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Monitor reservation requests, verify payment clearances, and manage traveler flight/hotel vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh API Data */}
          <button
            type="button"
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-50"
            title="Refresh from API"
          >
            <HiOutlineArrowPath
              className={`text-base text-slate-500 ${
                refreshing ? "animate-spin text-cyan-600" : ""
              }`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            title="Export CSV"
          >
            <HiOutlineArrowUpTray className="text-base text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Create Booking */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="group flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            <HiOutlinePlus className="text-base transition-transform duration-300 group-hover:rotate-90" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Reservations
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 transition-transform group-hover:scale-110">
              <HiOutlineTicket className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.totalCount}
            </span>
            <span className="text-xs font-semibold text-cyan-600">All Time</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Confirmed Escapes
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
              <HiOutlineCheckCircle className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.confirmedCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Ready</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Pending Action
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110">
              <HiOutlineClock className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.pendingCount}
            </span>
            <span className="text-xs font-semibold text-amber-600">Review</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Cleared Revenue
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-transform group-hover:scale-110">
              <HiOutlineCurrencyRupee className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Paid</span>
          </div>
        </div>
      </div>

      {/* Search, Status Tabs, Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search Field */}
        <div className="relative flex-1 max-w-lg">
          <HiOutlineMagnifyingGlass className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, destination, booking ID, txn..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Booking Status Tabs */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 overflow-x-auto">
            {[
              { id: "all", label: "All" },
              { id: "Confirmed", label: "Confirmed" },
              { id: "Pending", label: "Pending" },
              { id: "Completed", label: "Completed" },
              { id: "Cancelled", label: "Cancelled" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedBookingStatus(tab.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedBookingStatus === tab.id
                    ? "bg-white text-cyan-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Payment Status Selector */}
          <select
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Payment: All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending Payment</option>
            <option value="Refunded">Refunded</option>
          </select>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
            <HiOutlineAdjustmentsHorizontal className="text-slate-400 text-base" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="date-desc">Travel Date (Latest)</option>
              <option value="date-asc">Travel Date (Earliest)</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="guests-desc">Most Guests</option>
            </select>
          </div>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-white text-cyan-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Table View"
            >
              <HiOutlineListBullet className="text-lg" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                viewMode === "cards"
                  ? "bg-white text-cyan-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Cards View"
            >
              <HiOutlineSquares2X2 className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-3.5 w-36 rounded bg-slate-200" />
                  <div className="h-2.5 w-48 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <HiOutlineInformationCircle className="mx-auto text-4xl text-rose-500" />
          <h3 className="text-base font-bold text-rose-900">Failed to Load Bookings</h3>
          <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => fetchBookings()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 cursor-pointer"
          >
            <HiOutlineArrowPath /> Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedBookings.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <HiOutlineTicket className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No reservations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any bookings matching "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedBookingStatus("all");
              setSelectedPaymentStatus("all");
              setSortBy("date-desc");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          VIEW MODE 1: CLASSICAL RESERVATIONS TABLE
          ----------------------------------------------------------------------- */}
      {!loading && !error && viewMode === "table" && filteredAndSortedBookings.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Booking & Customer</th>
                  <th className="px-4 py-3.5">Destination</th>
                  <th className="px-4 py-3.5">Travel Dates</th>
                  <th className="px-4 py-3.5">Guests</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="transition-colors hover:bg-slate-50/80 group"
                  >
                    {/* Customer & ID */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            b.customer?.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                          }
                          alt={b.customer?.name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                            {b.customer?.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {b.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={b.destination?.image}
                          alt={b.destination?.name}
                          className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {b.destination?.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {b.destination?.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Travel Dates */}
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <HiOutlineCalendarDays className="text-slate-400 shrink-0" />
                        {b.startDate}
                      </span>
                    </td>

                    {/* Guests Count */}
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px]">
                        <HiOutlineUserGroup className="text-slate-400" />
                        {b.guests || 1}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td className="px-4 py-3.5 font-black text-slate-900">
                      ₹{Number(b.totalAmount || 0).toLocaleString()}
                    </td>

                    {/* Payment Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${getPaymentStatusStyle(
                          b.paymentStatus
                        )}`}
                      >
                        <HiOutlineCreditCard className="text-xs" />
                        {b.paymentStatus}
                      </span>
                    </td>

                    {/* Booking Status Pill */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getBookingStatusStyle(
                          b.bookingStatus
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            b.bookingStatus === "Confirmed"
                              ? "bg-emerald-500"
                              : b.bookingStatus === "Pending"
                              ? "bg-amber-500"
                              : b.bookingStatus === "Completed"
                              ? "bg-blue-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {b.bookingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenViewModal(b)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 transition-colors cursor-pointer"
                          title="View Ticket / Invoice"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(b)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 transition-colors cursor-pointer"
                          title="Edit Booking"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(b.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Cancel Reservation"
                        >
                          <HiOutlineTrash className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          VIEW MODE 2: VISUAL CARDS / BOARDING PASS TICKETS
          ----------------------------------------------------------------------- */}
      {!loading && !error && viewMode === "cards" && filteredAndSortedBookings.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedBookings.map((b) => (
            <div
              key={b.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              {/* Destination Cover Image */}
              <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                <img
                  src={b.destination?.image}
                  alt={b.destination?.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent" />

                {/* ID badge */}
                <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-slate-950/60 px-2.5 py-0.5 text-[10px] font-mono font-bold text-white backdrop-blur-md">
                  {b.id}
                </span>

                {/* Status pill on image */}
                <span
                  className={`absolute top-3 right-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md ${getBookingStatusStyle(
                    b.bookingStatus
                  )}`}
                >
                  {b.bookingStatus}
                </span>

                {/* Destination name over cover */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h4 className="text-sm font-black truncate">{b.destination?.name}</h4>
                  <p className="text-[10px] text-cyan-200 flex items-center gap-1">
                    <HiOutlineMapPin /> {b.destination?.location}
                  </p>
                </div>
              </div>

              {/* Passenger & Travel Body */}
              <div className="p-4 space-y-3">
                {/* Customer info */}
                <div className="flex items-center gap-2.5">
                  <img
                    src={b.customer?.avatar}
                    alt={b.customer?.name}
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {b.customer?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {b.customer?.email}
                    </p>
                  </div>
                </div>

                {/* Dates & Guests */}
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 text-center text-xs">
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-400">Travel Date</span>
                    <p className="font-semibold text-slate-800 font-mono text-[11px] mt-0.5">
                      {b.startDate}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-400">Total Fare</span>
                    <p className="font-black text-slate-900 text-[11px] mt-0.5">
                      ₹{Number(b.totalAmount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-100 p-3 px-4 bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => handleOpenViewModal(b)}
                  className="text-xs font-bold text-cyan-600 hover:text-cyan-700 cursor-pointer"
                >
                  View Voucher →
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(b)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-cyan-700 cursor-pointer"
                    title="Edit"
                  >
                    <HiOutlinePencilSquare className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(b.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600 cursor-pointer"
                    title="Delete"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -----------------------------------------------------------------------
          MODAL: VIEW TICKET / INVOICE OR CREATE / EDIT MODAL
          ----------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modalMode === "create"
                    ? "Create New Reservation"
                    : modalMode === "edit"
                    ? "Modify Booking Parameters"
                    : "Official Booking Voucher"}
                </h2>
                <p className="text-xs text-slate-500">
                  {modalMode === "view"
                    ? "Verified digital travel voucher and billing summary."
                    : "Update passenger details, dates, and payment states."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <HiOutlineXMark className="text-xl" />
              </button>
            </div>

            {/* 1. VIEW VOUCHER / RECEIPT MODE */}
            {modalMode === "view" && currentBooking && (
              <div className="space-y-4">
                {/* Destination Hero Banner */}
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-900">
                  <img
                    src={currentBooking.destination?.image}
                    alt={currentBooking.destination?.name}
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                        {currentBooking.id}
                      </span>
                      <h3 className="text-lg font-black">{currentBooking.destination?.name}</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <HiOutlineMapPin /> {currentBooking.destination?.location}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${getBookingStatusStyle(
                        currentBooking.bookingStatus
                      )}`}
                    >
                      {currentBooking.bookingStatus}
                    </span>
                  </div>
                </div>

                {/* Passenger & Ticket Breakdown Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Passenger</span>
                    <p className="font-bold text-slate-900 mt-0.5">{currentBooking.customer?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentBooking.customer?.email}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Contact Phone</span>
                    <p className="font-bold text-slate-900 mt-0.5">{currentBooking.customer?.phone || "N/A"}</p>
                    <p className="text-[10px] text-slate-500">{currentBooking.customer?.city || "India"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Party Size</span>
                    <p className="font-bold text-slate-900 mt-0.5">{currentBooking.guests} Traveler(s)</p>
                    <p className="text-[10px] text-slate-500">Reserved seats</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Departure Date</span>
                    <p className="font-bold text-slate-900 mt-0.5">{currentBooking.startDate}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Return Date</span>
                    <p className="font-bold text-slate-900 mt-0.5">{currentBooking.endDate}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Payment Status</span>
                    <p className="font-black text-emerald-600 mt-0.5">{currentBooking.paymentStatus}</p>
                  </div>
                </div>

                {/* Financial Breakdown & Transaction */}
                <div className="rounded-2xl bg-slate-50 p-4 space-y-2 border border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method</span>
                    <span className="font-medium text-slate-800">{currentBooking.paymentMethod || "Credit Card"}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Transaction ID</span>
                    <span className="font-mono text-slate-700">{currentBooking.transactionId || "TXN-AUTO-991"}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Special Instructions</span>
                    <span className="font-medium text-slate-800 max-w-xs text-right truncate">
                      {currentBooking.specialNotes || "None provided"}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Amount Paid</span>
                    <span className="text-base font-black text-slate-900">
                      ₹{Number(currentBooking.totalAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Voucher Footer Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <HiOutlinePrinter className="text-base" /> Print Voucher
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode("edit")}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-700 cursor-pointer"
                  >
                    Edit Reservation
                  </button>
                </div>
              </div>
            )}

            {/* 2. CREATE / EDIT FORM MODE */}
            {modalMode !== "view" && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer?.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer: { ...formData.customer, name: e.target.value },
                        })
                      }
                      placeholder="e.g. Mohanlal Manna"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.customer?.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer: { ...formData.customer, email: e.target.value },
                        })
                      }
                      placeholder="e.g. mohanlal@example.com"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Destination Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.destination?.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destination: { ...formData.destination, name: e.target.value },
                        })
                      }
                      placeholder="e.g. Paris Grand Escape"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / Country
                    </label>
                    <input
                      type="text"
                      value={formData.destination?.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destination: { ...formData.destination, location: e.target.value },
                        })
                      }
                      placeholder="e.g. Paris, France"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Fare (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.totalAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, totalAmount: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Booking Status
                    </label>
                    <select
                      value={formData.bookingStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, bookingStatus: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentStatus: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows="2"
                    value={formData.specialNotes}
                    onChange={(e) =>
                      setFormData({ ...formData, specialNotes: e.target.value })
                    }
                    placeholder="Meal preferences, airport transfers, room upgrades..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50"
                  >
                    {submitting && <HiOutlineArrowPath className="animate-spin text-sm" />}
                    <span>
                      {submitting
                        ? modalMode === "create"
                          ? "Saving..."
                          : "Updating..."
                        : modalMode === "create"
                        ? "Save Reservation"
                        : "Update Booking"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          MODAL: DELETE / CANCEL CONFIRMATION DIALOG
          ----------------------------------------------------------------------- */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => !deleting && setDeleteConfirmId(null)}
          />

          <div className="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <HiOutlineTrash className="text-2xl" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Cancel & Remove Booking?
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                This will release the reserved seats and cancel this customer itinerary.
              </p>
            </div>

            {/* Target Booking Summary Card */}
            {(() => {
              const target = bookings.find((b) => b.id === deleteConfirmId);
              if (!target) return null;
              return (
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left border border-slate-100">
                  <img
                    src={
                      target.destination?.image ||
                      target.customer?.avatar ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={target.destination?.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 truncate">{target.destination?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{target.customer?.name} • #{target.id}</p>
                    <p className="text-[10px] font-bold text-cyan-600">₹{Number(target.totalAmount || 0).toLocaleString()} • {target.paymentStatus}</p>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteBooking(deleteConfirmId)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 cursor-pointer disabled:opacity-50"
              >
                {deleting && <HiOutlineArrowPath className="animate-spin text-sm" />}
                <span>{deleting ? "Cancelling..." : "Confirm Cancellation"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
