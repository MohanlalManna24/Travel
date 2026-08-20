import React from "react";
import { FiClock, FiImage, FiTag } from "react-icons/fi";
import { Link } from "react-router-dom";

const DestinationCards = () => {
  const defaultDestinations = [
    {
      id: "destination-1",
      name: "Paris",
      location: "Paris, France",
      description:
        "Experience Parisian charm, iconic landmarks, beautiful streets, and unforgettable local cuisine.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS-8XeEWA3EoWb2GUYM5ihW5eV5pWQCcdbPl_a8dOjDw&s=10",
      pricePerHead: 39999,
      days: 4,
      detailsUrl: "/destination/destination-1",
      bookingUrl: "/contact",
    },
    {
      id: "destination-2",
      name: "Dubai",
      location: "Dubai, United Arab Emirates",
      description:
        "Discover Dubai's futuristic skyline, golden desert adventures, luxury shopping, and vibrant nightlife.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgVCdmoJTNaY6lKIJsAxKgGNjiOSuHc92AcBz-5ppxyA&s=10",
      pricePerHead: 59899,
      days: 5,
      detailsUrl: "/destination/destination-2",
      bookingUrl: "/contact",
    },
    {
      id: "destination-3",
      name: "Goa",
      location: "Goa, India",
      description:
        "Relax on golden beaches, explore Portuguese heritage, and enjoy Goa's lively coastal atmosphere.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpeeEsr1YK_qI9o5Xp3LNcls6fX_7BKdcnN4CDtVl9LQ&s=10",
      pricePerHead: 14999,
      days: 4,
      detailsUrl: "/destination/destination-3",
      bookingUrl: "/contact",
    },
  ];
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {defaultDestinations.map((destination) => {
          const {
            id,
            name,
            location,
            description,
            image,
            pricePerHead,
            days,
            detailsUrl = "/destination",
            bookingUrl = "/contact",
          } = destination;

          return (
            <article
              key={id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-900/10"
            >
              <div className="relative flex aspect-16/10 items-center justify-center overflow-hidden bg-slate-200">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FiImage className="text-4xl" />
                    <span className="text-xs font-semibold uppercase tracking-widest">
                      Image coming soon
                    </span>
                  </div>
                )}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-sm">
                  <FiClock className="text-cyan-600" />
                  {days} {days === 1 ? "Day" : "Days"}
                </div>
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-600">
                  {location}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {name}
                </h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                  {description}
                </p>

                <div className="my-5 flex items-center justify-between border-y border-slate-200 py-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FiTag className="text-cyan-600" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Price per head
                    </span>
                  </div>
                  <strong className="text-lg font-black text-slate-900">
                    {pricePerHead > 0 ? `₹${pricePerHead}` : "price"}
                  </strong>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={detailsUrl}
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-700"
                  >
                    See details
                  </Link>
                  <Link
                    to={bookingUrl}
                    className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-cyan-600"
                  >
                    Book now
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default DestinationCards;
