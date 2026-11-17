"use client";

import React from "react";
import { Home, Compass, Heart } from "lucide-react";

export type TabKey = "home" | "discover" | "matches";

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  matchesCount: number;
}

export default function BottomNav({
  activeTab,
  onSelectTab,
  matchesCount,
}: BottomNavProps) {
  const tabs = [
    {
      id: "home" as TabKey,
      label: "Home",
      icon: Home,
    },
    {
      id: "discover" as TabKey,
      label: "Discover",
      icon: Compass,
    },
    {
      id: "matches" as TabKey,
      label: "Matches",
      icon: Heart,
      badge: matchesCount > 0 ? matchesCount : null,
    },
  ];

  return (
    <nav className="shrink-0 w-full bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800/80 px-4 py-2 select-none z-30">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? "text-rose-500 font-semibold scale-105"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={isActive && tab.id === "matches" ? "fill-rose-500" : ""}
                />
                {tab.badge !== null && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-neutral-900">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
