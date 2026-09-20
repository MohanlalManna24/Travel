import React, { useState } from "react";
import {
  FiArrowRight,
  FiCompass,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiSun,
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
    { id: "All", label: "All Escapes" },
    { id: "Beach", label: "Tropical & Islands" },
    { id: "Mountains", label: "Alps & Summits" },
    { id: "City", label: "Iconic Capitals" },
    { id: "Culture", label: "Heritage & Culture" },
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12">
        <Layout>
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
              <FiCompass /> Curated International Expeditions
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Go somewhere that feels like{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                magic.
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
              From sun-drenched Mediterranean coastlines to high-altitude Alpine chalets, discover handpicked travel packages designed for life-changing moments.
            </p>
          </div>
        </Layout>
      </section>

      {/* SEARCH AND CATEGORY FILTER SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-lg" />
            <input
              type="text"
              placeholder="Search destination, city, or country..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? "bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-400/20"
                    : "bg-white/5 border border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATION CARDS GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DestinationCards
          detailsBasePath="/destination"
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
        />
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 p-8 sm:p-10 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Custom Itineraries</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Can&apos;t find your exact dream trip?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our travel artisans build personalized bespoke journeys tailored to your timeline, group size, and budget.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-400/20 hover:bg-white transition-all flex items-center gap-2"
          >
            Request Custom Trip <FiArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Destination;
