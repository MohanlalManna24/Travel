import React from "react";
import {
  HiOutlineUsers,
  HiOutlineTicket,
  HiOutlineBanknotes,
  HiOutlineArrowTrendingUp,
  HiOutlineGlobeAmericas,
} from "react-icons/hi2";
import { PiAirplaneTiltBold } from "react-icons/pi";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Bookings",
      value: "1,429",
      change: "+12.5%",
      isPositive: true,
      icon: HiOutlineTicket,
      color: "from-blue-600 to-cyan-500",
    },
    {
      label: "Active Expeditions",
      value: "48 Trips",
      change: "+4 new",
      isPositive: true,
      icon: PiAirplaneTiltBold,
      color: "from-emerald-600 to-teal-500",
    },
    {
      label: "Gross Revenue",
      value: "$184,320",
      change: "+18.2%",
      isPositive: true,
      icon: HiOutlineBanknotes,
      color: "from-amber-600 to-yellow-500",
    },
    {
      label: "Registered Travelers",
      value: "8,924",
      change: "+8.1%",
      isPositive: true,
      icon: HiOutlineUsers,
      color: "from-purple-600 to-indigo-500",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-3">
            <HiOutlineGlobeAmericas className="text-sm" />
            Global Travel Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to Ghure Ashi Travel Center
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Monitor real-time bookings, curate bespoke travel itineraries, and track financial growth across all regions.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {item.label}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-md shadow-slate-900/10 transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-800">
                  {item.value}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                  <HiOutlineArrowTrendingUp />
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
