"use client";

import { Mic } from "lucide-react";

export function Header() {
  return (
    <nav className="flex items-center justify-between px-12 lg:px-24 py-6 max-w-screen-2xl mx-auto sticky top-0 bg-slate-950/80 backdrop-blur-xl z-[100] border-b border-white/5">
      <a href="/" className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-2xl text-white shadow-xl">
          <Mic size={24} />
        </div>
        <span className="text-2xl font-black tracking-tighter text-white">
          VoiceLead
        </span>
      </a>
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider hidden sm:block"
        >
          Home
        </a>
        <a
          href="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20"
        >
          Back to Home
        </a>
      </div>
    </nav>
  );
}
