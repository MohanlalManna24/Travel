import React from "react";
import { FiArrowRight, FiCompass } from "react-icons/fi";
import { Link } from "react-router-dom";
import DestinationCards from "./DestinationCards.jsx";

const TopDestinations = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-slate-100 sm:px-6 lg:px-8 lg:py-28">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="relative mb-12 flex flex-col gap-6 sm:mb-16 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
              <FiCompass className="text-sm" /> Handpicked Expeditions
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Featured <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">World Escapes</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Step into curated global sanctuaries, private alpine chalets, and historic Mediterranean coastlines crafted for the discerning traveler.
            </p>
          </div>

          <Link
            to="/destination"
            className="group inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-slate-900/80 px-6 py-3 text-xs font-black uppercase tracking-wider text-cyan-300 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-cyan-400/20 shrink-0"
          >
            Explore All 40+ Destinations
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Top 3 Cards Grid */}
        <DestinationCards limit={3} />
      </div>
    </section>
  );
};

export default TopDestinations;
