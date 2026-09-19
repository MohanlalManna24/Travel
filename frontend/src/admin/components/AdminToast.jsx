import React from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineXMark,
} from "react-icons/hi2";

/**
 * Enterprise Solid Top-Level Toast Notification Component
 * Styled with solid high-contrast background and z-[99999] so it is NEVER obscured
 * or blurred behind modal backdrop filters.
 */
export const AdminToast = ({ toast, onClose }) => {
  if (!toast) return null;

  const type = toast.type || "success";
  const message = toast.message || toast.text || "";

  const config = {
    error: {
      border: "border-rose-500",
      ring: "ring-2 ring-rose-500/40",
      iconBg: "bg-rose-500/20 text-rose-400",
      icon: <HiOutlineExclamationTriangle className="text-xl" />,
      title: "Action Failed",
    },
    warning: {
      border: "border-amber-500",
      ring: "ring-2 ring-amber-500/40",
      iconBg: "bg-amber-500/20 text-amber-400",
      icon: <HiOutlineExclamationTriangle className="text-xl" />,
      title: "Warning",
    },
    info: {
      border: "border-cyan-500",
      ring: "ring-2 ring-cyan-500/40",
      iconBg: "bg-cyan-500/20 text-cyan-400",
      icon: <HiOutlineInformationCircle className="text-xl" />,
      title: "Information",
    },
    success: {
      border: "border-emerald-500",
      ring: "ring-2 ring-emerald-500/40",
      iconBg: "bg-emerald-500/20 text-emerald-400",
      icon: <HiOutlineCheckCircle className="text-xl" />,
      title: "Success",
    },
  }[type] || {
    border: "border-emerald-500",
    ring: "ring-2 ring-emerald-500/40",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    icon: <HiOutlineCheckCircle className="text-xl" />,
    title: "Success",
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-6 right-6 z-[99999] flex items-start gap-3.5 rounded-2xl bg-slate-900 border ${config.border} ${config.ring} p-4 text-white shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 pointer-events-auto`}
      style={{ minWidth: "300px", maxWidth: "440px" }}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
      >
        {config.icon}
      </div>

      <div className="flex-1 pt-0.5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {config.title}
        </p>
        <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-100 leading-relaxed">
          {message}
        </p>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          aria-label="Close Notification"
        >
          <HiOutlineXMark className="text-lg" />
        </button>
      )}
    </div>
  );
};

/**
 * In-Modal Inline Error Alert Component
 * Displayed directly inside forms when modal is active
 */
export const ModalErrorAlert = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/95 p-3.5 text-rose-900 shadow-sm animate-in fade-in duration-200">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
        <HiOutlineExclamationTriangle className="text-base" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-bold text-rose-950">Action Could Not Complete</p>
        <p className="mt-0.5 text-rose-700 leading-relaxed font-medium">{error}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg p-1 text-rose-400 hover:bg-rose-100 hover:text-rose-700 transition"
        >
          <HiOutlineXMark className="text-base" />
        </button>
      )}
    </div>
  );
};

export default AdminToast;
