import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineArrowPath,
  HiOutlineCurrencyDollar,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineGlobeAmericas,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineArrowUpTray,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { PiAirplaneTiltBold } from "react-icons/pi";

const TripManagement = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filter & Search & View controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [currentTrip, setCurrentTrip] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' | 'info' }

  // Form State
  const initialFormState = {
    id: "",
    name: "",
    location: "",
    pricePerHead: "",
    days: "",
    image: "",
    description: "",
    status: "Active",
  };
  const [formData, setFormData] = useState(initialFormState);

  // API Endpoint
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const DESTINATIONS_URL =
    import.meta.env.VITE_DESTINATIONS_DETAILS_URL || `${API_BASE_URL}/api/destinations`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // ---------------------------------------------------------------------------
  // DATA FETCHING VIA API
  // ---------------------------------------------------------------------------
  const fetchTrips = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await axios.get(DESTINATIONS_URL);
      const rawData = response.data;
      const fetchedTrips = Array.isArray(rawData)
        ? rawData
        : rawData?.data || rawData?.destinations || [];

      if (Array.isArray(fetchedTrips)) {
        setTrips(
          fetchedTrips.map((trip) => {
            const rawLocation =
              trip.location ||
              [trip.state, trip.country].filter(Boolean).join(", ") ||
              "India";
            return {
              ...trip,
              id: String(trip.id),
              name: trip.name || trip.title || "Untitled Destination",
              title: trip.title || trip.name || "Untitled Destination",
              location: rawLocation,
              pricePerHead: Number(trip.pricePerHead ?? trip.price ?? 0),
              price: Number(trip.price ?? trip.pricePerHead ?? 0),
              days: Number(trip.days || 1),
              image:
                trip.image ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
              description: trip.description || "",
              status: trip.status
                ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1)
                : "Active",
            };
          })
        );
      } else {
        throw new Error("Invalid response format received from server");
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setError("Unable to load trip records. Please check the network connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // ---------------------------------------------------------------------------
  // FILTERING, SEARCHING & SORTING LOGIC
  // ---------------------------------------------------------------------------
  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          String(t.id).toLowerCase().includes(q)
      );
    }

    // Region / Category filter
    if (selectedRegion !== "all") {
      if (selectedRegion === "international") {
        result = result.filter(
          (t) => !t.location?.toLowerCase().includes("india")
        );
      } else if (selectedRegion === "india") {
        result = result.filter((t) =>
          t.location?.toLowerCase().includes("india")
        );
      } else if (selectedRegion === "short") {
        result = result.filter((t) => Number(t.days) <= 3);
      } else if (selectedRegion === "long") {
        result = result.filter((t) => Number(t.days) > 3);
      }
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.pricePerHead) - Number(b.pricePerHead));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.pricePerHead) - Number(a.pricePerHead));
    } else if (sortBy === "duration") {
      result.sort((a, b) => Number(b.days) - Number(a.days));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [trips, searchQuery, selectedRegion, sortBy]);

  // Calculated high-level metrics
  const stats = useMemo(() => {
    const totalCount = trips.length;
    const avgPrice = totalCount
      ? Math.round(
          trips.reduce((acc, curr) => acc + (Number(curr.pricePerHead) || 0), 0) /
            totalCount
        )
      : 0;
    const avgDays = totalCount
      ? (
          trips.reduce((acc, curr) => acc + (Number(curr.days) || 0), 0) /
          totalCount
        ).toFixed(1)
      : 0;
    const internationalCount = trips.filter(
      (t) => !t.location?.toLowerCase().includes("india")
    ).length;

    return { totalCount, avgPrice, avgDays, internationalCount };
  }, [trips]);

  // ---------------------------------------------------------------------------
  // HANDLERS (Create, Edit, Delete, Export)
  // ---------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      ...initialFormState,
      id: `destination-${Date.now()}`,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (trip) => {
    setModalMode("edit");
    setCurrentTrip(trip);
    setFormData({
      id: trip.id,
      name: trip.name || trip.title || "",
      location: trip.location || "",
      pricePerHead: trip.pricePerHead || trip.price || "",
      days: trip.days || "",
      image: trip.image || "",
      description: trip.description || "",
      status: trip.status || "Active",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.location?.trim() || !formData.pricePerHead) {
      showToast("Please fill in all required fields (Name, Location, Price).", "error");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      title: formData.name.trim(),
      location: formData.location.trim(),
      pricePerHead: Number(formData.pricePerHead),
      price: Number(formData.pricePerHead),
      days: Number(formData.days) || 1,
      image: formData.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      description: formData.description || "",
      status: formData.status || "Active",
      detailsUrl: `/destination/${formData.id}`,
      bookingUrl: "/contact",
    };

    try {
      if (modalMode === "create") {
        let created = null;
        try {
          const res = await axios.post(`${DESTINATIONS_URL}/create`, {
            title: payload.name,
            name: payload.name,
            location: payload.location,
            price: payload.pricePerHead,
            pricePerHead: payload.pricePerHead,
            days: payload.days,
            image: payload.image,
            description: payload.description,
            status: payload.status.toLowerCase(),
          });
          if (res.data?.destination || res.data?.data) {
            const data = res.data.destination || res.data.data;
            created = {
              ...payload,
              id: String(data.id || payload.id),
            };
          }
        } catch (apiErr) {
          console.warn("POST /destinations/create failed, trying direct POST:", apiErr);
          try {
            const res = await axios.post(DESTINATIONS_URL, payload);
            if (res.data?.id) {
              created = { ...payload, id: String(res.data.id) };
            }
          } catch (fallbackErr) {
            console.warn("POST fallback also failed:", fallbackErr);
            if (apiErr.response?.data?.errors?.[0]?.msg || apiErr.response?.data?.message) {
              const msg = apiErr.response?.data?.errors?.[0]?.msg || apiErr.response?.data?.message;
              showToast(`Failed: ${msg}`, "error");
              setSubmitting(false);
              return;
            }
          }
        }

        const finalTrip = created || payload;
        setTrips((prev) => [finalTrip, ...prev]);
        showToast(`Trip "${payload.name}" successfully created!`, "success");
      } else {
        const targetId = payload.id;
        try {
          await axios.put(`${DESTINATIONS_URL}/update/${targetId}`, {
            title: payload.name,
            name: payload.name,
            location: payload.location,
            price: payload.pricePerHead,
            pricePerHead: payload.pricePerHead,
            days: payload.days,
            image: payload.image,
            description: payload.description,
            status: payload.status.toLowerCase(),
          });
        } catch (apiErr) {
          console.warn(`PUT /update/${targetId} failed, trying /${targetId}:`, apiErr);
          try {
            await axios.put(`${DESTINATIONS_URL}/${targetId}`, payload);
          } catch (fallbackErr) {
            console.warn("PUT fallback failed:", fallbackErr);
            if (apiErr.response?.data?.errors?.[0]?.msg || apiErr.response?.data?.message) {
              const msg = apiErr.response?.data?.errors?.[0]?.msg || apiErr.response?.data?.message;
              showToast(`Update failed: ${msg}`, "error");
              setSubmitting(false);
              return;
            }
          }
        }

        setTrips((prev) =>
          prev.map((t) => (t.id === payload.id ? payload : t))
        );
        showToast(`Trip "${payload.name}" updated successfully!`, "success");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving trip:", err);
      showToast("An unexpected error occurred while saving.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!id) return;
    setDeleting(true);

    const target = trips.find((t) => t.id === id);
    const targetName = target?.name || `ID ${id}`;

    try {
      try {
        await axios.delete(`${DESTINATIONS_URL}/delete/${id}`);
      } catch (apiErr) {
        console.warn(`DELETE /delete/${id} failed, trying /${id}:`, apiErr);
        try {
          await axios.delete(`${DESTINATIONS_URL}/${id}`);
        } catch (fallbackErr) {
          console.warn("DELETE fallback failed:", fallbackErr);
        }
      }

      setTrips((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirmId(null);
      showToast(`Trip "${targetName}" removed permanently.`, "success");
    } catch (err) {
      console.error("Failed to delete trip:", err);
      showToast(`Failed to delete trip: ${err.message}`, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (!trips.length) return;
    const headers = ["ID", "Name", "Location", "PricePerHead", "Days", "Image"];
    const rows = trips.map((t) => [
      t.id,
      `"${t.name || ""}"`,
      `"${t.location || ""}"`,
      t.pricePerHead,
      t.days,
      `"${t.image || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `trips_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV file exported successfully!", "info");
  };


  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification Alert */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200 ${
            toast.type === "error"
              ? "border-rose-500/30 bg-rose-950/90 text-rose-200"
              : toast.type === "info"
              ? "border-cyan-500/30 bg-slate-900/90 text-cyan-200"
              : "border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
          }`}
        >
          {toast.type === "error" ? (
            <HiOutlineInformationCircle className="text-lg text-rose-400" />
          ) : (
            <HiOutlineCheck className="text-lg text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner / Breadcrumb & Primary Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <PiAirplaneTiltBold className="text-sm text-cyan-600" />
            <span>Itinerary Inventory Management</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl font-sans">
            Expedition & Trip Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Curate travel itineraries, adjust pricing models, and monitor destination bookings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh API Data */}
          <button
            type="button"
            onClick={() => fetchTrips(true)}
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

          {/* Export Catalog */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
            title="Export CSV"
          >
            <HiOutlineArrowUpTray className="text-base text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Create New Trip Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="group flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            <HiOutlinePlus className="text-base transition-transform duration-300 group-hover:rotate-90" />
            <span>Add New Trip</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Itineraries
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 transition-transform group-hover:scale-110">
              <PiAirplaneTiltBold className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.totalCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Active</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Avg. Package Cost
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
              <HiOutlineCurrencyDollar className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              ₹{stats.avgPrice.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-400">per head</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Avg. Duration
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110">
              <HiOutlineClock className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.avgDays} <span className="text-sm font-medium text-slate-500">Days</span>
            </span>
            <span className="text-xs font-medium text-slate-400">Escapes</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Global Escapes
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-transform group-hover:scale-110">
              <HiOutlineGlobeAmericas className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.internationalCount}
            </span>
            <span className="text-xs font-semibold text-indigo-600">International</span>
          </div>
        </div>
      </div>

      {/* Search, Filter & View Controls Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search Field */}
        <div className="relative flex-1 max-w-lg">
          <HiOutlineMagnifyingGlass className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by destination name, location, keyword..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Filters and View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Region Tabs */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {[
              { id: "all", label: "All" },
              { id: "india", label: "Domestic (India)" },
              { id: "international", label: "International" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedRegion === tab.id
                    ? "bg-white text-cyan-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
            <HiOutlineAdjustmentsHorizontal className="text-slate-400 text-base" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Longest Duration</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-cyan-600 shadow-2xs"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              title="Grid View"
            >
              <HiOutlineSquares2X2 className="text-lg" />
            </button>
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
          </div>
        </div>
      </div>

      {/* Loading Skeleton View */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-xs space-y-4"
            >
              <div className="h-44 w-full rounded-2xl bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="flex justify-between pt-2">
                <div className="h-5 w-20 rounded bg-slate-200" />
                <div className="h-5 w-14 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Fallback State */}
      {error && !loading && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <HiOutlineInformationCircle className="mx-auto text-4xl text-rose-500" />
          <h3 className="text-base font-bold text-rose-900">Failed to Load Trip Catalog</h3>
          <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => fetchTrips()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 cursor-pointer"
          >
            <HiOutlineArrowPath /> Retry Connection
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedTrips.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <PiAirplaneTiltBold className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No destinations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any trips matching "{searchQuery}". Try changing your search query or reset filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedRegion("all");
              setSortBy("default");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          VIEW MODE 1: GRID CARDS (MODERN VISUAL CARDS)
          ----------------------------------------------------------------------- */}
      {!loading && !error && viewMode === "grid" && filteredAndSortedTrips.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedTrips.map((trip) => (
            <div
              key={trip.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl"
            >
              {/* Trip Photo Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    trip.image ||
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={trip.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Days Badge */}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                  <HiOutlineClock className="text-cyan-400" />
                  {trip.days || 1} Days
                </span>

                {/* Quick Action Buttons on Hover */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(trip)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-cyan-600 hover:scale-105 cursor-pointer"
                    title="Edit Trip"
                  >
                    <HiOutlinePencilSquare className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(trip.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-rose-600 hover:scale-105 cursor-pointer"
                    title="Delete Trip"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
                </div>

                {/* Location Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 text-white">
                  <HiOutlineMapPin className="text-sm shrink-0 text-cyan-400" />
                  <span className="text-xs font-medium truncate drop-shadow-sm">
                    {trip.location}
                  </span>
                </div>
              </div>

              {/* Trip Details Content */}
              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {trip.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {trip.description || "Bespoke itinerary with curated excursions."}
                  </p>
                </div>

                {/* Footer Price & Action */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Price / Head
                    </span>
                    <p className="text-base font-black text-slate-900">
                      ₹{Number(trip.pricePerHead || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/destination/${trip.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white hover:text-cyan-700 transition-all"
                    >
                      <HiOutlineEye /> View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(trip)}
                      className="inline-flex items-center gap-1 rounded-xl bg-cyan-50 px-2.5 py-1.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -----------------------------------------------------------------------
          VIEW MODE 2: CLASSICAL ADMIN DATA TABLE
          ----------------------------------------------------------------------- */}
      {!loading && !error && viewMode === "table" && filteredAndSortedTrips.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <tr>
                  <th className="px-5 py-3.5">Destination</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Price / Head</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="transition-colors hover:bg-slate-50/80 group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            trip.image ||
                            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop"
                          }
                          alt={trip.name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                            {trip.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {trip.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      <span className="flex items-center gap-1">
                        <HiOutlineMapPin className="text-slate-400" />
                        {trip.location}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px]">
                        <HiOutlineClock className="text-slate-400" />
                        {trip.days || 1} Days
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{Number(trip.pricePerHead || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/destination/${trip.id}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 transition-colors"
                          title="View Live"
                        >
                          <HiOutlineEye className="text-base" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(trip)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
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
          MODAL 1: ADD / EDIT TRIP DIALOG
          ----------------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {modalMode === "create" ? "Create New Itinerary" : "Edit Trip Details"}
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in the destination properties to update catalog listing.
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

            {/* Form Fields */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Switzerland Alps"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location / Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g. Zurich, Switzerland"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price Per Head (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.pricePerHead}
                    onChange={(e) =>
                      setFormData({ ...formData, pricePerHead: e.target.value })
                    }
                    placeholder="e.g. 45000"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.days}
                    onChange={(e) =>
                      setFormData({ ...formData, days: e.target.value })
                    }
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cover Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  />
                </div>
                {formData.image && (
                  <div className="mt-2 h-28 w-full overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe key highlights, landmarks, excursions, and travel notes..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
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
                        ? "Adding..."
                        : "Saving..."
                      : modalMode === "create"
                      ? "Add to Catalog"
                      : "Save Changes"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          MODAL 2: DELETE CONFIRMATION DIALOG
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
                Delete Trip Listing?
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                This action will permanently remove the itinerary from the active travel catalog.
              </p>
            </div>

            {/* Target Trip Summary Card */}
            {(() => {
              const target = trips.find((t) => t.id === deleteConfirmId);
              if (!target) return null;
              return (
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left border border-slate-100">
                  <img
                    src={
                      target.image ||
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop"
                    }
                    alt={target.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 truncate">{target.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{target.location}</p>
                    <p className="text-[10px] font-semibold text-cyan-600">₹{Number(target.pricePerHead || target.price || 0).toLocaleString()} • {target.days} Days</p>
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
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDeleteTrip(deleteConfirmId)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 cursor-pointer disabled:opacity-50"
              >
                {deleting && <HiOutlineArrowPath className="animate-spin text-sm" />}
                <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripManagement;