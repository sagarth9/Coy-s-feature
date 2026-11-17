"use client";

import React from "react";
import { Compass, Sparkles } from "lucide-react";

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export default function HomePlaceholder({ onGoToDiscover }: HomePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-neutral-950 text-neutral-400 space-y-5">
      <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shadow-inner">
        <Sparkles size={28} />
      </div>

      <div className="space-y-2 max-w-xs">
        <h3 className="text-xl font-bold text-white tracking-tight">Home Tab</h3>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Per assignment instructions, the Home tab is kept blank as a placeholder. The swipe-based discovery feature is implemented in the <span className="text-rose-400 font-semibold">Discover</span> tab.
        </p>
      </div>

      <button
        onClick={onGoToDiscover}
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-medium text-sm transition-all shadow-lg shadow-rose-500/25 flex items-center gap-2 cursor-pointer"
      >
        <Compass size={18} />
        Open Discover Tab
      </button>
    </div>
  );
}
