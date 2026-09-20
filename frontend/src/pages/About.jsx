import React from "react";
import {
  FiArrowRight,
  FiCompass,
  FiGlobe,
  FiHeart,
  FiStar,
  FiUsers,
  FiAward,
  FiShield,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import img from "../assets/images/3d-travel-with-airplane.jpg";

const values = [
  {
    icon: FiCompass,
    title: "Curiosity First",
    text: "We explore beyond conventional tourist routes so every itinerary delivers authentic cultural soul.",
    color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  },
  {
    icon: FiHeart,
    title: "Dedicated Human Touch",
    text: "24/7 personal concierge support and thoughtful guidance from trip planning to return.",
    color: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  },
  {
    icon: FiGlobe,
    title: "Sustainable & Conscious",
    text: "We champion boutique eco-resorts and local guides that leave places and communities thriving.",
    color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  },
];

const About = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden pb-20">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-12">
        <Layout>
          <div className="grid min-h-[480px] items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300">
                <FiAward /> The Story Behind Ghure Ashi
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                We make the world feel a little{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
                  closer.
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Ghure Ashi began with a simple vision: planning an international journey should feel just as inspiring and effortless as arriving. Today, we craft world-class luxury experiences for curious travelers globally.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/destination"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-cyan-400/20 hover:opacity-95 transition-all"
                >
                  Explore Destinations <FiArrowRight />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-all"
                >
                  Speak With Concierge
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl">
                <img src={img} alt="Travel visualization" className="h-full w-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>

              {/* Floating Stat Badge 1 */}
              <div className="absolute -top-4 -right-4 rounded-2xl border border-cyan-400/40 bg-slate-900/90 p-4 backdrop-blur-xl shadow-xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-400 text-slate-950 font-black">
                  <FiAward className="text-xl" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">8+ Years</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Excellence</p>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-white/10 bg-slate-900/90 p-4 backdrop-blur-xl shadow-xl flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black">
                  <FiStar className="text-xl fill-slate-950" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">4.9 / 5.0</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">12,000+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </section>

      {/* CORE VALUES */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Our Core Philosophy</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Exceptional journeys start with mindful intentions.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text, color }) => (
            <article
              key={title}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl shadow-xl space-y-4 hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`grid h-14 w-14 place-items-center rounded-2xl ${color}`}>
                <Icon className="text-2xl" />
              </div>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* GLOBAL STATS STRIP */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-cyan-300">40+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">World Destinations</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">12,500+</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Delighted Travelers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-amber-300">99.4%</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Satisfaction Rate</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-blue-400">24/7</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">VIP Global Support</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
