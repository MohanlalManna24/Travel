import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdminAuthStore } from "../../zustand/adminAuthStore";
import logo from "../../assets/icons/logo.png";
import {
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
  HiOutlineHome,
  HiOutlineKey,
  HiOutlineCheckCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loginAdmin,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    checkAdminAuth,
  } = useAdminAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // Mouse spotlight tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Check existing session
  useEffect(() => {
    checkAdminAuth().then((res) => {
      if (res.success) {
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isSuccess) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isSuccess]);

  // Track cursor position for interactive dynamic lighting
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Detect Caps Lock state
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!username.trim() || !password.trim()) {
      setFormError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await loginAdmin({
      username: username.trim(),
      password: password.trim(),
    });

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      }, 1200);
    } else {
      setIsSubmitting(false);
      setFormError(result.message || "Invalid credentials. Access denied.");
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-6 lg:p-8 selection:bg-cyan-500 selection:text-white"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-40 transition-opacity duration-300 sm:opacity-60"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(14, 165, 233, 0.15), transparent 70%)`,
        }}
      />

      {/* Ambient Pulsing Glow Orbs */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none animate-pulse [animation-delay:2s]" />

      {/* Interactive Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card Body with Glassmorphism & Interactive Border Glow */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-cyan-950/50">
          {/* Subtle Top Gradient Accent Line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />

          {/* Success State Overlay Animation */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-90 duration-300">
              <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 shadow-2xl shadow-emerald-950/60">
                <HiOutlineCheckCircle className="text-5xl animate-bounce" />
                <div className="absolute -inset-2 rounded-3xl border border-emerald-500/20 animate-ping opacity-30" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Access Granted!
              </h2>
              <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                Session authenticated. Launching workspace...
              </p>
              <div className="mt-6 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
              </div>
            </div>
          ) : (
            <>
              {/* Header & Logo */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-800/80 p-2.5 shadow-xl shadow-cyan-950/50 transition-transform duration-300 hover:rotate-3 hover:scale-105">
                  <img
                    src={logo}
                    alt="Ghure Ashi Logo"
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 shadow-xs">
                    <HiOutlineSparkles />
                  </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Admin Portal
                </h1>
                <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                  Sign in with authorized master credentials.
                </p>
              </div>

              {/* Error Alert Box with Animation */}
              {(formError || error) && (
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs font-medium text-rose-200 backdrop-blur-sm animate-shake">
                  <div className="flex items-center gap-2.5">
                    <HiOutlineExclamationCircle className="shrink-0 text-lg text-rose-400" />
                    <span>{formError || error}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      clearError();
                    }}
                    className="text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                  >
                    <HiOutlineXMark className="text-base" />
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Username / ID
                  </label>
                  <div className="relative group/input">
                    <HiOutlineUser className="absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-slate-500 transition-colors duration-200 group-focus-within/input:text-cyan-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (formError) setFormError("");
                      }}
                      placeholder="Enter valid username"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pr-10 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                    {username && (
                      <button
                        type="button"
                        onClick={() => setUsername("")}
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <HiOutlineXMark className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    {isCapsLockOn && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 animate-pulse">
                        <HiOutlineKey /> CAPS LOCK IS ON
                      </span>
                    )}
                  </div>
                  <div className="relative group/input">
                    <HiOutlineLockClosed className="absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-slate-500 transition-colors duration-200 group-focus-within/input:text-cyan-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyDown}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (formError) setFormError("");
                      }}
                      placeholder="Enter valid password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-2.5 pr-11 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-cyan-300 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <HiOutlineEyeSlash className="text-base" />
                      ) : (
                        <HiOutlineEye className="text-base" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="group relative mt-3 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="absolute inset-0 bg-white/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin</span>
                      <HiOutlineArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Back Link */}
              <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
                <Link
                  to="/"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors duration-200 hover:text-cyan-400"
                >
                  <HiOutlineHome className="text-sm transition-transform duration-200 group-hover:-translate-x-0.5" />
                  <span>Return to Public Website</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Security Tagline */}
        <p className="mt-4 text-center text-[11px] text-slate-400 font-medium">
          Protected by Master JWT Signature & Encrypted Session Cookies.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
