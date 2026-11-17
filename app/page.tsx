"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PublicProfile, MatchRecord } from "@/lib/storage";
import Card from "@/components/Card";
import DesktopControls from "@/components/DesktopControls";
import MatchModal from "@/components/MatchModal";
import MatchesView from "@/components/MatchesView";
import HomePlaceholder from "@/components/HomePlaceholder";
import BottomNav, { TabKey } from "@/components/BottomNav";
import { Sparkles, RotateCcw, Heart, ShieldCheck, Flame } from "lucide-react";

export default function CoyApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<PublicProfile | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<"like" | "pass" | null>(null);

  // Fetch feed profiles from GET /feed
  const fetchFeed = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/feed");
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch matches from GET /matches
  const fetchMatchesList = useCallback(async () => {
    try {
      const res = await fetch("/matches");
      const data = await res.json();
      if (data.success && Array.isArray(data.matches)) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    fetchMatchesList();
  }, [fetchFeed, fetchMatchesList]);

  // Handle Swipe (Like / Pass)
  const handleSwipe = async (action: "like" | "pass") => {
    if (profiles.length === 0 || isSwiping) return;

    const currentProfile = profiles[0];
    setIsSwiping(true);
    setSwipeDirection(action);

    // Optimistically update card stack after animation duration
    setTimeout(() => {
      setProfiles((prev) => prev.slice(1));
      setSwipeDirection(null);
      setIsSwiping(false);
    }, 280);

    // Record swipe via backend API POST /swipe
    try {
      const res = await fetch("/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: currentProfile.id,
          action,
        }),
      });

      const data = await res.json();

      if (data.success && data.matched && data.profile) {
        // Trigger "It's a Match!" celebration screen
        setMatchedProfile(data.profile);
        fetchMatchesList();
      }
    } catch (error) {
      console.error("Failed to record swipe:", error);
    }
  };

  // Reset Demo Deck (POST /reset)
  const handleResetDemo = async () => {
    if (confirm("Reset demo deck and matches? This will restore all 30+ profiles.")) {
      try {
        setIsLoading(true);
        await fetch("/reset", { method: "POST" });
        await fetchFeed();
        await fetchMatchesList();
      } catch (err) {
        console.error("Error resetting demo:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex items-center justify-center sm:p-4 select-none">
      {/* Mobile-First Shell Container */}
      <div className="relative w-full sm:max-w-md h-screen sm:h-[844px] bg-neutral-950 sm:rounded-[40px] border-0 sm:border sm:border-neutral-800 shadow-2xl flex flex-col overflow-hidden sm:ring-8 sm:ring-neutral-900/40">
        
        {/* Top Header / Brand Bar */}
        <header className="shrink-0 px-5 pt-4 pb-3 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 z-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white">coy</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDemo}
              title="Reset Demo (30 profiles)"
              className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <RotateCcw size={15} />
            </button>
            <div
              title="Double-Blind Privacy Enabled"
              className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full"
            >
              <ShieldCheck size={13} />
              <span>Private</span>
            </div>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {activeTab === "home" && (
            <HomePlaceholder onGoToDiscover={() => setActiveTab("discover")} />
          )}

          {activeTab === "matches" && (
            <MatchesView
              matches={matches}
              onGoToDiscover={() => setActiveTab("discover")}
              isLoading={isLoading}
            />
          )}

          {activeTab === "discover" && (
            <div className="flex-1 flex flex-col justify-between p-4 relative overflow-hidden">
              {/* Card Deck Area */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-3 text-neutral-400">
                    <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs">Finding people nearby...</span>
                  </div>
                ) : profiles.length === 0 ? (
                  /* Empty State when all 30+ profiles are swiped */
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-5 my-auto animate-in fade-in duration-300">
                    <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 shadow-xl">
                      <Flame size={36} />
                    </div>

                    <div className="space-y-1.5 max-w-xs">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        You&apos;re All Caught Up!
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        You have swiped through all available profiles in this cohort. Check your mutual matches or reset the demo deck to test again.
                      </p>
                    </div>

                    <div className="space-y-2 w-full max-w-xs pt-2">
                      <button
                        onClick={() => setActiveTab("matches")}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:brightness-110 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Heart size={16} className="fill-white" />
                        <span>View Mutual Matches ({matches.length})</span>
                      </button>

                      <button
                        onClick={handleResetDemo}
                        className="w-full py-2.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        <span>Reset Demo Profiles</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Active Swiping Deck */
                  <div className="relative w-full h-full max-h-[580px]">
                    {/* Render up to 2 cards for smooth performance & 3D stack effect */}
                    {profiles.slice(0, 2).map((profile, index) => {
                      const isFront = index === 0;

                      return (
                        <AnimatePresence key={profile.id}>
                          <motion.div
                            className="absolute inset-0"
                            animate={
                              isFront && swipeDirection
                                ? {
                                    x: swipeDirection === "like" ? 450 : -450,
                                    opacity: 0,
                                    rotate: swipeDirection === "like" ? 22 : -22,
                                  }
                                : { x: 0, opacity: 1 }
                            }
                            transition={{ duration: 0.28, ease: "easeOut" }}
                          >
                            <Card
                              profile={profile}
                              isFront={isFront}
                              onSwipe={handleSwipe}
                            />
                          </motion.div>
                        </AnimatePresence>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Desktop / Touch Action Buttons */}
              {profiles.length > 0 && !isLoading && (
                <DesktopControls
                  onSwipe={handleSwipe}
                  onReset={handleResetDemo}
                  disabled={isSwiping}
                />
              )}
            </div>
          )}
        </div>

        {/* Bottom Tab Navigation */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          matchesCount={matches.length}
        />

        {/* "It's a Match!" Celebration Modal */}
        <MatchModal
          matchedProfile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onOpenMatches={() => {
            setMatchedProfile(null);
            setActiveTab("matches");
          }}
        />
      </div>
    </main>
  );
}
