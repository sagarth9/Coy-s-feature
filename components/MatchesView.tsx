"use client";

import React, { useState } from "react";
import { MatchRecord } from "@/lib/storage";
import { Heart, MessageCircle, Sparkles, Send, ArrowLeft, GraduationCap, Clock } from "lucide-react";

interface MatchesViewProps {
  matches: MatchRecord[];
  onGoToDiscover: () => void;
  isLoading: boolean;
}

export default function MatchesView({
  matches,
  onGoToDiscover,
  isLoading,
}: MatchesViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [messages, setMessages] = useState<{ sender: "me" | "them"; text: string }[]>([
    { sender: "them", text: "Hey! Glad we both matched on Coy 😊" },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { sender: "me", text: inputText.trim() }]);
    const currentInput = inputText;
    setInputText("");

    // Simulate cute reply after 1.5 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "them",
          text: `Haha yes! Love your vibe. Are you free for coffee sometime?`,
        },
      ]);
    }, 1200);
  };

  const formatMatchTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
      if (diffMinutes < 1) return "Just now";
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return "Recently";
    }
  };

  // If chat is open for a selected match
  if (selectedMatch) {
    return (
      <div className="flex flex-col h-full bg-neutral-950 text-white animate-in fade-in duration-200">
        {/* Chat Header */}
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedMatch(null)}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-rose-500/50">
              <img
                src={selectedMatch.profile.photo}
                alt={selectedMatch.profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-sm leading-tight">
                {selectedMatch.profile.name}, {selectedMatch.profile.age}
              </h4>
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <Sparkles size={11} />
                Mutual match on Coy
              </p>
            </div>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-center my-3">
            <span className="text-[11px] text-neutral-400 bg-neutral-900/80 px-3 py-1 rounded-full border border-neutral-800">
              Matched {formatMatchTime(selectedMatch.matchedAt)}
            </span>
          </div>

          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.sender === "me"
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-xs"
                    : "bg-neutral-800 text-neutral-100 rounded-bl-xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${selectedMatch.profile.name}...`}
            className="flex-1 bg-neutral-800 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white cursor-pointer transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-neutral-950 text-white overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span>Mutual Matches</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {matches.length}
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Connections where both of you liked each other
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-20 text-neutral-500 text-sm">
          Loading your matches...
        </div>
      ) : matches.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400">
            <Heart size={28} className="stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-white">No matches yet</h3>
            <p className="text-xs text-neutral-400 max-w-xs">
              When someone you like on Coy also likes you back, your mutual match will appear right here.
            </p>
          </div>
          <button
            onClick={onGoToDiscover}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-rose-500/20"
          >
            Start Swiping in Discover
          </button>
        </div>
      ) : (
        /* Matches List */
        <div className="grid grid-cols-1 gap-3 pb-20">
          {matches.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMatch(item)}
              className="p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-800/80 transition-all flex items-center gap-3.5 cursor-pointer group"
            >
              {/* Avatar with glow */}
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 ring-2 ring-rose-500/30 group-hover:ring-rose-500 transition-all">
                <img
                  src={item.profile.photo}
                  alt={item.profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white truncate">
                    {item.profile.name}, {item.profile.age}
                  </h4>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0">
                    <Clock size={11} />
                    {formatMatchTime(item.matchedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-neutral-400 truncate">
                  <GraduationCap size={13} className="text-rose-400 shrink-0" />
                  <span className="truncate">{item.profile.location}</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-rose-400/90 pt-0.5">
                  <MessageCircle size={13} />
                  <span className="font-medium text-[11px]">Tap to chat</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
