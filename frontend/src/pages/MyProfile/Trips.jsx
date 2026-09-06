import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar, FiPlusCircle } from "react-icons/fi";
import DestinationCards from "../../components/DestinationCards";

const Trips = () => {
  const totalTrips = 24;
  const upcomingTrips = 3;
  const thisYearBookings = 2;

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ef476f]">Trip dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-[#073b4c] sm:text-4xl">Plan and Book Your Next Adventure</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          See your trip summary and quickly jump into booking from one place.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <FiMapPin />
              <p className="text-sm">Total Trips</p>
            </div>
            <h2 className="mt-2 text-3xl font-black text-[#073b4c]">{totalTrips}</h2>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <FiCalendar />
              <p className="text-sm">Upcoming Trips</p>
            </div>
            <h2 className="mt-2 text-3xl font-black text-[#073b4c]">{upcomingTrips}</h2>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-slate-500">
              <FiPlusCircle />
              <p className="text-sm">Booked This Year</p>
            </div>
            <h2 className="mt-2 text-3xl font-black text-[#073b4c]">{thisYearBookings}</h2>
          </article>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/destination"
            className="inline-flex items-center justify-center rounded-xl bg-[#073b4c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f627d]"
          >
            Book a New Trip
          </Link>
          <a
            href="#trip-cards"
            className="inline-flex items-center justify-center rounded-xl border border-[#073b4c]/20 px-5 py-2.5 text-sm font-semibold text-[#073b4c] transition hover:bg-[#073b4c]/5"
          >
            Explore Packages
          </a>
        </div>
      </section>

      <section id="trip-cards" className="mt-8">
        <DestinationCards detailsBasePath="/profile/trips" />
      </section>
    </div>
  );
};

export default Trips;
