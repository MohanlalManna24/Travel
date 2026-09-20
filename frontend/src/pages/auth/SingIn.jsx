import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { HiOutlineExclamationCircle, HiOutlineArrowPath } from "react-icons/hi2";
import travelIllustration from "../../assets/images/img2.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/authStore";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error: storeError, clearError } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (localError) setErrorMessage("");
    if (storeError) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.message || "Invalid credentials. Please try again.");
    }
  };

  const displayError = localError || storeError;

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-8 sm:px-6 lg:px-10 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl lg:grid lg:grid-cols-2">
        {/* Left Hero Image */}
        <div className="relative hidden min-h-[520px] overflow-hidden lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src={travelIllustration}
            alt="Travel inspiration"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute left-8 right-8 top-8 flex items-center justify-between text-xs font-bold tracking-widest text-cyan-300 uppercase">
            <span>GHURE ASHI</span>
            <span className="rounded-full border border-white/30 bg-white/5 px-3 py-1 text-[10px]">
              SECURE ACCESS
            </span>
          </div>
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="mb-2 text-xs font-black tracking-widest text-cyan-400 uppercase">
              The World Awaits
            </p>
            <h2 className="text-3xl font-black leading-tight">
              Begin your next unforgettable expedition.
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              Access live vouchers, booking records, and customized flight itineraries.
            </p>
          </div>
        </div>

        {/* Right Form Section */}
        <section className="px-6 py-10 sm:px-10 sm:py-12 flex flex-col justify-center">
          <div className="mb-6">
            <p className="mb-1 text-xs font-bold tracking-widest text-cyan-400 uppercase">
              Welcome back
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Sign In to Your Account
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter your registered credentials to access your trips and profile.
            </p>
          </div>

          {/* Error Banner */}
          {displayError && (
            <div className="mb-6 rounded-2xl bg-red-950/60 border border-red-500/40 p-4 text-xs text-red-300 flex items-start gap-3 animate-fadeIn">
              <HiOutlineExclamationCircle className="text-lg text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Notice: </span>
                <span>{displayError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Email Address
              <span className="relative mt-1.5 block">
                <IoMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-slate-400" />
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
              </span>
            </label>

            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Password
              <span className="relative mt-1.5 flex items-center">
                <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  name="password"
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>

            <button
              disabled={isLoading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:opacity-95 disabled:opacity-50 mt-2"
              type="submit"
            >
              {isLoading ? (
                <>
                  <HiOutlineArrowPath className="animate-spin text-lg" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <IoIosArrowRoundForward className="text-2xl transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            <span className="h-px flex-1 bg-white/10" />
            <span>Or Quick Login</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:border-cyan-400"
              type="button"
              onClick={() => alert("Google OAuth is enabled for verified cloud domains.")}
            >
              <FcGoogle className="text-lg" /> Google
            </button>
            <button
              className="flex h-11 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:border-cyan-400"
              type="button"
              onClick={() => alert("Facebook SSO is enabled for verified domains.")}
            >
              <FaFacebook className="text-lg text-blue-500" /> Facebook
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an account yet?{" "}
            <Link to="/auth/signup" className="font-bold text-cyan-400 hover:underline">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default SignIn;
