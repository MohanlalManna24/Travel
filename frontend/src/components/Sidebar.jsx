import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdAdd, IoIosHelpCircleOutline } from "react-icons/io";
import { PiAirplaneTakeoffLight } from "react-icons/pi";
import { FaHistory } from "react-icons/fa";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiLogoutCircleLine } from "react-icons/ri";
import { BsBoxes } from "react-icons/bs";

const Sidebar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
    fullname: "Traveler",
    email: "",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
    role: "Verified Traveler",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser({
          fullname: parsed.fullname || parsed.name || "Traveler",
          email: parsed.email || "",
          avatar:
            parsed.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop",
          role: parsed.role || "Verified Traveler",
        });
      }
    } catch (e) {
      console.error("Error loading user profile:", e);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
      await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout API notice:", err.message);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isLoggedIn");
      navigate("/auth/signin", { replace: true });
    }
  };

  const sidebarItems = [
    { id: 1, name: "Overview", path: "/profile/overview", icon: <BsBoxes /> },
    {
      id: 2,
      name: "Trips",
      path: "/profile/trips",
      icon: <PiAirplaneTakeoffLight />,
    },
    { id: 3, name: "History", path: "/profile/history", icon: <FaHistory /> },
    {
      id: 4,
      name: "Notification",
      path: "/profile/notifications",
      icon: <IoNotificationsOutline />,
    },
    { id: 5, name: "Profile", path: "/profile/details", icon: <CgProfile /> },
    {
      id: 6,
      name: "Settings",
      path: "/profile/settings",
      icon: <IoSettingsOutline />,
    },
    {
      id: 7,
      name: "Help & Support",
      path: "/profile/help",
      icon: <IoIosHelpCircleOutline />,
    },
  ];

  return (
    <>
      <aside className="fixed inset-x-0 bottom-0 top-auto z-50 h-16 w-full border-t border-[#073b4c]/10 bg-[#f5f3ed] shadow-lg lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:border-t-0 lg:p-6 flex flex-col justify-between">
        <div>
          {/* User Profile Snapshot */}
          <section className="mt-5 hidden items-center gap-3 lg:flex">
            <div className="profileImg w-12 h-12 rounded-full overflow-hidden border-2 border-[#073b4c]/20 ring-2 ring-sky-100 flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullname}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-bold text-slate-900 truncate">
                {currentUser.fullname}
              </h1>
              <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.role}</p>
            </div>
          </section>

          {/* Book Trip Quick Action */}
          <Link to="/destination">
            <button className="mt-5 hidden w-full items-center justify-center gap-2 rounded-xl bg-[#073b4c] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#021f17] hover:text-[#b3e8f9] cursor-pointer transition shadow-xs lg:flex">
              <IoMdAdd className="text-base" /> Book New Trip
            </button>
          </Link>

          {/* Nav Items */}
          <div className="action h-full lg:h-auto mt-4">
            <ul className="flex h-full items-center justify-around gap-1 px-2 lg:block lg:h-auto lg:px-0 lg:space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.id} className="flex-1 lg:flex-none">
                  <NavLink
                    to={item.path}
                    end={item.path === "/profile"}
                    className={({ isActive }) =>
                      `flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition lg:justify-start lg:gap-3 lg:px-3.5 lg:py-2.5 ${
                        isActive
                          ? "bg-[#073b4c] text-white lg:font-bold shadow-xs"
                          : "text-[#073b4c] hover:bg-[#073b4c]/10 hover:text-[#073b4c]"
                      }`
                    }
                  >
                    <span className="text-xl lg:text-lg">{item.icon}</span>
                    <span className="hidden lg:block text-xs">{item.name}</span>
                  </NavLink>
                </li>
              ))}

              {/* Mobile Logout icon */}
              <li className="flex-1 lg:hidden">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center rounded-xl px-3 py-2 text-rose-600 transition hover:bg-rose-50"
                  aria-label="Log out"
                >
                  <span className="text-xl">
                    <RiLogoutCircleLine />
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Logout Button */}
        <section className="hidden w-full lg:block pb-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 border border-rose-500/30 bg-rose-50/50 p-2.5 rounded-xl text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-500 transition cursor-pointer active:scale-95"
          >
            <RiLogoutCircleLine className="text-base" />
            <span>Sign Out Session</span>
          </button>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
