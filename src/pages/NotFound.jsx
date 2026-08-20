import { FiArrowLeft, FiArrowRight, FiCompass, FiMapPin } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import airplaneImage from "../assets/images/airplane.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="relative isolate min-h-[calc(100vh-10rem)] overflow-hidden bg-[#f4f8f6] text-[#073b4c]">
      <div className="absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#ffd166]/35 blur-3xl" />
      <div className="absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-[#06d6a0]/20 blur-3xl" />

      <div className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-7xl items-center gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-20">
        <section className="max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#073b4c]/10 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#ef476f] shadow-sm backdrop-blur-sm">
            <FiCompass className="text-base" /> Off the map
          </div>
          <p className="font-serif text-[7rem] font-bold leading-[0.75] tracking-[-0.08em] text-[#073b4c] sm:text-[10rem]">
            404
          </p>
          <h1 className="mt-8 max-w-md text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            This route took an unexpected turn.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
            The page you are looking for has wandered somewhere else. Let us
            get you back to a place worth exploring.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 rounded-full bg-[#073b4c] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-[#073b4c]/15 transition hover:-translate-y-1 hover:bg-[#06d6a0] hover:text-[#073b4c]"
            >
              Back to home
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-full border border-[#073b4c]/15 bg-white px-5 py-3.5 text-sm font-bold text-[#073b4c] transition hover:-translate-y-1 hover:border-[#ef476f] hover:text-[#ef476f]"
            >
              <FiArrowLeft /> Go back
            </button>
          </div>

          <div className="mt-10 flex items-center gap-3 border-t border-[#073b4c]/10 pt-5 text-sm text-slate-500">
            <FiMapPin className="text-[#ef476f]" />
            <span>Need a better destination?</span>
            <Link to="/destination" className="font-bold text-[#118ab2] hover:text-[#073b4c]">
              Explore places
            </Link>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2.5rem] border border-white/80 bg-white/40 shadow-2xl shadow-[#073b4c]/10 backdrop-blur-sm sm:-inset-8" />
          <div className="relative overflow-hidden rounded-4xl bg-[#118ab2] p-7 sm:p-10">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-22 border-[#ffd166]/60" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border-28 border-[#06d6a0]/40" />
            <div className="relative flex min-h-80 flex-col justify-between sm:min-h-96">
              <div className="flex items-start justify-between text-white">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-[#ffd166]">Wanderly airlines</p>
                  <p className="mt-2 text-sm text-white/70">Boarding pass: nowhere</p>
                </div>
                <FiCompass className="text-3xl text-[#ffd166]" />
              </div>
              <img
                src={airplaneImage}
                alt="Airplane flying toward a new destination"
                className="relative mx-auto w-[90%] object-contain drop-shadow-2xl transition duration-500 hover:rotate-2 hover:scale-105"
              />
              <div className="relative flex items-end justify-between border-t border-white/20 pt-5 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Departure</p>
                  <p className="mt-1 text-lg font-black">Your next idea</p>
                </div>
                <FiArrowRight className="mb-1 text-2xl text-[#ffd166]" />
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Arrival</p>
                  <p className="mt-1 text-lg font-black">Somewhere lovely</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default NotFound
