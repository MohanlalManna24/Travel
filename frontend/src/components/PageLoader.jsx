import React from "react";

const PageLoader = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-4 text-cyan-400"
    >
      <div className="relative flex items-center justify-center">
        <div className="h-14 w-14 rounded-full border-2 border-cyan-500/20 animate-ping absolute" />
        <div className="h-12 w-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
        Loading Experience...
      </span>
    </div>
  );
};

export default PageLoader;
