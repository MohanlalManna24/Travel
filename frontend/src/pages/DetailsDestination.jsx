import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiImage,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";

const fallbackDestination = {
  id: "destination-1",
  name: "Parisian Elegance",
  location: "Paris, France",
  duration: "5 Days / 4 Nights",
  description:
    "Experience the pinnacle of French luxury with curated access to Paris's most exclusive cultural, culinary, and historical treasures.",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS-8XeEWA3EoWb2GUYM5ihW5eV5pWQCcdbPl_a8dOjDw&s=10",
  pricePerHead: 3200,
  currency: "$",
  highlights: [
    {
      title: "Luxury Hotel Stay",
      description: "Premium accommodations in the heart of Paris.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Private Louvre Tour",
      description: "Expert-led exploration of masterpieces.",
      image:
        "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Seine Dinner Cruise",
      description: "Gourmet dining with iconic city views.",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Gourmet Workshop",
      description: "Master the art of Parisian macarons.",
      image:
        "https://images.unsplash.com/photo-1558326567-98ae2405596b?auto=format&fit=crop&w=800&q=80",
    },
  ],
  itinerary: [
    {
      day: "Day 1",
      title: "Arrival & Champagne Welcome",
      description:
        "VIP transfer to The Ritz upon arrival. Settle into your luxurious accommodations before joining an exclusive evening welcome dinner featuring a curated champagne tasting.",
    },
    {
      day: "Day 2",
      title: "Art & History",
      description:
        "Embark on a private guided tour of the Louvre before the crowds arrive. In the late afternoon, enjoy a scenic sunset walk through the historic streets of Montmartre.",
    },
    {
      day: "Day 3",
      title: "Culinary Arts",
      description:
        "Begin with a morning pastry class at the prestigious Le Cordon Bleu. Conclude the day with an unforgettable gourmet dinner while cruising along the illuminated Seine.",
    },
    {
      day: "Day 4",
      title: "Versailles Splendor",
      description:
        "A full day excursion to the magnificent Palace of Versailles. Enjoy priority access to the State Apartments and a private, guided stroll through the exclusive royal gardens.",
    },
    {
      day: "Day 5",
      title: "Leisure & Departure",
      description:
        "Spend your final morning indulging in high-end shopping at Galeries Lafayette. Afternoon private transfer to Charles de Gaulle Airport for your onward journey.",
    },
  ],
  gallery: [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
  ],
};

const normalizeDestination = (payload) => {
  const data = payload?.destination || payload?.data || payload;
  if (!data || typeof data !== "object") return fallbackDestination;

  return {
    ...fallbackDestination,
    ...data,
    name: data.name || data.title || fallbackDestination.name,
    location: data.location || data.country || fallbackDestination.location,
    image:
      data.image ||
      data.heroImage ||
      data.coverImage ||
      fallbackDestination.image,
    pricePerHead:
      data.pricePerHead ?? data.price ?? fallbackDestination.pricePerHead,
    highlights: data.highlights?.length
      ? data.highlights
      : fallbackDestination.highlights,
    itinerary: data.itinerary?.length
      ? data.itinerary
      : fallbackDestination.itinerary,
    gallery: data.gallery?.length ? data.gallery : fallbackDestination.gallery,
  };
};

const DetailsDestination = () => {
  const { destinationId = "destination-1" } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(fallbackDestination);
  const [isLoading, setIsLoading] = useState(
    Boolean(import.meta.env.VITE_API_URL),
  );
  const [error, setError] = useState("");
  const [travelerCount, setTravelerCount] = useState(2);
  const [isTravelerMenuOpen, setIsTravelerMenuOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      return () => controller.abort();
    }

    fetch(`${apiUrl.replace(/\/$/, "")}/destinations/${destinationId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load this destination.");
        return response.json();
      })
      .then((payload) => setDestination(normalizeDestination(payload)))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
          setDestination(fallbackDestination);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [destinationId]);

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100vh-10rem)] place-items-center bg-[#fafafa] text-sm font-semibold text-[#073b4c]">
        Loading your experience...
      </div>
    );
  }

  const pricePerPerson = new Intl.NumberFormat("en-US").format(
    destination.pricePerHead,
  );
  const totalPrice = new Intl.NumberFormat("en-US").format(
    destination.pricePerHead * travelerCount,
  );

  return (
    <main className="bg-[#fafafa] text-[#172b2d]">
      {error && (
        <p className="bg-[#fff4d6] px-6 py-2 text-center text-xs font-semibold text-[#76551b]">
          Showing preview data while the destination service is unavailable.
        </p>
      )}
      <section className="relative h-100 overflow-hidden text-white sm:h-120">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/10" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-10 pt-8 sm:px-10 lg:px-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-6 top-8 inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/35 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:border-white/70 hover:bg-white hover:text-[#172b2d] sm:left-10 lg:left-12"
          >
            <FiArrowLeft className="text-base" />
            Back
          </button>
          <div className="mb-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className="rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <FiClock className="mr-1 inline" />{" "}
              {destination.duration || "5 Days / 4 Nights"}
            </span>
            <span className="rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
              <FiMapPin className="mr-1 inline" /> {destination.location}
            </span>
          </div>
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-none sm:text-6xl">
            {destination.name}
          </h1>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-white/90 sm:text-sm">
            {destination.description}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_24rem] lg:px-12 lg:py-16">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#172b2d] sm:text-3xl">
            Experience highlights
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-4">
            {destination.highlights.map((highlight) => (
              <article
                key={highlight.title}
                className="group relative aspect-[1.35] overflow-hidden rounded-lg bg-slate-200 text-white"
              >
                {highlight.image ? (
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <FiImage className="m-auto mt-10" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-serif text-sm font-bold sm:text-base">
                    {highlight.title}
                  </h3>
                  <p className="mt-1 text-[9px] text-white/85 sm:text-[10px]">
                    {highlight.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-xl bg-white p-7 shadow-[0_10px_35px_rgba(23,43,45,0.1)] sm:p-8 lg:mt-15">
          <p className="font-serif text-4xl font-bold tracking-tight text-[#172b2d]">
            {destination.currency || "$"}
            {totalPrice}{" "}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {destination.currency || "$"}{pricePerPerson} per person
          </p>
          <p className="mt-2 text-[11px] text-[#2f9b72]">
            <FiCheckCircle className="mr-1 inline" /> Best Price Guarantee
          </p>
          <div className="my-6 h-px bg-slate-100" />
          <label className="text-xs font-semibold text-[#172b2d]">
            Select Dates
            <div className="mt-2 flex h-12 items-center gap-3 rounded-lg bg-[#f1f4f8] px-4 text-sm font-normal text-slate-600">
              <FiCalendar /> Sep 15 - Sep 19, 2026
            </div>
          </label>
          <div className="relative mt-6 block text-xs font-semibold text-[#172b2d]">
            Travelers
            <div className="relative mt-2">
              <FiUsers className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500" />
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isTravelerMenuOpen}
                onClick={() => setIsTravelerMenuOpen((isOpen) => !isOpen)}
                className={`flex h-12 w-full items-center justify-between rounded-lg bg-[#f1f4f8] px-4 pl-11 text-left text-sm font-normal text-slate-600 outline-none transition hover:bg-[#e9eef4] focus:ring-2 focus:ring-[#c90038]/20 ${isTravelerMenuOpen ? "ring-2 ring-[#c90038]/20" : ""}`}
              >
                <span>
                  {travelerCount} {travelerCount === 1 ? "Person" : "Members"}
                </span>
                <FiChevronDown
                  className={`text-slate-500 transition-transform ${isTravelerMenuOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isTravelerMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Choose number of travelers"
                  className="absolute inset-x-0 top-14 z-30 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_14px_35px_rgba(23,43,45,0.16)]"
                >
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      role="option"
                      aria-selected={travelerCount === count}
                      onClick={() => {
                        setTravelerCount(count);
                        setIsTravelerMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition ${travelerCount === count ? "bg-[#fff0f3] text-[#c90038]" : "text-slate-600 hover:bg-[#f7f9fb] hover:text-[#172b2d]"}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${travelerCount === count ? "bg-[#c90038] text-white" : "bg-[#eef2f5] text-slate-500"}`}>
                          {count}
                        </span>
                        {count === 1 ? "Person" : "Members"}
                      </span>
                      {travelerCount === count && <FiCheckCircle className="text-base" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Link
            to="/contact"
            className="mt-7 flex h-14 items-center justify-center gap-2 rounded-lg bg-[#c90038] px-4 text-xs font-bold text-white shadow-lg shadow-[#c90038]/20 transition hover:bg-[#a9002f]"
          >
            Book this experience <FiArrowRight />
          </Link>
          <p className="mt-4 text-center text-[10px] text-slate-500">
            You won't be charged yet.
          </p>
        </aside>
      </section>

      <section className="border-y border-slate-100 bg-white px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
        <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
          Full itinerary
        </h2>
        <div className="relative mx-auto mt-8 max-w-5xl before:absolute before:bottom-0 before:left-1/2 before:top-0 before:w-px before:bg-slate-200 max-sm:before:left-3">
          {destination.itinerary.map((item, index) => (
            <div
              key={`${item.day}-${item.title}`}
              className={`relative flex pb-6 max-sm:pl-10 ${index % 2 === 0 ? "justify-start pr-[52%] max-sm:pr-0" : "justify-end pl-[52%] max-sm:pl-10"}`}
            >
              <span
                className={`absolute left-1/2 top-10 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white ${index === 0 ? "bg-black" : "bg-[#dbe6ff]"} max-sm:left-3`}
              />
              <article className="w-full rounded-lg bg-white p-6 shadow-[0_5px_20px_rgba(23,43,45,0.06)]">
                <h3 className="font-serif text-sm font-bold">
                  {item.day}: {item.title}
                </h3>
                <p className="mt-3 text-[10px] leading-4 text-slate-500">
                  {item.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
        <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
          Visual journey
        </h2>
        <div className="mt-8 grid h-48 grid-cols-2 gap-1 overflow-hidden rounded-lg sm:h-64 sm:grid-cols-4">
          {destination.gallery.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${destination.name} gallery ${index + 1}`}
              className="h-full w-full object-cover"
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DetailsDestination;
