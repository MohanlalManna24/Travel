import React, { useState } from "react";
import { FiArrowRight, FiMapPin, FiPlay, FiSearch, FiCompass } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./layout/Layout";
import heroImg from "../assets/images/heroImg.png";

function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destination?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/destination");
    }
  };

  return (
    <section
      className="relative -mt-19 min-h-screen overflow-hidden bg-slate-950 pt-19 text-white"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

      <Layout>
        <div className="relative flex min-h-[calc(100vh-76px)] items-center px-4 py-16 sm:px-8 lg:px-12">
          <div className="max-w-3xl pt-8 lg:pt-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-400/10">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              World Class Travel Experiences
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
              Every Trip
              <br />
              <span className="font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                Tells A Story
              </span>
            </h1>
            
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Discover breathtaking destinations, curated private expeditions, and world-class retreats crafted for the modern wanderer.
            </p>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                to="/destination"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-4 font-black text-slate-950 shadow-xl shadow-cyan-400/25 transition-all duration-300 hover:opacity-95 hover:scale-[1.02]"
              >
                Explore Destinations
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40"
              >
                <FiCompass className="text-cyan-300 text-lg group-hover:rotate-45 transition-transform" />
                Why Ghure Ashi
              </Link>
            </div>

            {/* Interactive Destination Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="mt-10 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/15 bg-slate-900/80 p-2.5 backdrop-blur-2xl shadow-2xl sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
                <FiMapPin className="shrink-0 text-xl text-cyan-400" />
                <div className="w-full">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    Where would you like to go?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Switzerland, Bali, Paris, Maldives..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition-all duration-300 hover:bg-white sm:w-auto shadow-md"
              >
                <FiSearch className="transition-transform duration-300 group-hover:scale-110" />
                Find Trips
              </button>
            </form>
          </div>

          <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 lg:flex">
            <span className="h-px w-12 bg-cyan-400/50" />
            Scroll to discover
          </div>
        </div>
      </Layout>
    </section>
  );
}

export default HeroSection;
