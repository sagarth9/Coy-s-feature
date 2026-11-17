"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Sparkles, X } from "lucide-react";
import confetti from "canvas-confetti";
import { PublicProfile } from "@/lib/storage";

interface MatchModalProps {
  matchedProfile: PublicProfile | null;
  onClose: () => void;
  onOpenMatches: () => void;
}

export default function MatchModal({
  matchedProfile,
  onClose,
  onOpenMatches,
}: MatchModalProps) {
  useEffect(() => {
    if (matchedProfile) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ec4899", "#f43f5e", "#a855f7", "#fbbf24"],
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 text-white border border-neutral-800 shadow-2xl text-center overflow-hidden"
        >
          {/* Background glowing blobs */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-rose-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Heading */}
          <div className="mt-2 flex items-center justify-center gap-1.5 text-rose-400 font-semibold text-sm tracking-wider uppercase">
            <Sparkles size={16} />
            <span>Mutual Connection</span>
          </div>

          <h2 className="mt-1 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            It&apos;s a Match!
          </h2>

          <p className="mt-2 text-sm text-neutral-300">
            You and <span className="font-semibold text-white">{matchedProfile.name}</span> both liked each other on Coy.
          </p>

          {/* Dual avatar visual */}
          <div className="my-6 flex items-center justify-center -space-x-4">
            <div className="relative z-10 w-24 h-24 rounded-full ring-4 ring-neutral-900 overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
                alt="You"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Pulsing Heart Center badge */}
            <div className="relative z-20 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 ring-4 ring-neutral-900 shadow-lg animate-pulse">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>

            <div className="relative z-10 w-24 h-24 rounded-full ring-4 ring-neutral-900 overflow-hidden shadow-xl">
              <img
                src={matchedProfile.photo}
                alt={matchedProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* College / Location badge */}
          <div className="inline-block px-3 py-1 rounded-full bg-neutral-800/80 text-neutral-300 text-xs mb-6">
            📍 {matchedProfile.location}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                onOpenMatches();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 font-semibold text-white shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle size={18} />
              View Matches &amp; Chat
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 font-medium text-sm transition-colors cursor-pointer"
            >
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
