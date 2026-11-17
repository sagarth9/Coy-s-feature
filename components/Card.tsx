"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, GraduationCap, Info, Heart, X } from "lucide-react";
import { PublicProfile } from "@/lib/storage";

interface CardProps {
  profile: PublicProfile;
  isFront: boolean;
  onSwipe: (action: "like" | "pass") => void;
}

export default function Card({ profile, isFront, onSwipe }: CardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);

  // Rotate card as user drags horizontally
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  // Opacity of "LIKE" and "NOPE" stamps
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -120], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > threshold || velocity > 400) {
      onSwipe("like");
    } else if (offset < -threshold || velocity < -400) {
      onSwipe("pass");
    }
  };

  if (!isFront) {
    // Background card in the deck (visual stack effect)
    return (
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="w-full h-full rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-xl transform scale-[0.95] translate-y-3 opacity-60">
          <img
            src={profile.photo}
            alt={profile.name}
            className="w-full h-full object-cover filter brightness-75"
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag={showDetails ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="absolute inset-0 select-none cursor-grab active:cursor-grabbing touch-none z-10"
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col justify-end">
        {/* Profile Image */}
        <img
          src={profile.photo}
          alt={profile.name}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />

        {/* Top Gradient for subtle contrast */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* LIKE Stamp Overlay (Green) */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-8 left-6 z-30 pointer-events-none border-4 border-emerald-400 bg-emerald-500/20 backdrop-blur-sm rounded-xl px-4 py-1.5 transform -rotate-12"
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-black text-2xl tracking-widest">
            <Heart className="w-6 h-6 fill-emerald-400" />
            <span>LIKE</span>
          </div>
        </motion.div>

        {/* NOPE Stamp Overlay (Red/Rose) */}
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute top-8 right-6 z-30 pointer-events-none border-4 border-rose-500 bg-rose-500/20 backdrop-blur-sm rounded-xl px-4 py-1.5 transform rotate-12"
        >
          <div className="flex items-center gap-1.5 text-rose-500 font-black text-2xl tracking-widest">
            <X className="w-7 h-7 stroke-[3]" />
            <span>NOPE</span>
          </div>
        </motion.div>

        {/* Bottom Dark Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

        {/* Card Content & Details */}
        <div className="relative z-20 p-5 text-white space-y-2.5">
          {/* Name, Age and Info Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2.5">
              <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow">
                {profile.name}
              </h3>
              <span className="text-xl font-medium text-neutral-300">
                {profile.age}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer"
              title="Toggle details"
            >
              <Info size={18} />
            </button>
          </div>

          {/* Location / College */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
            <GraduationCap size={15} className="text-rose-400 shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>

          {/* Short Bio */}
          <p
            className={`text-sm text-neutral-200 leading-snug ${
              showDetails ? "" : "line-clamp-2"
            }`}
          >
            {profile.bio}
          </p>

          {/* Interests Pill Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/10 text-[11px] font-medium text-neutral-200"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
