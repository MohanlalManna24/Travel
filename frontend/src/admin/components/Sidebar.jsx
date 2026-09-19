import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "../../zustand/adminAuthStore";
import {
  HiOutlineSquares2X2,
  HiOutlineTicket,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineBell,
  HiOutlineCog6Tooth,
  HiOutlinePlus,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { PiAirplaneTiltBold } from "react-icons/pi";
import logo from "../../assets/icons/logo.png";

// =========================================================================
// NAVIGATION CONFIGURATION (Single Source of Truth)
// =========================================================================
export const ADMIN_NAV_GROUPS = [
  {
    groupTitle: "MAIN MENU",
    items: [
      {
        id: "dashboard",
        name: "Dashboard Overview",
        shortLabel: "Overview",
        path: "/admin/dashboard",
        altPaths: ["/admin"],
        icon: HiOutlineSquares2X2,
        badge: null,
      },
      {
        id: "trips",
        name: "Trip Management",
        shortLabel: "Trips",
        path: "/admin/trips",
        icon: PiAirplaneTiltBold,
        badge: null,
      },
      {
        id: "bookings",
        name: "Booking Management",
        shortLabel: "Bookings",
        path: "/admin/bookings",
        icon: HiOutlineTicket,
        badge: null,
      },
    ],
  },
  {
    groupTitle: "MANAGEMENT & FINANCE",
    items: [
      {
        id: "users",
        name: "User Management",
        shortLabel: "Users",
        path: "/admin/users",
        icon: HiOutlineUsers,
        badge: null,
      },
      {
        id: "payments",
        name: "Payment & Revenue",
        shortLabel: "Revenue",
        path: "/admin/payments",
        icon: HiOutlineBanknotes,
        badge: null,
      },
    ],
  },
  {
    groupTitle: "SYSTEM & PREFERENCES",
    items: [
      {
        id: "notifications",
        name: "Notifications",
        shortLabel: "Alerts",
        path: "/admin/notifications",
        icon: HiOutlineBell,
        badge: { text: "3", type: "warning" },
      },
      {
        id: "settings",
        name: "Website Settings",
        shortLabel: "Settings",
        path: "/admin/settings",
        icon: HiOutlineCog6Tooth,
        badge: null,
      },
    ],
  },
];

// =========================================================================
// REUSABLE SUB-COMPONENTS
// =========================================================================

/**
 * Reusable Badge for navigation items
 */
const NavBadge = ({ badge }) => {
  if (!badge) return null;

  const typeClasses = {
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    accent: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
  };

  const badgeStyle = typeClasses[badge.type] || typeClasses.neutral;

  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wide transition-transform duration-200 group-hover:scale-105 ${badgeStyle}`}
    >
      {badge.text}
    </span>
  );
};

/**
 * Reusable Desktop Navigation Item
 */
const DesktopNavItem = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <li>
      <NavLink
        to={item.path}
        className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "border-l-3 border-cyan-400 bg-linear-to-r from-cyan-500/20 via-blue-500/10 to-transparent pl-3 font-semibold text-white shadow-xs"
            : "text-slate-400 hover:translate-x-1 hover:bg-slate-900/80 hover:text-slate-100"
        }`}
      >
        {/* Left accent indicator for inactive hover */}
        {!isActive && (
          <span className="absolute top-1/2 left-0 h-0 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400/80 transition-all duration-200 group-hover:h-5" />
        )}

        {/* Icon & Label */}
        <div className="flex items-center gap-4">
          <Icon
            className={`text-lg transition-all duration-300 ${
              isActive
                ? "scale-110 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                : "text-slate-400 group-hover:scale-110 group-hover:text-cyan-300"
            }`}
          />
          <span className="text-sm tracking-wide">{item.name}</span>
        </div>

        {/* Badges & Chevron Arrow */}
        <div className="flex items-center gap-1.5">
          <NavBadge badge={item.badge} />
          <HiOutlineChevronRight
            className={`text-xs transition-all duration-200 ${
              isActive
                ? "translate-x-0 text-cyan-400 opacity-100"
                : "-translate-x-2 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:text-slate-400 group-hover:opacity-100"
            }`}
          />
        </div>
      </NavLink>
    </li>
  );
};

/**
 * Reusable Mobile Bottom Navigation Item
 */
const MobileNavItem = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <li className="flex-1">
      <NavLink
        to={item.path}
        className={`flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-all duration-200 ${
          isActive
            ? "bg-linear-to-b from-cyan-500/20 to-blue-500/10 font-semibold text-cyan-400 ring-1 ring-cyan-500/40"
            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
        }`}
      >
        <Icon
          className={`text-xl transition-transform duration-200 ${
            isActive ? "scale-110 text-cyan-400" : ""
          }`}
        />
        <span className="scale-90 tracking-tight">
          {item.shortLabel || item.name}
        </span>
      </NavLink>
    </li>
  );
};

// =========================================================================
// MAIN SIDEBAR COMPONENT
// =========================================================================
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminAuthStore();

  const handleSignOut = async (e) => {
    e.preventDefault();
    await logoutAdmin();
    navigate("/admin/login");
  };

  // Helper to determine if current route matches item path or altPaths
  const isLinkActive = (path, altPaths = []) => {
    if (location.pathname === path) return true;
    if (altPaths.includes(location.pathname)) return true;
    if (
      path !== "/admin" &&
      path !== "/admin/dashboard" &&
      location.pathname.startsWith(path)
    ) {
      return true;
    }
    return false;
  };

  // Flattened navigation for mobile dock
  const allNavItems = ADMIN_NAV_GROUPS.flatMap((group) => group.items);

  return (
    <>
      {/* =========================================================================
          DESKTOP CLASSICAL ADMIN SIDEBAR
          ========================================================================= */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col justify-between border-r border-slate-800/80 bg-slate-950 text-slate-200 shadow-2xl backdrop-blur-xl lg:flex">
        {/* Subtle decorative background ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Top Header & Brand Section */}
        <div className="relative z-10 flex flex-col px-6 pt-6 pb-2">
          {/* Brand Logo & Portal Tag */}
          <div className="mb-5 flex items-center justify-between">
            <Link
              to="/admin/dashboard"
              className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-cyan-600 via-sky-600 via-yellow-100 to-indigo-600 p-2 shadow-lg shadow-cyan-500/25 ring-1 ring-white/20 transition-all duration-300 group-hover:shadow-cyan-500/40">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
                <span
                  className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center"
                  aria-label="System status: online"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    GHURE ASHI
                  </span>
                  <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-400 border border-cyan-500/30">
                    ADMIN
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">
                  Control Center
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Stats or Environment Badge */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <HiOutlineSquares2X2 className="text-sm" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Admin Session
                </p>
                <p className="text-xs font-bold text-slate-200">
                  Active & Protected
                </p>
              </div>
            </div>
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        </div>

        {/* Middle Scrollable Navigation List (Hidden Scrollbar) */}
        <div className="relative z-10 flex-1 space-y-6 overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 py-4">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.groupTitle} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {group.groupTitle}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <DesktopNavItem
                    key={item.id}
                    item={item}
                    isActive={isLinkActive(item.path, item.altPaths)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer Actions & Logout */}
        <div className="relative z-10 space-y-2 border-t border-slate-800/80 bg-slate-950/90 p-4">
          {/* Logout Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-950/20 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-900/30 hover:text-rose-200 hover:shadow-lg hover:shadow-rose-950/40 active:scale-[0.98]"
          >
            <HiOutlineArrowLeftOnRectangle className="text-base transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Sign Out Session</span>
          </button>

          {/* Status & Version Footer */}
          <div className="flex items-center justify-between px-1 pt-1 text-[10px] text-slate-400">
            <span>Ghure Ashi v1.0</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems live
            </span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE RESPONSIVE BOTTOM NAVIGATION DOCK
          ========================================================================= */}
      <nav className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-slate-800/90 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
        <ul className="flex items-center justify-between gap-1">
          {allNavItems.map((item) => (
            <MobileNavItem
              key={item.id}
              item={item}
              isActive={isLinkActive(item.path, item.altPaths)}
            />
          ))}

          {/* Quick Exit to Home on Mobile */}
          <li className="flex-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium text-rose-400 transition-all duration-200 hover:bg-rose-950/30 cursor-pointer"
              title="Sign Out Session"
            >
              <HiOutlineArrowLeftOnRectangle className="text-xl" />
              <span className="scale-90">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
