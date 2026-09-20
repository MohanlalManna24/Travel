import React, { useState, useEffect, useRef } from "react";
import { FiArrowRight, FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiCompass, FiChevronDown } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import Layout from "./layout/Layout.jsx";
import useAuthStore from "../zustand/authStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, checkAuth } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setIsMenuOpen(false);
    await logout();
    navigate("/");
  };

  const menuItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Destinations", to: "/destination" },
    { name: "Contact", to: "/contact" },
  ];

  const getLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-semibold transition-colors duration-300 ${
      isActive ? "text-cyan-300" : "text-white/80 hover:text-white"
    }`;

  const userAvatar =
    user?.avatar ||
    user?.profile_img ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-white/10 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-6 lg:px-8">
      <Layout>
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <NavLink to="/" className="group flex items-center gap-2.5">
            <img
              src={logo}
              alt="GhureAshi logo"
              className="h-9 w-9 object-contain transition-transform duration-300 group-hover:rotate-6"
            />
            <span className="text-xl font-black tracking-tight text-white">
              Ghure<span className="text-cyan-300 pl-1">Ashi</span>
            </span>
          </NavLink>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${getLinkClass({ isActive })} after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-cyan-300 after:transition-all after:duration-300 ${
                    isActive ? "after:w-full" : "after:w-0 hover:after:w-1/2"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT ACTION BUTTONS / PROFILE */}
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-slate-900/80 py-1.5 pl-1.5 pr-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:border-cyan-300 hover:bg-slate-800 focus:outline-none"
                >
                  <img
                    src={userAvatar}
                    alt={user.fullname || "User"}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-cyan-400/60"
                  />
                  <span className="max-w-[120px] truncate text-xs font-bold text-slate-200">
                    {user.fullname || user.name || "My Account"}
                  </span>
                  <FiChevronDown
                    className={`text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180 text-cyan-300" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl animate-fadeIn">
                    <div className="border-b border-white/10 px-3 py-2.5">
                      <p className="text-xs font-bold text-white truncate">{user.fullname || "Traveler"}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email || "wanderlust@travel.com"}</p>
                    </div>

                    <div className="mt-1 space-y-1">
                      <Link
                        to="/profile?tab=overview"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        <FiCompass className="text-cyan-400 text-sm" /> Overview & Hub
                      </Link>
                      <Link
                        to="/profile?tab=profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        <FiUser className="text-cyan-400 text-sm" /> Personal & Passport
                      </Link>
                      <Link
                        to="/profile?tab=trips"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-cyan-500/10 hover:text-cyan-300"
                      >
                        <FiCalendar className="text-cyan-400 text-sm" /> My Bookings & Tickets
                      </Link>
                    </div>

                    <div className="mt-2 border-t border-white/10 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        <FiLogOut className="text-sm" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth/signin"
                className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                <FiUser className="text-sm" /> Sign In
              </Link>
            )}

            <NavLink
              to="/destination"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-cyan-400/20 transition-all duration-300 hover:opacity-95 hover:shadow-cyan-400/40"
            >
              Book Trip
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </NavLink>
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 text-xl text-white transition hover:border-cyan-300 hover:text-cyan-300 md:hidden"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMenuOpen && (
          <nav className="mt-3 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      isActive ? "bg-cyan-400 text-slate-950 font-bold" : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <div className="mt-2 border-t border-white/10 pt-2">
                {isAuthenticated && user ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl">
                      <img src={userAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-400" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{user.fullname || "Traveler"}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-white/10"
                    >
                      <FiUser /> Profile & Bookings Hub
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-cyan-400 hover:text-slate-950 transition"
                  >
                    <FiUser /> Sign In / Register
                  </Link>
                )}

                <Link
                  to="/destination"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20"
                >
                  Book Trip Now <FiArrowRight />
                </Link>
              </div>
            </div>
          </nav>
        )}
      </Layout>
    </header>
  );
};

export default Navbar;
