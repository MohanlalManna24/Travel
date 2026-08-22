import { useState, useEffect } from "react";  
import { FaQuoteLeft, FaStar } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import Layout from "./layout/Layout";

const defaultTestimonials = [
  {
    id: "testimonial-1",
    name: "Maya Thompson",
    role: "Adventure traveller",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlnulzN_oRasL3W8LZ7Qk2ff7GMizsIpmanCisPjP6dA&s=10",
    initials: "MT",
    quote:
      "Travel turned our holiday into a collection of moments we will talk about for years. Every detail felt thoughtful and effortless.",
    rating: 5,
  }
];

const Testimonial = () => {

   const [testimonials, setTestimonials] = useState(defaultTestimonials);

  const TESIMONIAL_URL= import.meta.env.VITE_TESTIMONIAL_URL;
   useEffect(() => {
      const fetchTestimonial = async () => {
        try {
          const response = await fetch(TESIMONIAL_URL);
          const data = await response.json();
          setTestimonials(data);
        } catch (error) {
          console.error("Error fetching testimonials:", error);
        }
      };
      fetchTestimonial();
    }, []); 

  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-20 text-slate-900 sm:px-10 lg:px-12 lg:py-28">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />

      <Layout>
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-cyan-700">
                Stories from the road
              </p>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Loved by travellers.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Real journeys, real memories, and a little inspiration for your
                next escape.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <span className="text-2xl font-black text-slate-900">4.9</span>
              <span className="flex gap-1 text-amber-400" aria-label="4.9 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <FaStar key={index} />
                ))}
              </span>
              <span>from 2,000+ travellers</span>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.id}
                className="group relative flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-900/10"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-cyan-300 text-lg font-black text-slate-950 transition duration-500 group-hover:rotate-6 group-hover:rounded-full">
                    {testimonial.image ? (
                      <img
                        className="h-full w-full object-cover"
                        src={testimonial.image}
                        alt={`${testimonial.name} profile`}
                      />
                    ) : (
                      testimonial.initials
                    )}
                  </div>
                  <FaQuoteLeft className="text-4xl text-cyan-100 transition duration-500 group-hover:scale-110 group-hover:text-cyan-300" />
                </div>

                <div className="mb-5 flex gap-1 text-sm text-amber-300">
                  {Array.from({ length: testimonial.rating }, (_, starIndex) => (
                    <FaStar key={starIndex} />
                  ))}
                </div>
                <blockquote className="flex-1 text-lg font-medium leading-8 text-slate-700">
                  “{testimonial.quote}”
                </blockquote>

                <div className="mt-8 flex items-end justify-between border-t border-slate-200 pt-5">
                  <div>
                    <h3 className="font-extrabold text-slate-900">{testimonial.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                  <span className="text-xs font-bold text-cyan-600/70">0{index + 1}</span>
                </div>
              </article>
            ))}
          </div>

          <button className="group mx-auto mt-10 flex items-center gap-2 text-sm font-bold text-cyan-700 transition hover:text-slate-900">
            Read more traveller stories
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </Layout>
    </section>
  );
};

export default Testimonial;
