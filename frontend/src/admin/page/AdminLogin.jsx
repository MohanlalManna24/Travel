import React, { useState, useEffect } from "react";
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
} from "react-icons/hi2";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin, isAuthenticated, isLoading, error, clearError, checkAdminAuth } =
    useAdminAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /admin/dashboard
  useEffect(() => {
    checkAdminAuth().then((res) => {
      if (res.success) {
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, { replace: true });
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!username.trim() || !password.trim()) {
      setFormError("Please enter both username/email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await loginAdmin({
      username: username.trim(),
      password: password.trim(),
    });
    setIsSubmitting(false);

    if (result.success) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } else {
      setFormError(result.message || "Invalid credentials. Access denied.");
    }
  };

  // Quick fill helper for college presentation & testing
  const handleQuickFill = () => {
    setUsername("admin");
    setPassword("admin@ghureashi2026");
    setFormError("");
    clearError();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4 sm:p-6 lg:p-8 selection:bg-cyan-500 selection:text-white">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Floating Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-inner backdrop-blur-md">
            <HiOutlineShieldCheck className="text-sm text-cyan-400" />
            <span>Master Control Portal</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Card Body */}
        <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-800/60 p-2.5 shadow-lg shadow-cyan-950/40">
              <img
                src={logo}
                alt="Ghure Ashi Logo"
                className="h-full w-full object-contain"
              />
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                <HiOutlineSparkles />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Admin Access
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
              Please authenticate with your master credentials.
            </p>
          </div>

          {/* Error Alert Box */}
          {(formError || error) && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs font-medium text-rose-200 backdrop-blur-sm animate-shake">
              <HiOutlineExclamationCircle className="shrink-0 text-base text-rose-400" />
              <span>{formError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Username / Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Admin Username or Email
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="admin or admin@travel.com"
                  autoComplete="username"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pr-4 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Master Password
                </label>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pr-11 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-200 focus:border-cyan-500 focus:bg-slate-950 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="text-base" />
                  ) : (
                    <HiOutlineEye className="text-base" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleQuickFill}
                className="group inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/40 px-2.5 py-1 text-[11px] font-medium text-slate-400 transition-all duration-200 hover:border-cyan-500/40 hover:bg-cyan-950/30 hover:text-cyan-300"
              >
                <HiOutlineSparkles className="text-cyan-400 transition-transform group-hover:rotate-12" />
                <span>Fill Demo Credentials</span>
              </button>
              <span className="text-[11px] text-slate-500">.env Secured</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="group mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <HiOutlineArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition-colors duration-200 hover:text-cyan-400"
            >
              <HiOutlineHome className="text-sm" />
              <span>Return to Ghure Ashi Public Site</span>
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <p className="mt-4 text-center text-[11px] text-slate-400">
          Protected by Master JWT Signature & HTTP-Only Encrypted Sessions.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
