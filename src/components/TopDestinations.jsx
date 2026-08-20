import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import DestinationCards from "./DestinationCards.jsx";

const TopDestinations = () => {
  return (
    <section className="bg-white px-6 py-20 sm:px-10 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-12 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-600">
              Explore the world
            </p>
            <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Top Destinations
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Discover unforgettable places and plan your next adventure with
              our handpicked travel experiences.
            </p>
          </div>
          <Link
            to="/destination"
            className="group relative z-10 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition hover:text-slate-900"
          >
            View all destinations
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <DestinationCards />
      </div>
    </section>
  );
};

export default TopDestinations;
