import {
  FiArrowRight,
  FiCompass,
  FiHeart,
  FiMapPin,
  FiSearch,
  FiSun,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import DestinationCards from "../components/DestinationCards";
import Layout from "../components/layout/Layout";
import heroImage from "../assets/images/heroImg.png";

function Destination() {
  return (
    <main className="overflow-hidden bg-[#f7fbfa]">
      <section className="relative isolate bg-[#073b4c] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(6,214,160,0.35),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(255,209,102,0.25),transparent_24%)]" />
        <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full border-[28px] border-[#ef476f]/30 sm:h-96 sm:w-96" />
        <Layout>
          <div className="relative grid min-h-[540px] items-center gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#ffd166] backdrop-blur-sm">
                <FiCompass /> Curated escapes
              </div>
              <h1 className="max-w-lg text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Go somewhere that feels like <span className="text-[#06d6a0]">you.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-cyan-50/75 sm:text-lg">
                From sunlit coastlines to electric city nights, discover places
                with the right rhythm for your next unforgettable story.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#destinations"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#ffd166] px-5 py-3 text-sm font-extrabold text-[#073b4c] transition hover:-translate-y-1 hover:bg-white"
                >
                  Explore places
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:border-[#06d6a0] hover:bg-[#06d6a0] hover:text-[#073b4c]"
                >
                  Plan with an expert
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
              <div className="absolute -left-5 top-12 z-10 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#073b4c] shadow-xl sm:-left-10">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#ef476f]/15 text-[#ef476f]"><FiHeart /></span>
                Loved by 2,000+ travelers
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-8 border-white/15 bg-[#118ab2] shadow-2xl shadow-black/25">
                <img src={heroImage} alt="A colorful travel scene" className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#073b4c]/90 to-transparent p-6 pt-24">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffd166]">The world is wide</p>
                  <p className="mt-2 text-2xl font-black">Your next chapter starts here.</p>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-5 grid h-20 w-20 place-items-center rounded-full bg-[#06d6a0] text-center text-xs font-black uppercase leading-4 text-[#073b4c] shadow-xl sm:-right-8">
                Pack<br />light
              </div>
            </div>
          </div>
        </Layout>
      </section>

      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-xl shadow-[#073b4c]/10 sm:grid-cols-3">
          {[
            ["24/7", "Travel support", FiHeart],
            ["40+", "Handpicked places", FiMapPin],
            ["98%", "Happy explorers", FiSun],
          ].map(([value, label, Icon]) => (
            <div key={label} className="flex items-center gap-4 border-b border-slate-100 px-6 py-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-0 sm:px-8">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#06d6a0]/15 text-xl text-[#069c78]"><Icon /></span>
              <div><p className="text-2xl font-black text-[#073b4c]">{value}</p><p className="text-sm text-slate-500">{label}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="destinations" className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <Layout>
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ef476f]">Find your kind of wonderful</p>
              <h2 className="text-4xl font-black tracking-tight text-[#073b4c] sm:text-5xl">Where will you feel most alive?</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Browse our favorite escapes, selected for the moments you will talk about long after you return home.</p>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400 shadow-sm">
              <FiSearch className="text-[#118ab2]" />
              <span>Popular destinations</span>
            </div>
          </div>

          <div className="mb-10 flex flex-wrap gap-3">
            {["All escapes", "Beach days", "City energy", "Slow travel"].map((filter, index) => (
              <button key={filter} type="button" className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${index === 0 ? "bg-[#073b4c] text-white shadow-lg shadow-[#073b4c]/15" : "border border-slate-200 bg-white text-slate-600 hover:border-[#06d6a0] hover:text-[#069c78]"}`}>
                {filter}
              </button>
            ))}
          </div>

          <DestinationCards />
        </Layout>
      </section>

      <section className="bg-[#ffd166] px-6 py-16 sm:px-10 lg:px-12">
        <Layout>
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ef476f]">Make it personal</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#073b4c] sm:text-4xl">Not sure where to begin?</h2>
              <p className="mt-3 text-base leading-7 text-[#073b4c]/70">Tell us what you love, and we will match you with a journey that fits your pace.</p>
            </div>
            <Link to="/contact" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ef476f] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#ef476f]/20 transition hover:-translate-y-1 hover:bg-[#073b4c]">
              Build my trip <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Layout>
      </section>
    </main>
  );
}

export default Destination;
