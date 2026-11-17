"use client";

import React from "react";
import { X, Heart, RotateCcw, Info } from "lucide-react";

interface DesktopControlsProps {
  onSwipe: (action: "like" | "pass") => void;
  onReset: () => void;
  onToggleInfo?: () => void;
  disabled?: boolean;
}

export default function DesktopControls({
  onSwipe,
  onReset,
  onToggleInfo,
  disabled = false,
}: DesktopControlsProps) {
  return (
    <div className="flex items-center justify-center gap-5 pt-3 pb-2 select-none">
      {/* Reset Deck Button */}
      <button
        type="button"
        onClick={onReset}
        disabled={disabled}
        title="Reset Demo Deck"
        className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-neutral-800/80 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40"
      >
        <RotateCcw size={18} />
      </button>

      {/* Pass / Dislike Button */}
      <button
        type="button"
        onClick={() => onSwipe("pass")}
        disabled={disabled}
        title="Pass (Swipe Left)"
        className="p-5 rounded-full bg-neutral-900 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 active:scale-90 transition-all shadow-lg shadow-rose-950/40 cursor-pointer disabled:opacity-40 group"
      >
        <X size={26} className="stroke-[2.5] transition-transform group-hover:scale-110" />
      </button>

      {/* Like Button */}
      <button
        type="button"
        onClick={() => onSwipe("like")}
        disabled={disabled}
        title="Like (Swipe Right)"
        className="p-5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white active:scale-90 transition-all shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:brightness-110 cursor-pointer disabled:opacity-40 group"
      >
        <Heart size={26} className="fill-white transition-transform group-hover:scale-110" />
      </button>

      {/* Info Button */}
      {onToggleInfo && (
        <button
          type="button"
          onClick={onToggleInfo}
          disabled={disabled}
          title="Profile Details"
          className="p-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-sky-400 hover:border-sky-500/40 hover:bg-neutral-800/80 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40"
        >
          <Info size={18} />
        </button>
      )}
    </div>
  );
}
