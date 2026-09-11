import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
} from "react-icons/hi2";
import { PiAirplaneTiltBold } from "react-icons/pi";

const Notification = () => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Selected Notification & Modal States
  const [activeNotification, setActiveNotification] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Reply Form State
  const [replyData, setReplyData] = useState({
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    channel: "both", // "email" | "sms" | "both"
    subject: "",
    message: "",
  });
  const [isSendingReply, setIsSendingReply] = useState(false);

  // API Endpoint
  const NOTIFICATIONS_URL =
    import.meta.env.VITE_NOTIFICATIONS_DATA_URL || "/notificationsData.json";

  // ---------------------------------------------------------------------------
  // DATA FETCHING VIA API
  // ---------------------------------------------------------------------------
  const fetchNotifications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await axios.get(NOTIFICATIONS_URL);
      if (Array.isArray(response.data)) {
        setNotifications(response.data);
      } else {
        throw new Error("Invalid response format received from server");
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ---------------------------------------------------------------------------
  // FILTERING, SEARCHING & SORTING LOGIC
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
          n.id?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((n) => n.category === selectedCategory);
    }

    // Priority filter
    if (selectedPriority !== "all") {
      result = result.filter((n) => n.priority === selectedPriority);
    }

    // Status filter
    if (selectedStatus === "unread") {
      result = result.filter((n) => !n.isRead);
    } else if (selectedStatus === "read") {
      result = result.filter((n) => n.isRead);
    } else if (selectedStatus === "pending-reply") {
      result = result.filter((n) => !n.feedbackReply);
    }

    return result;
  }, [notifications, searchQuery, selectedCategory, selectedPriority, selectedStatus]);

  // KPI Metrics Calculation
  const stats = useMemo(() => {
    const totalCount = notifications.length;
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    const pendingReplies = notifications.filter((n) => !n.feedbackReply && n.category !== "System").length;
    const resolvedReplies = notifications.filter((n) => n.feedbackReply).length;

    return { totalCount, unreadCount, pendingReplies, resolvedReplies };
  }, [notifications]);

  // ---------------------------------------------------------------------------
  // ACTIONS & HANDLERS
  // ---------------------------------------------------------------------------
  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast("All notifications marked as read!");
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (activeNotification?.id === id) {
      setActiveNotification(null);
      setIsDetailModalOpen(false);
    }
    showToast("Notification deleted.");
  };

  // Open Feedback Reply Modal
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

  // Quick Template Injector
  const applyQuickTemplate = (templateType) => {
    if (!activeNotification) return;
    const name = activeNotification.user?.name || "Traveler";

    if (templateType === "quote") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Custom Quotation Prepared - Ghure Ashi`,
        message: `Dear ${name},\n\nWe have curated your customized travel quotation with exclusive private guides and VIP arrangements. A detailed PDF brochure has been dispatched to your email.\n\nWarm regards,\nMohanlal Manna\nGhure Ashi Executive Team`,
      }));
    } else if (templateType === "request-confirmed") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Special Request Confirmed - ${activeNotification.relatedEntity?.name || "Trip"}`,
        message: `Dear ${name},\n\nWe are pleased to confirm that your special requests (meal preferences & airport transfers) have been successfully attached to your booking itinerary.\n\nSafe travels!\nGhure Ashi Concierge`,
      }));
    } else if (templateType === "thank-you") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Thank you for your heartwarming feedback! ⭐`,
        message: `Dear ${name},\n\nThank you for sharing your wonderful experience with us! We have credited 500 Loyalty Bonus Points to your account as a token of our appreciation.\n\nWe look forward to hosting your next journey!\nGhure Ashi Team`,
      }));
    } else if (templateType === "refund") {
      setReplyData((prev) => ({
        ...prev,
        subject: `Refund Confirmation & Receipt`,
        message: `Dear ${name},\n\nYour cancellation request has been reviewed and the full refund has been released to your original payment method. Transaction ID: TXN-REF-SUCCESS.\n\nGhure Ashi Support Desk`,
      }));
    }
  };

  // Dispatch Feedback Reply (SMS + Email Simulation)
  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyData.message.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    setIsSendingReply(true);

    setTimeout(() => {
      // Update the notification item with the reply payload
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === activeNotification.id
            ? {
                ...n,
                isRead: true,
                feedbackReply: {
                  sentAt: new Date().toISOString(),
                  channel:
                    replyData.channel === "both"
                      ? "Email & SMS"
                      : replyData.channel === "sms"
                      ? "Direct SMS"
                      : "Official Email",
                  subject: replyData.subject,
                  message: replyData.message,
                },
              }
            : n
        )
      );

      setIsSendingReply(false);
      setIsReplyModalOpen(false);

      const channelLabel =
        replyData.channel === "both"
          ? "Email & SMS"
          : replyData.channel === "sms"
          ? "SMS message"
          : "Email message";

      showToast(
        `Feedback ${channelLabel} successfully dispatched to ${replyData.recipientName} (${replyData.recipientEmail})!`
      );
    }, 700);
  };

  // Helper for priority badges
  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-700 border-rose-500/30";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-500/30";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Helper for category badges
  const getCategoryBadgeStyle = (category) => {
    switch (category) {
      case "Inquiry":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-500/20";
      case "Booking":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Feedback":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
      case "Support":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default:
        return "bg-slate-500/10 text-slate-700 border-slate-500/20";
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm font-semibold text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
          <HiOutlineCheck className="text-lg text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Primary Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <HiOutlineBell className="text-sm text-cyan-600" />
            <span>Customer Inquiries & Communication Center</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl font-sans">
            Inquiries, Feedback & Notifications
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Review traveler inquiries, send direct Email/SMS feedback replies, and manage customer communications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Refresh Data */}
          <button
            type="button"
            onClick={() => fetchNotifications(true)}
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

          {/* Mark all as read */}
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
          >
            <HiOutlineEnvelopeOpen className="text-base text-slate-500" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Total Inquiries
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 transition-transform group-hover:scale-110">
              <HiOutlineBell className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.totalCount}
            </span>
            <span className="text-xs font-semibold text-cyan-600">All alerts</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Unread Messages
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 transition-transform group-hover:scale-110">
              <HiOutlineEnvelope className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.unreadCount}
            </span>
            {stats.unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                Action needed
              </span>
            )}
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Pending Feedback Reply
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-110">
              <HiOutlineClock className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.pendingReplies}
            </span>
            <span className="text-xs font-semibold text-amber-600">Awaiting SMS/Email</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              Resolved & Replied
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform group-hover:scale-110">
              <HiOutlineCheckCircle className="text-lg" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-sans">
              {stats.resolvedReplies}
            </span>
            <span className="text-xs font-semibold text-emerald-600">Dispatched</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        {/* Search Field */}
        <div className="relative flex-1 max-w-lg">
          <HiOutlineMagnifyingGlass className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 text-base" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries by traveler name, message, email, or ID..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pr-4 pl-10 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Selectors and Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Category Tabs */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 overflow-x-auto">
            {[
              { id: "all", label: "All Types" },
              { id: "Inquiry", label: "Inquiries" },
              { id: "Booking", label: "Bookings" },
              { id: "Feedback", label: "Reviews" },
              { id: "Support", label: "Support" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? "bg-white text-cyan-700 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Status: All</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
            <option value="pending-reply">Pending Feedback Reply</option>
          </select>

          {/* Priority Selector */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Priority: All</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                  <div className="h-4 w-40 rounded bg-slate-200" />
                </div>
                <div className="h-5 w-20 rounded-full bg-slate-100" />
              </div>
              <div className="h-3 w-3/4 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error Fallback */}
      {error && !loading && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center space-y-3">
          <HiOutlineExclamationTriangle className="mx-auto text-4xl text-rose-500" />
          <h3 className="text-base font-bold text-rose-900">Failed to Load Inquiries</h3>
          <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={() => fetchNotifications()}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 cursor-pointer"
          >
            <HiOutlineArrowPath /> Retry Fetching
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <HiOutlineBell className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No inquiries match your current filters or search term.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedPriority("all");
              setSelectedStatus("all");
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          MAIN NOTIFICATION FEED LIST
          ----------------------------------------------------------------------- */}
      {!loading && !error && filteredNotifications.length > 0 && (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:border-slate-300 hover:shadow-md ${
                !n.isRead
                  ? "border-cyan-500/30 bg-white shadow-2xs ring-1 ring-cyan-500/10"
                  : "border-slate-200/80 bg-white"
              }`}
            >
              {/* Unread Left Border Highlight */}
              {!n.isRead && (
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-cyan-500 to-blue-600" />
              )}

              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  {/* Sender & Notification Header */}
                  <div className="flex items-start gap-3.5">
                    <img
                      src={
                        n.user?.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"
                      }
                      alt={n.user?.name}
                      className="h-11 w-11 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                          {n.user?.name}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeStyle(
                            n.category
                          )}`}
                        >
                          {n.category}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getPriorityBadgeStyle(
                            n.priority
                          )}`}
                        >
                          {n.priority}
                        </span>
                        {!n.isRead && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                            New
                          </span>
                        )}
                      </div>

                      {/* Contact details */}
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <HiOutlineEnvelope className="text-slate-400" /> {n.user?.email}
                        </span>
                        {n.user?.phone && (
                          <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                            <HiOutlinePhone className="text-slate-400" /> {n.user?.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timestamp & Quick Status */}
                  <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-400 font-mono">
                    <HiOutlineClock className="text-slate-400" />
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Notification Message Body */}
                <div className="mt-3 pl-0 sm:pl-14">
                  <h4 className="text-sm font-bold text-slate-900">
                    {n.title}
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {n.message}
                  </p>

                  {/* Related Entity (Trip / Booking Link) */}
                  {n.relatedEntity && (
                    <div className="mt-2.5 inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-xs text-slate-700">
                      <PiAirplaneTiltBold className="text-cyan-600 text-sm" />
                      <span className="font-semibold text-slate-800">{n.relatedEntity.type}:</span>
                      <span className="text-slate-600 font-medium">{n.relatedEntity.name}</span>
                    </div>
                  )}

                  {/* Already Sent Feedback Reply Banner */}
                  {n.feedbackReply && (
                    <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-emerald-800">
                        <span className="flex items-center gap-1.5">
                          <HiOutlineCheckCircle className="text-emerald-600 text-sm" />
                          Feedback SMS/Email Dispatched ({n.feedbackReply.channel})
                        </span>
                        <span className="text-[10px] text-emerald-600 font-mono">
                          {new Date(n.feedbackReply.sentAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 text-[11px] italic bg-white/70 p-2 rounded-xl border border-emerald-100 mt-1">
                        "{n.feedbackReply.message}"
                      </p>
                    </div>
                  )}

                  {/* Action Buttons Row */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(n.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        {n.isRead ? <HiOutlineEnvelope /> : <HiOutlineEnvelopeOpen />}
                        {n.isRead ? "Mark Unread" : "Mark Read"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNotification(n.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 cursor-pointer"
                      >
                        <HiOutlineTrash />
                        Delete
                      </button>
                    </div>

                    {/* Primary Reply Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenReplyModal(n)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 cursor-pointer active:scale-95"
                    >
                      <HiOutlinePaperAirplane className="text-sm" />
                      {n.feedbackReply ? "Send Follow-up SMS/Email" : "Send Feedback Reply (SMS/Email)"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -----------------------------------------------------------------------
          ADMIN FEEDBACK REPLY / SMS & EMAIL DISPATCHER MODAL
          ----------------------------------------------------------------------- */}
      {isReplyModalOpen && activeNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsReplyModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HiOutlinePaperAirplane className="text-cyan-600" />
                  Dispatch Customer Feedback & SMS Reply
                </h2>
                <p className="text-xs text-slate-500">
                  Direct communication with {activeNotification.user?.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReplyModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <HiOutlineXMark className="text-xl" />
              </button>
            </div>

            {/* Traveler Snapshot Card */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
              <div className="flex items-center gap-3">
                <img
                  src={activeNotification.user?.avatar}
                  alt={activeNotification.user?.name}
                  className="h-10 w-10 rounded-xl object-cover ring-2 ring-cyan-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{activeNotification.user?.name}</h4>
                  <p className="text-[11px] text-slate-500">{activeNotification.user?.email}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{activeNotification.user?.phone || "No phone registered"}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-md">
                {activeNotification.user?.role || "Traveler"}
              </span>
            </div>

            {/* Quick Template Buttons */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                ⚡ Quick Response Templates
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("quote")}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-cyan-400 hover:text-cyan-700 cursor-pointer shadow-2xs"
                >
                  📄 Send Custom Quote
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("request-confirmed")}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-cyan-400 hover:text-cyan-700 cursor-pointer shadow-2xs"
                >
                  ✅ Confirm Special Request
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("thank-you")}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-cyan-400 hover:text-cyan-700 cursor-pointer shadow-2xs"
                >
                  ⭐ Thank for Review (+500 pts)
                </button>
                <button
                  type="button"
                  onClick={() => applyQuickTemplate("refund")}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-cyan-400 hover:text-cyan-700 cursor-pointer shadow-2xs"
                >
                  💳 Refund Acknowledgment
                </button>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-4">
              {/* Channel Selector: Email / SMS / Both */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dispatch Delivery Channel *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "both", label: "Email + SMS", icon: HiOutlineChatBubbleLeftRight },
                    { id: "email", label: "Email Only", icon: HiOutlineEnvelope },
                    { id: "sms", label: "SMS Text", icon: HiOutlineDevicePhoneMobile },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setReplyData({ ...replyData, channel: ch.id })}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all cursor-pointer ${
                          replyData.channel === ch.id
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700 ring-2 ring-cyan-500/20 shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="text-base" />
                        <span>{ch.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Subject / SMS Header *
                </label>
                <input
                  type="text"
                  required
                  value={replyData.subject}
                  onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                  placeholder="e.g. Quotation for Paris Escapes - Ghure Ashi"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
              </div>

              {/* Message Body */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Feedback Message Body *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {replyData.message.length} characters
                  </span>
                </div>
                <textarea
                  rows="4"
                  required
                  value={replyData.message}
                  onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                  placeholder="Type your official response, travel details, or SMS confirmation..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50"
                >
                  {isSendingReply ? (
                    <>
                      <HiOutlineArrowPath className="animate-spin text-sm" />
                      <span>Sending SMS & Email...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlinePaperAirplane className="text-sm" />
                      <span>Send Dispatch Reply</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;