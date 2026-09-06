import HeroSection from "../components/HeroSection.jsx";
import WhyChoose from "../components/WhyChoose.jsx";
import TopDestinations from "../components/TopDestinations.jsx";
import Testimonial from "../components/Testimonial.jsx";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <HeroSection />
      <WhyChoose />
      <TopDestinations/>
      <Testimonial />

      <section className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-112">
        <img
          src="https://img.magnific.com/premium-photo/plane-travel-landmark-world-white-background-time-travel-banner-tourism-trip-concept-journey-vacation-vector-illustration-flat-design_1324913-1778.jpg?w=1500"
          alt="Travel"
          className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-slate-950/75 via-slate-950/25 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl px-8 sm:px-12 lg:px-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">
              Make memories that matter
            </p>
            <h2 className="max-w-xl text-3xl font-black leading-tight text-white sm:text-5xl">
              The world is waiting for your next story.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200 sm:text-base">
              Find your perfect escape and turn every journey into an unforgettable experience.
            </p>
            <Link
              to="/destination"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-white"
            >
              Explore destinations
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
