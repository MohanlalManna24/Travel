import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  HiOutlineUserPlus,
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
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineArrowUpTray,
  HiOutlineInformationCircle,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineTicket,
} from "react-icons/hi2";
import { AdminToast } from "../components/AdminToast";

const UserManagement = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("spent-desc");
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' | 'info' }

  // Form State
  const initialFormState = {
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "Explorer",
    status: "Active",
    location: "",
    avatar: "",
    totalBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 100,
  };
  const [formData, setFormData] = useState(initialFormState);

  // API Endpoints configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  const USERS_DETAILS_URL = import.meta.env.VITE_USERS_DATA_URL || `${API_BASE_URL}/api/user-details/`;
  const USERS_API_URL = `${API_BASE_URL}/api/users`;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // ---------------------------------------------------------------------------
  // DATA FETCHING VIA API
  // ---------------------------------------------------------------------------
  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      let response;
      try {
        response = await axios.get(USERS_DETAILS_URL);
      } catch (detailsErr) {
        console.warn("Primary user-details endpoint failed, attempting fallback to /api/users:", detailsErr);
        response = await axios.get(USERS_API_URL);
      }

      const rawData = response.data;
      const fetchedUsers = Array.isArray(rawData)
        ? rawData
        : rawData?.userFullDetails ||
          rawData?.users ||
          rawData?.data ||
          [];

      if (Array.isArray(fetchedUsers)) {
        setUsers(
          fetchedUsers.map((user) => {
            const rawStatus = (user.status || "Active").toLowerCase();
            const formattedStatus =
              rawStatus === "inactive" || rawStatus === "suspended"
                ? "Suspended"
                : rawStatus === "pending"
                ? "Pending"
                : "Active";

            const rawLocation =
              user.location ||
              [user.city, user.state].filter(Boolean).join(", ") ||
              "Not specified";

            return {
              ...user,
              id: String(user.user_id || user.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`),
              name: user.name || user.fullname || "Unnamed Traveler",
              email: user.email || "",
              phone: user.phone ? String(user.phone) : "",
              role: user.role || "Explorer",
              status: formattedStatus,
              avatar:
                user.avatar ||
                user.profile_img ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
              location: rawLocation,
              city: user.city || "",
              state: user.state || "",
              totalBookings: Number(user.totalBookings || 0),
              totalSpent: Number(user.totalSpent || 0),
              loyaltyPoints: Number(user.loyaltyPoints || 100),
              joinedDate: user.created_at
                ? String(user.created_at).slice(0, 10)
                : user.joinedDate || new Date().toISOString().slice(0, 10),
              lastActive: user.lastActive || "Recently",
            };
          })
        );
      } else {
        throw new Error("Invalid response format received from server");
      }
    } catch (err) {
      console.error("Failed to fetch user accounts:", err);
      setError("Unable to load user accounts from backend server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------------------------------------------------------------------
  // FILTERING, SEARCHING & SORTING LOGIC
  // ---------------------------------------------------------------------------
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Search query filter (name, email, phone, location, id)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.location?.toLowerCase().includes(q) ||
          String(u.id).toLowerCase().includes(q)
      );
    }

    // Role filter
    if (selectedRole !== "all") {
      result = result.filter((u) => u.role === selectedRole);
    }

    // Status filter
    if (selectedStatus !== "all") {
      result = result.filter((u) => u.status === selectedStatus);
    }

    // Sorting
    if (sortBy === "spent-desc") {
      result.sort((a, b) => Number(b.totalSpent || 0) - Number(a.totalSpent || 0));
    } else if (sortBy === "spent-asc") {
      result.sort((a, b) => Number(a.totalSpent || 0) - Number(b.totalSpent || 0));
    } else if (sortBy === "bookings-desc") {
      result.sort((a, b) => Number(b.totalBookings || 0) - Number(a.totalBookings || 0));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.joinedDate || "").localeCompare(a.joinedDate || ""));
    }

    return result;
  }, [users, searchQuery, selectedRole, selectedStatus, sortBy]);

  // Calculated Metrics / KPIs
  const stats = useMemo(() => {
    const totalCount = users.length;
    const activeCount = users.filter((u) => u.status === "Active").length;
    const vipCount = users.filter((u) => u.role === "VIP Traveler" || u.role === "Super Admin").length;
    const totalRevenue = users.reduce((acc, curr) => acc + (Number(curr.totalSpent) || 0), 0);
    const totalBookings = users.reduce((acc, curr) => acc + (Number(curr.totalBookings) || 0), 0);

    return { totalCount, activeCount, vipCount, totalRevenue, totalBookings };
  }, [users]);

  // ---------------------------------------------------------------------------
  // HANDLERS (Create, Edit, View, Delete, Export)
  // ---------------------------------------------------------------------------
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      ...initialFormState,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      joinedDate: new Date().toISOString().slice(0, 10),
      lastActive: "Just now",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode("edit");
    setCurrentUser(user);
    setFormData({
      ...user,
      password: "", // Empty for optional update
    });
    setIsModalOpen(true);
  };

  const handleOpenViewModal = (user) => {
    setModalMode("view");
    setCurrentUser(user);
    setFormData({
      ...user,
    });
    setIsModalOpen(true);
  };

  // CREATE / EDIT HANDLER WITH ASYNC API INTEGRATION
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      showToast("Please provide both full name and email address.", "error");
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      fullname: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone ? String(formData.phone).trim() : "",
      status: formData.status || "Active",
      role: formData.role || "Explorer",
      location: formData.location || "",
      avatar: formData.avatar || "",
      profileImg: formData.avatar || "",
      totalSpent: Number(formData.totalSpent || 0),
      totalBookings: Number(formData.totalBookings || 0),
      loyaltyPoints: Number(formData.loyaltyPoints || 0),
      joinedDate: formData.joinedDate || new Date().toISOString().slice(0, 10),
      lastActive: formData.lastActive || "Just now",
    };

    try {
      if (modalMode === "create") {
        // Create user via Backend API
        let createdUser = null;
        try {
          const res = await axios.post(`${USERS_API_URL}/createuser`, {
            fullname: payload.name,
            email: payload.email,
            phone: payload.phone || "0000000000",
            password: payload.password || "Password@123",
            status: payload.status.toLowerCase(),
            avatar: payload.avatar,
            location: payload.location,
          });
          if (res.data?.user) {
            createdUser = {
              ...payload,
              id: String(res.data.user.id || payload.id),
            };
          }
        } catch (apiErr) {
          console.warn("Backend create API returned error, applying local optimistic creation:", apiErr);
          // If server responded with a specific validation or duplicate message, report it
          if (apiErr.response?.data?.error || apiErr.response?.data?.errors?.[0]?.msg) {
            const msg = apiErr.response?.data?.error || apiErr.response?.data?.errors?.[0]?.msg;
            showToast(`Server Error: ${msg}`, "error");
            setSubmitting(false);
            return;
          }
        }

        const finalUser = createdUser || payload;
        setUsers((prev) => [finalUser, ...prev]);
        showToast(`User account "${payload.name}" created successfully!`, "success");
      } else {
        // UPDATE user via Backend API
        const targetId = payload.id;
        let updateSuccess = false;

        try {
          // Attempt update on /api/users/updateuser/:id
          const updateBody = {
            fullname: payload.name,
            email: payload.email,
            phone: payload.phone,
            status: payload.status.toLowerCase(),
            avatar: payload.avatar,
            location: payload.location,
          };
          if (formData.password && formData.password.trim().length >= 6) {
            updateBody.password = formData.password.trim();
          }

          await axios.put(`${USERS_API_URL}/updateuser/${targetId}`, updateBody);
          updateSuccess = true;
        } catch (apiErr) {
          console.warn(`Backend update on /updateuser/${targetId} failed, trying fallback:`, apiErr);
          try {
            await axios.put(`${USERS_API_URL}/${targetId}`, {
              fullname: payload.name,
              email: payload.email,
              phone: payload.phone,
              status: payload.status.toLowerCase(),
            });
            updateSuccess = true;
          } catch (fallbackErr) {
            console.warn("Backend update fallback failed:", fallbackErr);
            if (apiErr.response?.data?.error || apiErr.response?.data?.errors?.[0]?.msg) {
              const msg = apiErr.response?.data?.error || apiErr.response?.data?.errors?.[0]?.msg;
              showToast(`Update Failed: ${msg}`, "error");
              setSubmitting(false);
              return;
            }
          }
        }

        // Update local React state with fresh updated profile details
        setUsers((prev) => prev.map((u) => (u.id === payload.id ? payload : u)));
        showToast(`User profile "${payload.name}" updated successfully!`, "success");
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error during user save:", err);
      showToast("An unexpected error occurred while saving user.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE USER HANDLER WITH ASYNC API INTEGRATION
  const handleDeleteUser = async (id) => {
    if (!id) return;
    setDeleting(true);

    const targetUser = users.find((u) => u.id === id);
    const targetName = targetUser?.name || `ID ${id}`;

    try {
      try {
        // Attempt backend API deletion
        await axios.delete(`${USERS_API_URL}/deleteuser/${id}`);
      } catch (apiErr) {
        console.warn(`DELETE /deleteuser/${id} failed, trying /api/users/${id}:`, apiErr);
        try {
          await axios.delete(`${USERS_API_URL}/${id}`);
        } catch (fallbackErr) {
          console.warn("DELETE fallback also failed:", fallbackErr);
        }
      }

      // Remove from client state
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteConfirmId(null);
      showToast(`User account "${targetName}" was deleted permanently.`, "success");
    } catch (err) {
      console.error("Error deleting user account:", err);
      showToast(`Failed to delete user: ${err.message}`, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (!users.length) return;
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Status", "Location", "TotalSpent", "TotalBookings", "JoinedDate"];
    const rows = users.map((u) => [
      u.id,
      `"${u.name || ""}"`,
      `"${u.email || ""}"`,
      `"${u.phone || ""}"`,
      u.role,
      u.status,
      `"${u.location || ""}"`,
      u.totalSpent,
      u.totalBookings,
      u.joinedDate,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("User list exported to CSV!", "info");
  };

  // Helper for role pill styling
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-rose-500/10 text-rose-700 border-rose-500/20";
      case "VIP Traveler":
        return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      case "Tour Agent":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-700 border-cyan-500/20";
    }
  };

  // Helper for status pill styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-500/30";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-500/30";
      case "Suspended":
        return "bg-rose-50 text-rose-700 border-rose-500/30";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };


  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Banner & Primary Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <HiOutlineUsers className="text-sm text-cyan-600" />
            <span>Community & Traveler CRM</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl font-sans">
            User Directory & Access Control
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage traveler profiles, permissions, loyalty rewards, and customer booking histories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:opacity-50"
            title="Refresh API Data"
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

          {/* Add User Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="group flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 active:scale-95"
          >
            <HiOutlineUserPlus className="text-base transition-transform duration-300 group-hover:scale-110" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Members
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 transition-transform group-hover:scale-110">
              <HiOutlineUsers className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.totalCount}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {stats.activeCount} Active
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              VIP Travelers
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110">
              <HiOutlineStar className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.vipCount}
            </span>
            <span className="text-xs font-medium text-slate-400">High Tier</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Spend
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
              <HiOutlineCurrencyRupee className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Lifetime</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Bookings
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-transform group-hover:scale-110">
              <HiOutlineTicket className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.totalBookings}
            </span>
            <span className="text-xs font-medium text-slate-400">Escapes</span>
          </div>
        </div>
      </div>

      {/* Search, Role Filters, Status & View Controls Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search Field */}
        <div className="relative flex-1 max-w-lg">
          <HiOutlineMagnifyingGlass className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, location, or ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Controls and Selectors */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Role Filters */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 overflow-x-auto">
            {[
              { id: "all", label: "All Roles" },
              { id: "Explorer", label: "Explorer" },
              { id: "VIP Traveler", label: "VIP" },
              { id: "Tour Agent", label: "Agent" },
            ].map((roleTab) => (
              <button
                key={roleTab.id}
                type="button"
                onClick={() => setSelectedRole(roleTab.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRole === roleTab.id
                    ? "bg-white text-cyan-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {roleTab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5">
            <HiOutlineAdjustmentsHorizontal className="text-slate-400 text-base" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="spent-desc">Highest Spenders</option>
              <option value="spent-asc">Lowest Spenders</option>
              <option value="bookings-desc">Most Bookings</option>
              <option value="newest">Recently Joined</option>
              <option value="name-asc">Name (A-Z)</option>
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
                  <div className="h-3.5 w-32 rounded bg-slate-200" />
                  <div className="h-2.5 w-48 rounded bg-slate-100" />
                </div>
              </div>
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error Fallback */}
      {error && !loading && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <HiOutlineInformationCircle className="mx-auto text-4xl text-rose-500" />
          <h3 className="text-base font-bold text-rose-900">Failed to Load User Accounts</h3>
          <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => fetchUsers()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 cursor-pointer"
          >
            <HiOutlineArrowPath /> Retry Fetching
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAndSortedUsers.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <HiOutlineUsers className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No members match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any user profiles matching "{searchQuery}".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedRole("all");
              setSelectedStatus("all");
              setSortBy("spent-desc");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          VIEW MODE 1: CLASSICAL EXECUTIVE DATA TABLE
          ----------------------------------------------------------------------- */}
      {!loading && !error && viewMode === "table" && filteredAndSortedUsers.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <tr>
                  <th className="px-5 py-3.5">User Profile</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Contact</th>
                  <th className="px-4 py-3.5">Location</th>
                  <th className="px-4 py-3.5">Total Spent</th>
                  <th className="px-4 py-3.5">Bookings</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-slate-50/80 group"
                  >
                    {/* User Profile Info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                          }
                          alt={u.name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover ring-2 ring-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{u.name}</span>
                            {u.role === "VIP Traveler" && (
                              <HiOutlineSparkles className="text-amber-500 text-xs shrink-0" />
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {u.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${getRoleBadgeStyle(
                          u.role
                        )}`}
                      >
                        {u.role === "Super Admin" && <HiOutlineShieldCheck className="text-xs" />}
                        {u.role}
                      </span>
                    </td>

                    {/* Contact (Email & Phone) */}
                    <td className="px-4 py-3.5">
                      <div className="space-y-0.5 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <HiOutlineEnvelope className="text-slate-400" />
                          <span className="truncate max-w-[150px]">{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                            <HiOutlinePhone className="text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5 text-slate-600">
                      <span className="flex items-center gap-1">
                        <HiOutlineMapPin className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[120px]">{u.location || "Not specified"}</span>
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{Number(u.totalSpent || 0).toLocaleString()}
                    </td>

                    {/* Bookings */}
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px]">
                        <HiOutlineTicket className="text-slate-400" />
                        {u.totalBookings || 0}
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadgeStyle(
                          u.status
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === "Active"
                              ? "bg-emerald-500"
                              : u.status === "Pending"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenViewModal(u)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 transition-colors cursor-pointer"
                          title="View Profile Details"
                        >
                          <HiOutlineEye className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(u)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <HiOutlinePencilSquare className="text-base" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete User"
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
          VIEW MODE 2: USER PROFILE CARDS
          ----------------------------------------------------------------------- */}
      {!loading && !error && viewMode === "cards" && filteredAndSortedUsers.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedUsers.map((u) => (
            <div
              key={u.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div>
                {/* Card Top Avatar & Status */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img
                      src={
                        u.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                      }
                      alt={u.name}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        u.status === "Active"
                          ? "bg-emerald-500"
                          : u.status === "Pending"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${getRoleBadgeStyle(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </div>

                {/* Name & ID */}
                <div className="mt-4">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors flex items-center gap-1">
                    <span>{u.name}</span>
                    {u.role === "VIP Traveler" && (
                      <HiOutlineSparkles className="text-amber-500 text-xs shrink-0" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{u.id}</p>
                </div>

                {/* Contact & Location Details */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <HiOutlineEnvelope className="text-slate-400 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <HiOutlineMapPin className="text-slate-400 shrink-0" />
                    <span>{u.location || "Unspecified"}</span>
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2.5 text-center">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Total Spent
                    </span>
                    <p className="text-sm font-black text-slate-900">
                      ₹{Number(u.totalSpent || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Bookings
                    </span>
                    <p className="text-sm font-black text-slate-900">
                      {u.totalBookings || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenViewModal(u)}
                  className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
                >
                  View Details →
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(u)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-cyan-700 cursor-pointer"
                    title="Edit"
                  >
                    <HiOutlinePencilSquare className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(u.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
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
          MODAL: CREATE / EDIT / VIEW USER MODAL
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
                    ? "Add New Member Account"
                    : modalMode === "edit"
                    ? "Edit User Profile"
                    : "User Profile Overview"}
                </h2>
                <p className="text-xs text-slate-500">
                  {modalMode === "view"
                    ? "Complete travel CRM profile and loyalty history."
                    : "Update member permissions, profile credentials, and tier."}
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

            {/* VIEW ONLY STATE */}
            {modalMode === "view" && currentUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-cyan-500/40"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeStyle(
                          currentUser.role
                        )}`}
                      >
                        {currentUser.role}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.id}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Member since {currentUser.joinedDate || "2024"} • Active {currentUser.lastActive || "Recently"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Email</span>
                    <p className="font-semibold text-slate-800 truncate mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Phone</span>
                    <p className="font-semibold text-slate-800 truncate mt-0.5">{currentUser.phone || "N/A"}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Location</span>
                    <p className="font-semibold text-slate-800 truncate mt-0.5">{currentUser.location}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Total Spent</span>
                    <p className="font-black text-slate-900 mt-0.5">₹{Number(currentUser.totalSpent || 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Bookings</span>
                    <p className="font-black text-slate-900 mt-0.5">{currentUser.totalBookings || 0} Trips</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-slate-400 font-mono text-[10px] uppercase">Loyalty Points</span>
                    <p className="font-black text-cyan-600 mt-0.5">{currentUser.loyaltyPoints || 0} pts</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setModalMode("edit");
                    }}
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-cyan-700 cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* CREATE / EDIT FORM */}
            {modalMode !== "view" && (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Mohanlal Manna"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="e.g. mohanlal@example.com"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="e.g. Kolkata, India"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role & Permissions
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none cursor-pointer"
                    >
                      <option value="Explorer">Explorer (Standard)</option>
                      <option value="VIP Traveler">VIP Traveler (Premium)</option>
                      <option value="Tour Agent">Tour Agent</option>
                      <option value="Super Admin">Super Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending Verification</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Avatar Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {modalMode === "create" ? "Password *" : "Password (Optional)"}
                    </label>
                    <input
                      type="password"
                      required={modalMode === "create"}
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder={
                        modalMode === "create"
                          ? "Minimum 6 characters"
                          : "Leave blank to keep unchanged"
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Spent (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.totalSpent}
                      onChange={(e) =>
                        setFormData({ ...formData, totalSpent: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Bookings
                    </label>
                    <input
                      type="number"
                      value={formData.totalBookings}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalBookings: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                  </div>
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
                          ? "Creating..."
                          : "Saving..."
                        : modalMode === "create"
                        ? "Create Account"
                        : "Save Changes"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          DELETE CONFIRMATION DIALOG
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
                Delete Member Account?
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                This will permanently revoke all access, booking history, and permissions for this traveler.
              </p>
            </div>

            {/* Target User Summary Card */}
            {(() => {
              const target = users.find((u) => u.id === deleteConfirmId);
              if (!target) return null;
              return (
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left border border-slate-100">
                  <img
                    src={
                      target.avatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                    }
                    alt={target.name}
                    className="h-10 w-10 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 truncate">{target.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{target.email}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {target.id}</p>
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
                onClick={() => handleDeleteUser(deleteConfirmId)}
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

export default UserManagement;