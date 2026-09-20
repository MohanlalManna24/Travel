import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiStar,
  FiHeart,
  FiShield,
  FiCheck,
  FiCompass,
} from "react-icons/fi";
import { FaSuitcaseRolling, FaPlaneDeparture } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "axios";

const DestinationCards = ({
  detailsBasePath = "/destination",
  searchQuery = "",
  categoryFilter = "All",
  limit,
}) => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("travel_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("travel_wishlist", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save wishlist:", e);
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_DESTINATIONS_DETAILS_URL ||
          import.meta.env.VITE_API_BASE_URL ||
          "http://localhost:4000";

        const endpoint = API_URL.includes("/api/") ? API_URL : `${API_URL}/api/destinations`;
        const res = await axios.get(endpoint);
        const data = Array.isArray(res.data) ? res.data : res.data?.destinations || res.data?.data || [];

        if (Array.isArray(data)) {
          const normalized = data.map((d, i) => {
            const rawLocation =
              d.location ||
              [d.state, d.country].filter(Boolean).join(", ") ||
              "Global Sanctuary";
            const price = Number(d.pricePerHead ?? d.price ?? 0);
            return {
              id: d.id || `dest-${i + 1}`,
              name: d.name || d.title || "Curated Destination",
              location: rawLocation,
              category: d.category || "Luxury Escapes",
              badge: d.badge || (i === 0 ? "Featured" : "Bespoke"),
              description:
                d.description ||
                "Immersive handpicked travel experience with 5-star accommodations, private guides, and bespoke itineraries.",
              image:
                d.image ||
                d.heroImage ||
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
              pricePerHead: price,
              originalPrice: price > 0 ? Math.round(price * 1.2) : 0,
              days: Number(d.days || 3),
              rating: Number(d.rating || 5.0),
              reviewsCount: Number(d.reviewsCount || 0),
              inclusions: Array.isArray(d.inclusions) && d.inclusions.length > 0
                ? d.inclusions
                : ["Luxury Accommodation", "Private Concierge", "Curated Excursions"],
            };
          });
          setDestinations(normalized);
        } else {
          setDestinations([]);
        }
      } catch (err) {
        console.error("Error fetching destinations from database:", err.message);
        setDestinations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filtered = destinations.filter((dest) => {
    const matchesSearch =
      !searchQuery.trim() ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      (dest.category || "").toLowerCase().includes(categoryFilter.toLowerCase()) ||
      (categoryFilter === "Beach" && (dest.location.toLowerCase().includes("bali") || dest.location.toLowerCase().includes("greece") || dest.location.toLowerCase().includes("italy"))) ||
      (categoryFilter === "Mountains" && (dest.location.toLowerCase().includes("switz") || dest.location.toLowerCase().includes("alps"))) ||
      (categoryFilter === "City" && (dest.location.toLowerCase().includes("paris") || dest.location.toLowerCase().includes("france") || dest.category.toLowerCase().includes("city"))) ||
      (categoryFilter === "Culture" && (dest.location.toLowerCase().includes("japan") || dest.location.toLowerCase().includes("heritage") || dest.category.toLowerCase().includes("culture")));

    return matchesSearch && matchesCategory;
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-[480px] rounded-3xl bg-slate-900/60 border border-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (displayed.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
        <FaPlaneDeparture className="text-5xl mx-auto text-slate-600 mb-4" />
        <p className="text-lg font-bold text-white">No expeditions found matching &quot;{searchQuery}&quot;</p>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
          Try clearing your search query or selecting another category filter to view our full collection of world destinations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {displayed.map((dest) => {
        const detailsUrl = `${detailsBasePath.replace(/\/$/, "")}/${dest.id}`;
        const isWishlisted = wishlist.includes(dest.id);

        return (
          <article
            key={dest.id}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10"
          >
            {/* CARD TOP IMAGE & BADGES */}
            <div>
              <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
                <img
                  src={dest.image}
                  alt={`Scenic view of ${dest.name} in ${dest.location}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Floating Top Pill / Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-full bg-slate-950/80 border border-cyan-400/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md shadow-lg">
                    {dest.badge || dest.category}
                  </span>
                </div>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  aria-label={isWishlisted ? `Remove ${dest.name} from wishlist` : `Save ${dest.name} to wishlist`}
                  aria-pressed={isWishlisted}
                  onClick={() => toggleWishlist(dest.id)}
                  className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border backdrop-blur-md shadow-lg transition-all transform hover:scale-110 cursor-pointer ${
                    isWishlisted
                      ? "bg-rose-500 border-rose-400 text-white"
                      : "bg-slate-950/70 border-white/20 text-white hover:border-rose-400 hover:text-rose-400"
                  }`}
                >
                  <FiHeart className={`text-sm ${isWishlisted ? "fill-white" : ""}`} />
                </button>

                {/* Duration & Rating Bottom Pills on Image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                    <FiClock className="text-cyan-400 text-xs" />
                    <span>{dest.days} Days / {dest.days - 1} Nights</span>
                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur-md border border-white/10">
                    <FiStar className="fill-amber-300 text-xs" />
                    <span>{dest.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({dest.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* CARD BODY CONTENT */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                  <FiMapPin className="shrink-0" />
                  <span className="truncate">{dest.location}</span>
                </div>

                <h3 className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {dest.name}
                </h3>

                <p className="text-xs leading-relaxed text-slate-300 line-clamp-2">
                  {dest.description}
                </p>

                {/* Classical Inclusions Strip */}
                {dest.inclusions && dest.inclusions.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {dest.inclusions.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300"
                      >
                        <FiCheck className="text-cyan-400 text-[10px]" /> {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CARD BOTTOM PRICING & ACTIONS */}
            <div className="px-6 pb-6 pt-2">
              <div className="my-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Investment</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-white">${dest.pricePerHead.toLocaleString()}</span>
                    {dest.originalPrice && (
                      <span className="text-xs text-slate-500 line-through">${dest.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">per guest • all tax incl.</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-3">
                <Link
                  to={detailsUrl}
                  className="py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-center text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Itinerary <FiArrowRight className="text-xs" />
                </Link>
                <Link
                  to={detailsUrl}
                  className="py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 text-center text-xs font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <FaSuitcaseRolling className="text-xs" /> Book Now
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default DestinationCards;
