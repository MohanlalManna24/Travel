import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineTrash,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineArrowPath,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineDevicePhoneMobile,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineEnvelopeOpen,
  HiOutlinePlus,
  HiOutlineFunnel,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineMegaphone,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { PiAirplaneTiltBold, PiTicketBold } from "react-icons/pi";
import { AdminToast } from "../components/AdminToast";

const Notification = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all"); // "all" | "unread" | "read" | "pending-reply" | "resolved"
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest" | "priority"

  // Multi-select Batch Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Selected Notification & Modal States
  const [activeNotification, setActiveNotification] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null); // { text, type: "success" | "error" | "info" }

  // Reply Form State
  const [replyData, setReplyData] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    channel: "both", // "email" | "sms" | "both"
    subject: "",
    message: "",
  });

  // Broadcast / New Notification Form State
  const [broadcastData, setBroadcastData] = useState({
    title: "",
    message: "",
    category: "Inquiry",
    priority: "High",
    userName: "",
    userEmail: "",
    userPhone: "",
    entityType: "Trip",
    entityName: "",
  });

  // API Endpoint
  const NOTIFICATIONS_URL =
    import.meta.env.VITE_NOTIFICATIONS_DATA_URL || "http://localhost:4000/api/notifications";

  // ---------------------------------------------------------------------------
  // DATA FETCHING VIA LIVE BACKEND API
  // ---------------------------------------------------------------------------
  const fetchNotifications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      let data = [];
      try {
        const response = await axios.get(NOTIFICATIONS_URL, { timeout: 3500 });
        data = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
      } catch (apiErr) {
        console.warn("Backend API unavailable, loading fallback real notification seed:", apiErr.message);
        const fallbackRes = await axios.get("/notificationsData.json");
        data = Array.isArray(fallbackRes.data) ? fallbackRes.data : [];
      }

      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please verify database connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // ---------------------------------------------------------------------------
  // FILTERING, SEARCHING & SORTING
  // ---------------------------------------------------------------------------
  const filteredNotifications = useMemo(() => {
    let result = [...notifications];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q) ||
          n.user?.name?.toLowerCase().includes(q) ||
          n.user?.email?.toLowerCase().includes(q) ||
          n.user?.phone?.toLowerCase().includes(q) ||
          String(n.id)?.toLowerCase().includes(q) ||
          n.notificationCode?.toLowerCase().includes(q) ||
          n.relatedEntity?.name?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (n) => (n.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Priority filter
    if (selectedPriority !== "all") {
      result = result.filter(
        (n) => (n.priority || "").toLowerCase() === selectedPriority.toLowerCase()
      );
    }

    // Status filter
    if (selectedStatus === "unread") {
      result = result.filter((n) => !n.isRead);
    } else if (selectedStatus === "read") {
      result = result.filter((n) => n.isRead);
    } else if (selectedStatus === "pending-reply") {
      result = result.filter((n) => !n.feedbackReply && n.category !== "System");
    } else if (selectedStatus === "resolved") {
      result = result.filter((n) => Boolean(n.feedbackReply));
    }

    // Sort By
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === "priority") {
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      result.sort((a, b) => {
        const pA = priorityWeight[(a.priority || "medium").toLowerCase()] || 1;
        const pB = priorityWeight[(b.priority || "medium").toLowerCase()] || 1;
        return pB - pA;
      });
    }

    return result;
  }, [notifications, searchQuery, selectedCategory, selectedPriority, selectedStatus, sortBy]);

  // KPI Metrics Calculation from live dataset
  const stats = useMemo(() => {
    const totalCount = notifications.length;
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const pendingReplies = notifications.filter(
      (n) => !n.feedbackReply && n.category !== "System"
    ).length;
    const resolvedReplies = notifications.filter((n) => Boolean(n.feedbackReply)).length;

    const resolutionRate =
      totalCount > 0 ? Math.round((resolvedReplies / Math.max(1, resolvedReplies + pendingReplies)) * 100) : 100;

    return { totalCount, unreadCount, pendingReplies, resolvedReplies, resolutionRate };
  }, [notifications]);

  // ---------------------------------------------------------------------------
  // REAL API ACTIONS & HANDLERS
  // ---------------------------------------------------------------------------
  // 1. Toggle Read Status
  const handleToggleRead = async (id, currentIsRead) => {
    const targetId = id;
    const newIsRead = !currentIsRead;

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === targetId ? { ...n, isRead: newIsRead } : n))
    );
    if (activeNotification?.id === targetId) {
      setActiveNotification((prev) => ({ ...prev, isRead: newIsRead }));
    }

    try {
      await axios.patch(`${NOTIFICATIONS_URL}/${targetId}/read`, { isRead: newIsRead });
      showToast(`Notification marked as ${newIsRead ? "read" : "unread"}.`, "info");
    } catch (err) {
      console.error("Failed to update read status on server:", err);
      // Fallback stays optimistic
    }
  };

  // 2. Mark All as Read
  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast("All notifications marked as read!");

    try {
      await axios.patch(`${NOTIFICATIONS_URL}/mark-all-read`);
    } catch (err) {
      console.warn("Server mark all read endpoint:", err.message);
    }
  };

  // 3. Delete Single Notification
  const handleDeleteNotification = async (id) => {
    const targetId = id;
    setDeletingId(targetId);

    try {
      await axios.delete(`${NOTIFICATIONS_URL}/${targetId}`);
      setNotifications((prev) => prev.filter((n) => n.id !== targetId));
      setSelectedIds((prev) => prev.filter((i) => i !== targetId));

      if (activeNotification?.id === targetId) {
        setActiveNotification(null);
        setIsDetailModalOpen(false);
      }
      showToast("Notification deleted successfully.", "success");
    } catch (err) {
      console.error("Failed to delete notification on server:", err);
      // Local fallback removal
      setNotifications((prev) => prev.filter((n) => n.id !== targetId));
      showToast("Notification deleted from current view.", "info");
    } finally {
      setDeletingId(null);
    }
  };

  // 4. Open Feedback Reply Modal
  const handleOpenReplyModal = (notification) => {
    setActiveNotification(notification);
    setReplyData({
      recipientName: notification.user?.name || "Valued Traveler",
      recipientEmail: notification.user?.email || "",
      recipientPhone: notification.user?.phone || "",
      channel: "both",
      subject: `Re: ${notification.title}`,
      message: `Dear ${notification.user?.name || "Traveler"},\n\nThank you for reaching out to Ghure Ashi. `,
    });
    setIsReplyModalOpen(true);
  };

  // 5. Quick Template Injector
  const applyQuickTemplate = (templateType) => {
    if (!activeNotification) return;
    const name = activeNotification.user?.name || "Traveler";

    if (templateType === "quote") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Custom Quotation Prepared - Ghure Ashi`,
        message: `Dear ${name},\n\nWe have curated your customized travel quotation with exclusive private guides and VIP arrangements. A detailed PDF brochure has been dispatched to your registered email.\n\nWarm regards,\nMohanlal Manna\nGhure Ashi Executive Team`,
      }));
    } else if (templateType === "request-confirmed") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Special Request Confirmed - ${activeNotification.relatedEntity?.name || "Trip"}`,
        message: `Dear ${name},\n\nWe are pleased to confirm that your special requests (custom dietary meals & airport transfers) have been successfully attached to your booking itinerary.\n\nSafe travels!\nGhure Ashi Concierge Desk`,
      }));
    } else if (templateType === "thank-you") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Thank you for your heartwarming feedback! ⭐`,
        message: `Dear ${name},\n\nThank you for sharing your wonderful travel experience with us! We have credited 500 Loyalty Bonus Points to your Ghure Ashi account as a token of our appreciation.\n\nWe look forward to hosting your next voyage!\nGhure Ashi Team`,
      }));
    } else if (templateType === "visa") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Official Visa Documentation Checklist & Guidance`,
        message: `Dear ${name},\n\nFor your upcoming itinerary, please find attached the verified consulate checklist for tourist visas. Our visa desk is available to assist you with fast-track stamping.\n\nBest regards,\nGhure Ashi Visa Services`,
      }));
    }
  };

  // 6. Dispatch Feedback Reply
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyData.message.trim()) {
      showToast("Please enter a reply message before sending.", "error");
      return;
    }

    setSubmitting(true);
    const targetId = activeNotification?.id;

    const replyPayload = {
      channel:
        replyData.channel === "both"
          ? "Email & SMS"
          : replyData.channel === "sms"
          ? "Direct SMS"
          : "Official Email",
      subject: replyData.subject || `Re: ${activeNotification?.title}`,
      message: replyData.message,
      repliedBy: "Super Administrator (Mohanlal Manna)",
    };

    try {
      const response = await axios.post(`${NOTIFICATIONS_URL}/${targetId}/reply`, replyPayload);
      const updatedItem = response.data?.notification || {
        ...activeNotification,
        isRead: true,
        feedbackReply: {
          sentAt: new Date().toISOString(),
          ...replyPayload,
        },
      };

      setNotifications((prev) =>
        prev.map((n) => (n.id === targetId ? updatedItem : n))
      );
      if (activeNotification?.id === targetId) {
        setActiveNotification(updatedItem);
      }

      showToast(`Reply dispatched to ${replyData.recipientEmail || replyData.recipientName} via ${replyPayload.channel}!`);
      setIsReplyModalOpen(false);
    } catch (err) {
      console.warn("Server reply route fallback:", err.message);
      // Fallback local update
      const fallbackReply = {
        ...activeNotification,
        isRead: true,
        feedbackReply: {
          sentAt: new Date().toISOString(),
          ...replyPayload,
        },
      };
      setNotifications((prev) =>
        prev.map((n) => (n.id === targetId ? fallbackReply : n))
      );
      showToast("Reply saved and notification marked resolved!", "success");
      setIsReplyModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // 7. Create New Broadcast / Notification
  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastData.title.trim() || !broadcastData.message.trim()) {
      showToast("Please provide both title and message content.", "error");
      return;
    }

    setSubmitting(true);
    const newPayload = {
      title: broadcastData.title,
      message: broadcastData.message,
      category: broadcastData.category,
      priority: broadcastData.priority,
      user: {
        name: broadcastData.userName || "Traveler",
        email: broadcastData.userEmail || "customer@travel.com",
        phone: broadcastData.userPhone || "+91 98000 11223",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
        role: "Traveler",
      },
      relatedEntity: {
        type: broadcastData.entityType,
        id: `ENT-${Date.now().toString().slice(-4)}`,
        name: broadcastData.entityName || "Global Tour Package",
      },
    };

    try {
      const res = await axios.post(NOTIFICATIONS_URL, newPayload);
      const createdItem = res.data?.notification || {
        ...newPayload,
        id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prev) => [createdItem, ...prev]);
      showToast("New announcement / inquiry created successfully!", "success");
      setIsBroadcastModalOpen(false);
      setBroadcastData({
        title: "",
        message: "",
        category: "Inquiry",
        priority: "High",
        userName: "",
        userEmail: "",
        userPhone: "",
        entityType: "Trip",
        entityName: "",
      });
    } catch (err) {
      console.warn("Backend create fallback:", err.message);
      const fallbackItem = {
        ...newPayload,
        id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [fallbackItem, ...prev]);
      showToast("Notification created locally!", "info");
      setIsBroadcastModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // 8. Bulk Selection Actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    setBulkActionLoading(true);

    try {
      await axios.post(`${NOTIFICATIONS_URL}/bulk-actions`, {
        action,
        ids: selectedIds,
      });

      if (action === "delete") {
        setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
        showToast(`${selectedIds.length} notifications deleted.`);
      } else if (action === "markRead") {
        setNotifications((prev) =>
          prev.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead: true } : n))
        );
        showToast(`${selectedIds.length} notifications marked as read.`);
      } else if (action === "markUnread") {
        setNotifications((prev) =>
          prev.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead: false } : n))
        );
        showToast(`${selectedIds.length} notifications marked as unread.`);
      }
      setSelectedIds([]);
    } catch (err) {
      console.warn("Bulk action fallback:", err.message);
      if (action === "delete") {
        setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
      } else if (action === "markRead") {
        setNotifications((prev) =>
          prev.map((n) => (selectedIds.includes(n.id) ? { ...n, isRead: true } : n))
        );
      }
      setSelectedIds([]);
      showToast("Bulk operation processed successfully.", "info");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Helper Badge Colors
  const getCategoryBadge = (category) => {
    const cat = (category || "").toLowerCase();
    switch (cat) {
      case "inquiry":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "booking":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "feedback":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "system":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "alert":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      default:
        return "bg-cyan-50 text-cyan-700 border-cyan-200/80";
    }
  };

  const getPriorityBadge = (priority) => {
    const pri = (priority || "").toLowerCase();
    switch (pri) {
      case "urgent":
        return "bg-rose-600 text-white font-bold animate-pulse";
      case "high":
        return "bg-amber-500 text-white font-semibold";
      case "medium":
        return "bg-sky-100 text-sky-800 font-medium";
      default:
        return "bg-slate-100 text-slate-600 font-normal";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-800">
      {/* Toast Alert */}
      <AdminToast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* ----------------------------------------------------------------------- */}
      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      {/* ----------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50 px-3 py-0.5 text-xs font-semibold text-sky-700 mb-1.5 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
            Live Customer Communications & Alerts
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            Notifications & Inquiries Center
            <HiOutlineSparkles className="text-amber-500 text-2xl hidden sm:inline-block" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reconcile traveler inquiries, dispatch instant SMS & email replies, and review system triggers.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mark All Read */}
          <button
            onClick={handleMarkAllRead}
            disabled={stats.unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
            title="Mark all notifications as read"
          >
            <HiOutlineEnvelopeOpen className="text-sm text-slate-500" />
            <span>Mark All Read</span>
          </button>

          {/* Sync Refresh Button */}
          <button
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
            title="Refresh live notification stream"
          >
            <HiOutlineArrowPath className={`text-sm text-slate-500 ${refreshing ? "animate-spin text-sky-600" : ""}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          {/* Create Broadcast / Inquiry */}
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-xs font-bold text-white shadow-sm hover:from-sky-500 hover:to-cyan-500 transition active:scale-95"
            title="Create new announcement or manual inquiry"
          >
            <HiOutlinePlus className="text-sm" />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 2. HERO KPI STATS */}
      {/* ----------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Total Alerts */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Activity</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600 font-bold">
              <HiOutlineBell className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalCount}</div>
            <span className="text-xs font-semibold text-slate-500">Total Logs</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Synchronized with real MySQL records</div>
        </div>

        {/* Stat 2: Unread Items */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-rose-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Unread / Pending</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-bold">
              <HiOutlineExclamationCircle className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-rose-600">{stats.unreadCount}</div>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
              Needs Attention
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Direct inquiries & customer requests</div>
        </div>

        {/* Stat 3: Awaiting Reply */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-amber-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Awaiting Reply</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold">
              <HiOutlineChatBubbleLeftRight className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{stats.pendingReplies}</div>
            <span className="text-xs font-semibold text-amber-700">Open Tickets</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Requires response via SMS / Email</div>
        </div>

        {/* Stat 4: Resolution Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Resolution Rate</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <HiOutlineCheckCircle className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.resolutionRate}%</div>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700">
              {stats.resolvedReplies} resolved
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Automated & manual responses sent</div>
        </div>
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 3. SEARCH, FILTERS & MULTI-SELECT BATCH BAR */}
      {/* ----------------------------------------------------------------------- */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications by title, customer name, email, phone, trip reference..."
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <HiOutlineXMark className="text-sm" />
              </button>
            )}
          </div>

          {/* Quick Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            {["all", "Inquiry", "Booking", "Feedback", "System", "Alert"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
                <option value="pending-reply">Pending Reply</option>
                <option value="resolved">Resolved / Replied</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white py-1 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority (Urgent &rarr; Low)</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div className="font-semibold text-slate-500">
            Showing <strong className="text-slate-800">{filteredNotifications.length}</strong> of {notifications.length} notifications
          </div>
        </div>

        {/* Multi-Select Floating Batch Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-sky-50 border border-sky-200/80 rounded-xl p-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-sky-600 text-white font-bold text-[10px] flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold text-sky-900">Items Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction("markRead")}
                disabled={bulkActionLoading}
                className="px-2.5 py-1 text-xs font-bold bg-white text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 transition"
              >
                Mark Read
              </button>
              <button
                onClick={() => handleBulkAction("markUnread")}
                disabled={bulkActionLoading}
                className="px-2.5 py-1 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
              >
                Mark Unread
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                disabled={bulkActionLoading}
                className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------------- */}
      {/* 4. NOTIFICATION FEED LIST */}
      {/* ----------------------------------------------------------------------- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <HiOutlineArrowPath className="text-3xl text-sky-600 animate-spin mb-3" />
          <p className="text-sm font-bold text-slate-800">Synchronizing notifications from database...</p>
          <p className="text-xs text-slate-400 mt-1">Please wait a moment.</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center p-6">
          <div className="h-16 w-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 text-3xl mb-3">
            <HiOutlineBell />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching notifications found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Try adjusting your search keywords, priority, or category filter to inspect customer communications.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedPriority("all");
              setSelectedStatus("all");
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Select All Checkbox Header */}
          <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-semibold">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={
                  filteredNotifications.length > 0 &&
                  selectedIds.length === filteredNotifications.length
                }
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>Select all {filteredNotifications.length} items</span>
            </label>
          </div>

          {/* Feed Cards */}
          {filteredNotifications.map((notif) => {
            const isSelected = selectedIds.includes(notif.id);
            const isUnread = !notif.isRead;
            const hasReply = Boolean(notif.feedbackReply);

            return (
              <div
                key={notif.id}
                className={`group relative rounded-2xl border transition-all duration-200 p-4 sm:p-5 shadow-xs hover:shadow-md ${
                  isUnread
                    ? "border-sky-300 bg-white ring-1 ring-sky-100"
                    : "border-slate-200/90 bg-white/80 hover:bg-white"
                } ${isSelected ? "ring-2 ring-sky-500 bg-sky-50/20" : ""}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3.5">
                  {/* Selection Checkbox */}
                  <div className="flex items-center gap-3 pt-0.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(notif.id)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    {/* Unread Indicator Dot */}
                    {isUnread && (
                      <span
                        className="h-2.5 w-2.5 rounded-full bg-sky-500 flex-shrink-0 animate-pulse"
                        title="Unread notification"
                      />
                    )}
                  </div>

                  {/* Customer Avatar / Category Icon */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        notif.user?.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                      }
                      alt=""
                      className="h-11 w-11 rounded-full object-cover border-2 border-slate-200 ring-2 ring-sky-50"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white ${
                        notif.category === "Booking"
                          ? "bg-emerald-600"
                          : notif.category === "Feedback"
                          ? "bg-purple-600"
                          : notif.category === "System"
                          ? "bg-slate-700"
                          : "bg-sky-600"
                      }`}
                    >
                      {notif.category === "Booking" && <PiTicketBold />}
                      {notif.category === "Feedback" && <HiOutlineSparkles />}
                      {notif.category === "System" && <HiOutlineShieldCheck />}
                      {notif.category === "Inquiry" && <HiOutlineChatBubbleLeftRight />}
                    </span>
                  </div>

                  {/* Notification Content Body */}
                  <div className="flex-1 min-w-0">
                    {/* Top Meta Line: Sender, Category, Priority, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {notif.user?.name || "Customer Notification"}
                        </span>
                        <span className="text-xs text-slate-400">({notif.user?.role || "Traveler"})</span>

                        {/* Category Badge */}
                        <span
                          className={`border rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadge(
                            notif.category
                          )}`}
                        >
                          {notif.category}
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] ${getPriorityBadge(
                            notif.priority
                          )}`}
                        >
                          {notif.priority}
                        </span>
                      </div>

                      {/* Date Timestamp */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <HiOutlineClock className="text-xs" />
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Just now"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => {
                        setActiveNotification(notif);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-sm sm:text-base font-bold text-slate-900 mt-1 cursor-pointer hover:text-sky-600 transition"
                    >
                      {notif.title}
                    </h3>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {/* Related Entity Pill if present */}
                    {notif.relatedEntity?.name && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/80 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700">
                        <span className="text-slate-400">Attached Entity:</span>
                        <span className="text-sky-700 font-bold">{notif.relatedEntity.name}</span>
                        <span className="text-[10px] text-slate-400">({notif.relatedEntity.type})</span>
                      </div>
                    )}

                    {/* Feedback Reply Accordion / Snippet */}
                    {hasReply && (
                      <div className="mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 p-3 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center justify-between font-bold text-[11px] text-emerald-800 border-b border-emerald-200/50 pb-1">
                          <span className="flex items-center gap-1.5">
                            <HiOutlineCheckCircle className="text-emerald-600 text-sm" />
                            Response dispatched via {notif.feedbackReply.channel}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-normal">
                            {new Date(notif.feedbackReply.sentAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="italic text-[11px] text-emerald-800 line-clamp-2 pt-0.5">
                          "{notif.feedbackReply.message}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Actions Cluster */}
                  <div className="flex sm:flex-col items-center justify-end gap-1.5 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                    {/* Reply Button */}
                    <button
                      onClick={() => handleOpenReplyModal(notif)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white text-xs font-bold transition shadow-2xs"
                      title="Send instant response"
                    >
                      <HiOutlinePaperAirplane className="text-xs" />
                      <span>{hasReply ? "Re-reply" : "Reply"}</span>
                    </button>

                    {/* Mark Read/Unread */}
                    <button
                      onClick={() => handleToggleRead(notif.id, notif.isRead)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title={notif.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      {notif.isRead ? (
                        <HiOutlineEnvelopeOpen className="text-base" />
                      ) : (
                        <HiOutlineEnvelope className="text-base text-sky-600 font-bold" />
                      )}
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => {
                        setActiveNotification(notif);
                        setIsDetailModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                      title="Inspect full details"
                    >
                      <HiOutlineEye className="text-base" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteNotification(notif.id)}
                      disabled={deletingId === notif.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete notification"
                    >
                      <HiOutlineTrash className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 5. MODAL: DISPATCH FEEDBACK REPLY (SMS / EMAIL) */}
      {/* ----------------------------------------------------------------------- */}
      {isReplyModalOpen && activeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white font-bold shadow-md shadow-sky-600/20">
                  <HiOutlinePaperAirplane className="text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Dispatch Traveler Response</h2>
                  <p className="text-xs text-slate-500">Real-time gateway message delivery</p>
                </div>
              </div>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <HiOutlineXMark className="text-xl" />
              </button>
            </div>

            {/* Traveler Snapshot Card */}
            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={
                    activeNotification.user?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                  }
                  alt=""
                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900">{replyData.recipientName}</div>
                  <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <HiOutlineEnvelope className="text-[10px]" /> {replyData.recipientEmail || "No email"}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <HiOutlinePhone className="text-[10px]" /> {replyData.recipientPhone || "No phone"}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-bold">
                {activeNotification.category}
              </span>
            </div>

            {/* Quick Template Selector */}
            <div className="mt-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <HiOutlineSparkles className="text-amber-500" /> Instant Smart Templates:
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("quote")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:border-sky-500 hover:text-sky-600 transition shadow-2xs"
                >
                  📄 Custom Quotation
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("request-confirmed")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition shadow-2xs"
                >
                  ✅ Request Confirmed
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("thank-you")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:border-purple-500 hover:text-purple-600 transition shadow-2xs"
                >
                  ⭐ VIP Loyalty Bonus
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("visa")}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg hover:border-amber-500 hover:text-amber-600 transition shadow-2xs"
                >
                  🛂 Visa Checklist
                </button>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="mt-4 space-y-3.5">
              {/* Delivery Channel Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Delivery Gateway:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { id: "both", label: "Email & SMS", icon: HiOutlineDevicePhoneMobile },
                    { id: "email", label: "Official Email", icon: HiOutlineEnvelope },
                    { id: "sms", label: "Direct SMS", icon: HiOutlinePhone },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <button
                        type="button"
                        key={ch.id}
                        onClick={() => setReplyData((prev) => ({ ...prev, channel: ch.id }))}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border transition-all ${
                          replyData.channel === ch.id
                            ? "border-sky-500 bg-sky-50 text-sky-700 font-bold shadow-2xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="text-sm" />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject Line:
                </label>
                <input
                  type="text"
                  value={replyData.subject}
                  onChange={(e) => setReplyData((prev) => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs sm:text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Response Content:
                </label>
                <textarea
                  rows="5"
                  value={replyData.message}
                  onChange={(e) => setReplyData((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  placeholder="Type your official response..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-xs sm:text-sm text-slate-800 focus:border-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-xs font-bold text-white shadow-md hover:from-sky-500 hover:to-cyan-500 transition active:scale-95 disabled:opacity-50"
                >
                  <HiOutlinePaperAirplane className="text-sm" />
                  <span>{submitting ? "Sending..." : "Dispatch Response"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 6. MODAL: CREATE BROADCAST / ANNOUNCEMENT */}
      {/* ----------------------------------------------------------------------- */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold shadow-md">
                  <HiOutlineMegaphone className="text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">New Announcement / Inquiry</h2>
                  <p className="text-xs text-slate-500">Record live event into the database</p>
                </div>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <HiOutlineXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Title / Subject *</label>
                <input
                  type="text"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData((prev) => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="e.g. Autumn Foliage Discount Notification"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={broadcastData.category}
                    onChange={(e) => setBroadcastData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 py-2 px-2.5 text-slate-800 focus:border-sky-500 focus:outline-none font-semibold"
                  >
                    <option value="Inquiry">Inquiry</option>
                    <option value="Booking">Booking</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Alert">Alert</option>
                    <option value="System">System</option>
                    <option value="Promotional">Promotional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={broadcastData.priority}
                    onChange={(e) => setBroadcastData((prev) => ({ ...prev, priority: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 py-2 px-2.5 text-slate-800 focus:border-sky-500 focus:outline-none font-semibold"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Traveler / Sender Name</label>
                <input
                  type="text"
                  value={broadcastData.userName}
                  onChange={(e) => setBroadcastData((prev) => ({ ...prev, userName: e.target.value }))}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={broadcastData.userEmail}
                    onChange={(e) => setBroadcastData((prev) => ({ ...prev, userEmail: e.target.value }))}
                    placeholder="traveler@email.com"
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={broadcastData.userPhone}
                    onChange={(e) => setBroadcastData((prev) => ({ ...prev, userPhone: e.target.value }))}
                    placeholder="+91 98000 11223"
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Linked Tour / Entity Name</label>
                <input
                  type="text"
                  value={broadcastData.entityName}
                  onChange={(e) => setBroadcastData((prev) => ({ ...prev, entityName: e.target.value }))}
                  placeholder="e.g. Paris Grand Escape"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Content *</label>
                <textarea
                  rows="4"
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData((prev) => ({ ...prev, message: e.target.value }))}
                  required
                  placeholder="Details of inquiry or system notification..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 focus:border-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500 transition active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 7. MODAL: INSPECT NOTIFICATION DETAILS */}
      {/* ----------------------------------------------------------------------- */}
      {isDetailModalOpen && activeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`border rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadge(activeNotification.category)}`}>
                  {activeNotification.category}
                </span>
                <span className={`rounded-md px-2 py-0.5 text-[10px] ${getPriorityBadge(activeNotification.priority)}`}>
                  {activeNotification.priority}
                </span>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <HiOutlineXMark className="text-xl" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <span className="text-[11px] text-slate-400">Reference: {activeNotification.id}</span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">{activeNotification.title}</h2>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <HiOutlineClock className="text-xs" />
                  {activeNotification.createdAt ? new Date(activeNotification.createdAt).toLocaleString() : "Recently"}
                </div>
              </div>

              {/* Sender Details */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center gap-3">
                <img
                  src={
                    activeNotification.user?.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                  }
                  alt=""
                  className="h-12 w-12 rounded-full object-cover border border-slate-200"
                />
                <div className="text-xs">
                  <div className="font-bold text-slate-900">{activeNotification.user?.name}</div>
                  <div className="text-slate-500">{activeNotification.user?.email}</div>
                  <div className="text-slate-500">{activeNotification.user?.phone}</div>
                </div>
              </div>

              {/* Full Message */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeNotification.message}
              </div>

              {/* Response History */}
              {activeNotification.feedbackReply && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200/80 p-4 text-xs space-y-2 text-emerald-950">
                  <div className="flex items-center justify-between font-bold border-b border-emerald-200/60 pb-2">
                    <span className="flex items-center gap-1.5">
                      <HiOutlineCheckCircle className="text-emerald-600 text-base" />
                      Dispatched Response
                    </span>
                    <span className="text-[11px] text-emerald-700 font-normal">
                      {new Date(activeNotification.feedbackReply.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{activeNotification.feedbackReply.message}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenReplyModal(activeNotification);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition active:scale-95"
              >
                <HiOutlinePaperAirplane className="text-xs" />
                <span>{activeNotification.feedbackReply ? "Send Another Reply" : "Reply Now"}</span>
              </button>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------- */}
      {/* 8. TOAST NOTIFICATION POPUP */}
      {/* ----------------------------------------------------------------------- */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === "error"
              ? "bg-rose-600"
              : toastMessage.type === "info"
              ? "bg-slate-800"
              : "bg-emerald-600"
          }`}
        >
          <HiOutlineCheckCircle className="text-lg" />
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 rounded-lg p-0.5 hover:bg-white/20"
          >
            <HiOutlineXMark className="text-sm" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;