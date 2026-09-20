import React, { useState, useEffect } from "react";
import { FiClock, FiImage, FiTag, FiMapPin, FiArrowRight, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";

const defaultDestinations = [
  {
    id: "destination-1",
    name: "Parisian Elegance & Loire Valley",
    location: "Paris, France",
    category: "City",
    description:
      "Exclusive access to Paris's cultural monuments, private Loire Valley châteaux, and Michelin dining.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    pricePerHead: 3200,
    days: 5,
    rating: 4.9,
  },
  {
    id: "destination-2",
    name: "Swiss Alps & Glacier Express",
    location: "Zermatt & St. Moritz, Switzerland",
    category: "Mountains",
    description:
      "Panoramic luxury trains through snowcapped summits, private chalets, and alpine lake retreats.",
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    pricePerHead: 4100,
    days: 7,
    rating: 5.0,
  },
  {
    id: "destination-3",
    name: "Bali Serenity & Nusa Island",
    location: "Ubud & Seminyak, Indonesia",
    category: "Beach",
    description:
      "Private cliffside infinity pool villas, sacred jungle temples, and bespoke yoga sanctuaries.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    pricePerHead: 1950,
    days: 6,
    rating: 4.8,
  },
  {
    id: "destination-4",
    name: "Kyoto Heritage & Mount Fuji",
    location: "Kyoto & Hakone, Japan",
    category: "Culture",
    description:
      "Historic ryokan stays with private hot springs, tea ceremonies, and bamboo forest walks.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    pricePerHead: 3600,
    days: 8,
    rating: 4.9,
  },
  {
    id: "destination-5",
    name: "Santorini Cliffside Sunsets",
    location: "Oia & Fira, Greece",
    category: "Beach",
    description:
      "Whitewashed cave suites, private Aegean catamaran cruises, and cliffside Mediterranean dining.",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    pricePerHead: 2800,
    days: 5,
    rating: 4.9,
  },
  {
    id: "destination-6",
    name: "Amalfi Coast & Capri Yachting",
    location: "Positano, Italy",
    category: "Luxury",
    description:
      "Boutique lemon grove hotels, private speedboats around Capri's Blue Grotto, and coastal trattorias.",
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    pricePerHead: 3450,
    days: 6,
    rating: 5.0,
  },
];

const DestinationCards = ({
  detailsBasePath = "/destination",
  searchQuery = "",
  categoryFilter = "All",
  limit,
}) => {
  const [destinations, setDestinations] = useState(defaultDestinations);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const API_URL =
          import.meta.env.VITE_DESTINATIONS_DETAILS_URL ||
          import.meta.env.VITE_API_BASE_URL ||
          "http://localhost:4000";

        const endpoint = API_URL.includes("/api/") ? API_URL : `${API_URL}/api/destinations`;
        const res = await axios.get(endpoint);
        const data = Array.isArray(res.data) ? res.data : res.data?.destinations || [];

        if (data.length > 0) {
          // Merge API data with default items if API returned a small set
          const normalized = data.map((d, i) => ({
            id: d.id || `destination-${i + 1}`,
            name: d.name || d.title || "Exotic Destination",
            location: d.location || d.country || "International",
            category: d.category || "Luxury",
            description: d.description || "Curated luxury travel expedition with VIP inclusions.",
            image: d.image || d.heroImage || defaultDestinations[i % defaultDestinations.length].image,
            pricePerHead: Number(d.pricePerHead ?? d.price ?? 2500),
            days: d.days || 5,
            rating: d.rating || 4.9,
          }));
          setDestinations(normalized);
        } else {
          setDestinations(defaultDestinations);
        }
      } catch (err) {
        console.warn("Using default rich destinations:", err.message);
        setDestinations(defaultDestinations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter based on search & category
  const filtered = destinations.filter((dest) => {
    const matchesSearch =
      !searchQuery.trim() ||
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      (dest.category || "").toLowerCase() === categoryFilter.toLowerCase() ||
      (categoryFilter === "Beach" && dest.location.toLowerCase().includes("bali")) ||
      (categoryFilter === "Mountains" && dest.location.toLowerCase().includes("switz"));

    return matchesSearch && matchesCategory;
  });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-96 rounded-3xl bg-slate-800/40 animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (displayed.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-white/10 p-8">
        <p className="text-base font-bold text-white">No destinations found matching &quot;{searchQuery}&quot;</p>
        <p className="text-xs text-slate-400 mt-1">Try clearing filters or searching for another country or city.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {displayed.map((dest) => {
        const detailsUrl = `${detailsBasePath.replace(/\/$/, "")}/${dest.id}`;

        return (
          <article
            key={dest.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md border border-white/10">
                  <FiClock /> {dest.days} Days
                </div>

                <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-black text-amber-300 backdrop-blur-md border border-white/10">
                  <FiStar className="fill-amber-300" /> {dest.rating || "4.9"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <FiMapPin /> {dest.location}
                </p>
                <h3 className="mt-2 text-xl font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {dest.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                  {dest.description}
                </p>
              </div>
            </div>

            {/* Price & Action Footer */}
            <div className="px-6 pb-6 pt-2">
              <div className="my-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-xs text-slate-400">Starting from</span>
                <div className="text-right">
                  <span className="text-xl font-black text-white">${dest.pricePerHead.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">per person</span>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <Link
                  to={detailsUrl}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-center text-xs font-bold text-white transition-all flex items-center justify-center gap-1"
                >
                  Itinerary <FiArrowRight />
                </Link>
                <Link
                  to={detailsUrl}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-95 text-center text-xs font-black text-slate-950 shadow-md shadow-cyan-400/20 transition-all"
                >
                  Book Trip
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
