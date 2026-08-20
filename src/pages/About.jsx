import {
  FiArrowRight,
  FiCompass,
  FiGlobe,
  FiHeart,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import heroImage from "../assets/images/heroImg.png";

const values = [
  {
    icon: FiCompass,
    title: "Curiosity first",
    text: "We look beyond the obvious so every itinerary has a little more soul.",
    color: "bg-[#06d6a0]/15 text-[#069c78]",
  },
  {
    icon: FiHeart,
    title: "People over plans",
    text: "Thoughtful guidance and real support make the journey feel effortless.",
    color: "bg-[#ef476f]/15 text-[#db315c]",
  },
  {
    icon: FiGlobe,
    title: "Travel with purpose",
    text: "We champion local experiences that leave places and people better.",
    color: "bg-[#ffd166]/30 text-[#b77a00]",
  },
];

const About = () => {
  return (
    <main className="overflow-hidden bg-[#f7fbfa]">
      <section className="relative isolate bg-[#073b4c] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(239,71,111,0.32),transparent_28%),radial-gradient(circle_at_10%_80%,rgba(6,214,160,0.28),transparent_30%)]" />
        <div className="absolute -left-20 top-10 h-40 w-40 rounded-full border-[18px] border-[#ffd166]/30" />
        <Layout>
          <div className="relative grid min-h-[510px] items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-12 lg:py-20">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-[#ffd166]">
                <span className="h-2 w-2 rounded-full bg-[#ef476f]" /> The people behind Travel.
              </p>
              <h1 className="text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                We make the world feel a little <span className="text-[#06d6a0]">closer.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-cyan-50/75 sm:text-lg">
                Travel. began with a simple belief: planning a trip should feel
                as exciting as taking one. Today, we help curious people find
                meaningful places, memorable stays, and more reasons to wander.
              </p>
              <Link
                to="/destination"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#ffd166] px-5 py-3 text-sm font-extrabold text-[#073b4c] transition hover:-translate-y-1 hover:bg-white"
              >
                Meet your next adventure
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
              <div className="absolute -right-4 top-8 z-10 rounded-2xl bg-[#ef476f] px-5 py-4 shadow-xl shadow-[#073b4c]/30 sm:-right-10">
                <p className="text-3xl font-black">8 yrs</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/75">of wander</p>
              </div>
              <div className="aspect-square overflow-hidden rounded-[2rem] border-8 border-white/15 bg-[#118ab2] shadow-2xl shadow-black/25">
                <img src={heroImage} alt="A colorful travel landscape" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[#073b4c] shadow-xl sm:-left-10">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#06d6a0]/15 text-xl text-[#069c78]"><FiStar /></span>
                <div><p className="text-sm font-black">4.9 / 5</p><p className="text-xs text-slate-500">traveler rating</p></div>
              </div>
            </div>
          </div>
        </Layout>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
        <Layout>
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#ef476f]">Our north star</p>
              <h2 className="text-4xl font-black leading-tight tracking-tight text-[#073b4c] sm:text-5xl">Good trips start with good intent.</h2>
              <div className="mt-6 h-1.5 w-20 rounded-full bg-[#06d6a0]" />
            </div>
            <div className="space-y-5 text-base leading-8 text-slate-600">
              <p>We are a small, curious team of destination nerds, thoughtful planners, and lifelong explorers. We know the joy of finding a quiet cafe on a busy street and the relief of having someone helpful when plans change.</p>
              <p>That is the feeling we build into every recommendation. No copy-paste holidays, no rushed checklists. Just honest inspiration and the practical details that help you travel with confidence.</p>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text, color }) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#073b4c]/10">
                <div className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl text-2xl ${color}`}><Icon /></div>
                <h3 className="text-xl font-black text-[#073b4c]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </Layout>
      </section>

      <section className="bg-[#ffd166] px-6 py-16 sm:px-10 lg:px-12">
        <Layout>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ef476f]">A growing community</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-[#073b4c] sm:text-4xl">More than a booking. A better way to go.</h2>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                ["40+", "destinations"],
                ["12k", "happy travelers"],
                ["24/7", "human support"],
              ].map(([value, label]) => (
                <div key={label} className="text-center"><p className="text-3xl font-black text-[#073b4c]">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#073b4c]/60">{label}</p></div>
              ))}
            </div>
          </div>
        </Layout>
      </section>

      <section className="bg-[#073b4c] px-6 py-20 text-white sm:px-10 lg:px-12">
        <Layout>
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-2 text-[#06d6a0]"><FiUsers /><span className="text-xs font-black uppercase tracking-[0.25em]">Travel your way</span></div>
              <h2 className="text-3xl font-black sm:text-4xl">Ready to find your place in the world?</h2>
              <p className="mt-3 leading-7 text-cyan-50/70">Start with a destination, a feeling, or simply a free weekend.</p>
            </div>
            <Link to="/contact" className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#06d6a0] px-6 py-3.5 text-sm font-extrabold text-[#073b4c] transition hover:-translate-y-1 hover:bg-white">
              Talk to our team <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Layout>
      </section>
    </main>
  )
}

export default About
