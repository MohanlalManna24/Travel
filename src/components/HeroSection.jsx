import { FiArrowRight, FiMapPin, FiPlay, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import Layout from "./layout/Layout";
import heroImg from "../assets/images/heroImg.png";

function HeroSection() {
  return (
    <section
      className="relative -mt-19 min-h-screen overflow-hidden bg-slate-950 pt-19 text-white"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,12,27,0.9)_0%,rgba(2,12,27,0.58)_46%,rgba(2,12,27,0.16)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(2,12,27,0.78)_0%,transparent_35%,rgba(2,12,27,0.2)_100%)]" />

      <Layout>
        <div className="relative flex min-h-[calc(100vh-76px)] items-center px-6 py-16 sm:px-10 lg:px-12">
          <div className="max-w-3xl pt-8 lg:pt-0">
            <div className="mb-7 inline-flex animate-pulse items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-100/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-100 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_#67e8f9]" />
              Your next story starts here
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
              Every Trip
              <br />
              <span className="font-serif font-bold italic tracking-wide text-cyan-300">
                tells 
              </span>
              <span> a story</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Find the places that make you feel most alive. Curated journeys,
              local secrets, and unforgettable moments, all in one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/destination"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 shadow-[0_12px_35px_rgba(103,232,249,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_45px_rgba(255,255,255,0.2)]"
              >
                Explore destinations
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <button className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 font-bold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white hover:bg-white/20">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:scale-110">
                  <FiPlay className="ml-0.5 text-xs" />
                </span>
                See the inspiration
              </button>
            </div>

            <div className="mt-12 flex max-w-xl flex-col gap-3 rounded-2xl border border-white/20 bg-slate-950/35 p-3 backdrop-blur-xl sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3 px-3 py-2">
                <FiMapPin className="shrink-0 text-xl text-cyan-300" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Where to?</p>
                  <p className="text-sm font-semibold text-white">Search a destination</p>
                </div>
              </div>
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-slate-950 transition duration-300 hover:bg-cyan-300 sm:w-auto">
                <FiSearch className="transition-transform duration-300 group-hover:scale-110" />
                Find a trip
              </button>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 lg:flex">
            <span className="h-px w-12 bg-white/50" />
            Scroll to wander
          </div>
        </div>
      </Layout>
    </section>
  );
}

export default HeroSection;
