import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";

// =========================================================================
// REUSABLE HEADER SUB-COMPONENTS
// =========================================================================

/**
 * 1. Search Bar Component with Keyboard Shortcut Badge
 */
export const HeaderSearch = ({
  placeholder = "Search trips, bookings, users...",
  value,
  onChange,
  onSearch,
}) => {
  return (
    <div className="relative w-44 sm:w-64 lg:w-80">
      <HiOutlineMagnifyingGlass className="absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch && onSearch(value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2 pr-12 pl-10 text-xs text-slate-800 placeholder:text-slate-400 transition-all duration-200 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:outline-none sm:text-sm"
      />
      <div className="absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center sm:flex">
        <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 shadow-2xs">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};

/**
 * 2. Notification Bell Button with Interactive Unread Dot
 */
export const NotificationBell = ({ count = 3, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifications"
      className="group relative cursor-pointer rounded-xl border border-slate-200/80 bg-white p-2.5 text-slate-600 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
    >
      <HiOutlineBell className="text-xl transition-transform duration-300 group-hover:rotate-12 group-hover:text-cyan-600" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-linear-to-tr from-cyan-600 to-blue-600 text-[10px] font-bold text-white shadow-xs">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
};

/**
 * 3. User Profile Card & Dropdown Menu
 */
export const UserProfileBadge = ({
  user = {
    name: "Mohanlal Manna",
    role: "Super Administrator",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    status: "online",
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-1.5 pr-3 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-9 w-9 rounded-xl object-cover ring-2 ring-cyan-500/30"
          />
          {user.status === "online" && (
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          )}
        </div>

        <div className="hidden flex-col text-left sm:flex">
          <div className="flex items-center gap-1">
            <span className="max-w-30 truncate text-xs font-bold text-slate-800">
              {user.name}
            </span>
            <HiOutlineSparkles className="text-xs text-amber-500" />
          </div>
          <span className="text-[10px] font-medium text-slate-400">
            {user.role}
          </span>
        </div>

        <HiOutlineChevronDown
          className={`hidden text-xs text-slate-400 transition-transform duration-200 sm:block ${
            isOpen ? "rotate-180 text-cyan-600" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop dismissal overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header snippet */}
            <div className="border-b border-slate-100 px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-cyan-600 font-medium mt-0.5">
                <HiOutlineShieldCheck />
                {user.role}
              </p>
            </div>

            {/* Actions list */}
            <div className="pt-1.5 space-y-0.5">
              <Link
                to="/admin/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <HiOutlineCog6Tooth className="text-base text-slate-400" />
                Account Settings
              </Link>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="flex items-center gap-2.5">
                  <HiOutlineArrowTopRightOnSquare className="text-base text-slate-400" />
                  View Public Website
                </span>
                <span className="text-[10px] text-slate-400">↗</span>
              </Link>
            </div>

            {/* Logout Footer */}
            <div className="border-t border-slate-100 mt-1.5 pt-1.5">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                <HiOutlineArrowLeftOnRectangle className="text-base" />
                Sign Out
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/**
 * 4. Page Title / Breadcrumb Area
 */
export const PageHeading = ({ title, subtitle }) => {
  const location = useLocation();

  // Determine dynamic title from route if not explicitly provided
  const routeTitles = {
    "/admin": "Dashboard Overview",
    "/admin/dashboard": "Dashboard Overview",
    "/admin/trips": "Trip Management",
    "/admin/bookings": "Booking Management",
    "/admin/users": "User Directory",
    "/admin/payments": "Payments & Revenue",
    "/admin/notifications": "Notifications & Alerts",
    "/admin/settings": "Portal Settings",
  };

  const dynamicTitle =
    title || routeTitles[location.pathname] || "Admin Portal";

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <h1 className="font-sans text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {dynamicTitle}
        </h1>
        <span className="hidden rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 sm:inline-block">
          Live
        </span>
      </div>
      {subtitle && (
        <p className="hidden text-xs text-slate-500 sm:block">{subtitle}</p>
      )}
    </div>
  );
};

// =========================================================================
// MAIN HEADER COMPONENT
// =========================================================================
const Header = ({
  title,
  subtitle,
  user,
  notificationCount = 3,
  onSearch,
  onNotificationClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md transition-all sm:px-6 lg:ml-72 lg:px-8">
      {/* Left: Dynamic Page Title / Breadcrumb */}
      <PageHeading title={title} subtitle={subtitle} />

      {/* Right: Actions (Search, Notifications, Profile) */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search Field */}
        <HeaderSearch
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={onSearch}
        />

        {/* Live Site Quick Link for Desktop */}
        <Link
          to="/"
          className="hidden items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 xl:flex"
        >
          <span>Live Site</span>
          <HiOutlineArrowTopRightOnSquare className="text-slate-400" />
        </Link>

        {/* Notification Bell */}
        <NotificationBell
          count={notificationCount}
          onClick={onNotificationClick}
        />

        {/* User Profile Badge & Dropdown */}
        <div className="border-l border-slate-200/80 pl-2.5 sm:pl-3">
          <UserProfileBadge user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
