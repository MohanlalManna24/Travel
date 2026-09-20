import React, { useState } from "react";
import {
  FiArrowRight,
  FiCompass,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiSun,
  FiShield,
  FiAward,
  FiStar,
  FiX,
  FiCheckCircle,
  FiSliders,
} from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import DestinationCards from "../components/DestinationCards";
import Layout from "../components/layout/Layout";

function Destination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = [
    { id: "All", label: "All Destinations" },
    { id: "Beach", label: "Tropical Islands & Coasts" },
    { id: "Mountains", label: "Alps & High Summits" },
    { id: "City", label: "Historic Capitals" },
    { id: "Culture", label: "Imperial Heritage" },
  ];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-24 selection:bg-cyan-400 selection:text-slate-950">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      {/* CLASSICAL HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12 border-b border-white/10">
        <Layout>
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-xl shadow-lg shadow-cyan-400/10">
              <FiCompass className="text-cyan-400 text-sm" /> The Grand Collection 2026
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Curated Escapes For The{" "}
              <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                Discerning Traveler
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Step beyond the ordinary. Explore hand-selected private villas, mountain chalets, and historic cultural journeys crafted with uncompromising attention to detail.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
                <span className="text-xl sm:text-2xl font-black text-cyan-300">40+</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Sanctuaries</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">100%</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Verified 5★ Stays</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
                <span className="text-xl sm:text-2xl font-black text-amber-300">24/7</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Private Concierge</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-xl">
                <span className="text-xl sm:text-2xl font-black text-indigo-300">4.98</span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Traveler Rating</p>
              </div>
            </div>
          </div>
        </Layout>
      </section>

      {/* SEARCH AND REFINED FILTER TOOLBAR */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-5">
          {/* Search Input Bar */}
          <div className="relative w-full lg:max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-lg" />
            <input
              type="text"
              placeholder="Search by city, country, or keyword..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-11 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto no-scrollbar pb-1 lg:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-lg shadow-cyan-400/20 scale-[1.02]"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATION CARDS PRESENTATION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DestinationCards
          detailsBasePath="/destination"
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
        />
      </section>

      {/* TAILORED EXPEDITIONS BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/30 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Bespoke Travel Advisory</span>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Looking for a custom private itinerary?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our master travel architects design private air transfers, yacht charters, and VIP backstage access crafted around your exact schedule.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 hover:opacity-95 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            Design Custom Expedition <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Destination;
