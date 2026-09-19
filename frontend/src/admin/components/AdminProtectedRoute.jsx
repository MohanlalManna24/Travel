import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuthStore } from "../../zustand/adminAuthStore";
import { HiOutlineShieldCheck } from "react-icons/hi2";

const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAdminAuth } = useAdminAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  // Loading Screen while verifying session
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-100">
        {/* Ambient Glow */}
        <div className="absolute h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl filter" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 shadow-xl shadow-cyan-950/50">
            <HiOutlineShieldCheck className="text-3xl text-cyan-400 animate-pulse" />
            <div className="absolute -inset-1 rounded-2xl border border-cyan-400/20 animate-ping opacity-30" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-white">
              Authenticating Admin Gateway
            </h3>
            <p className="text-xs text-slate-400">
              Verifying master session credentials...
            </p>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authorized -> Render admin nested routes
  return <Outlet />;
};

export default AdminProtectedRoute;
