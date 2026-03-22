"use client";

import { useState } from "react";
import { SongResult } from "@/types";
import { FiCopy, FiCheck, FiMusic, FiCpu, FiTerminal, FiImage } from "react-icons/fi";
import { toast } from "sonner";

interface ResultCardProps {
  result: SongResult;
}

type Tab = "lyrics" | "instruments" | "suno" | "coverArt";

const TABS: { key: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { key: "lyrics", label: "Lyrics", shortLabel: "Lyrics", icon: <FiMusic /> },
  { key: "instruments", label: "Instruments", shortLabel: "Instr.", icon: <FiCpu /> },
  { key: "suno", label: "SUNO Prompt", shortLabel: "SUNO", icon: <FiTerminal /> },
  { key: "coverArt", label: "Cover Art", shortLabel: "Cover", icon: <FiImage /> },
];

export default function ResultCard({ result }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("lyrics");
  const [copied, setCopied] = useState<Tab | null>(null);

  const content: Record<Tab, string> = {
    lyrics: result.lyrics,
    instruments: result.instruments,
    suno: result.sunoPrompt,
    coverArt: result.coverArtPrompt,
  };

  const handleCopy = async (tab: Tab) => {
    try {
      await navigator.clipboard.writeText(content[tab]);
      setCopied(tab);
      toast.success(`${TABS.find((t) => t.key === tab)?.label} copied!`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleCopyAll = async () => {
    try {
      const allContent = `🎵 ${result.title}\n\n` +
        `━━━ LYRICS ━━━\n${result.lyrics}\n\n` +
        `━━━ INSTRUMENTS ━━━\n${result.instruments}\n\n` +
        `━━━ SUNO PROMPT ━━━\n${result.sunoPrompt}\n\n` +
        `━━━ COVER ART PROMPT ━━━\n${result.coverArtPrompt}`;
      await navigator.clipboard.writeText(allContent);
      toast.success("All content copied!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const isError = content[activeTab]?.startsWith("Error:");

  return (
    <div className="card-glass overflow-hidden">
      {/* Header with generated title */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-brand-400 to-violet-400 sm:h-3 sm:w-3" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-brand-400 sm:text-xs">
              Generated Song
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-gray-400 transition-all hover:bg-white/10 hover:text-white sm:px-3 sm:py-1.5 sm:text-xs"
              title="Copy all content"
            >
              Copy All
            </button>
            <span className="text-[10px] text-gray-500 sm:text-xs">
              {new Date(result.generatedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
        <h3 className="mt-2 text-lg font-bold text-white sm:text-xl md:text-2xl">
          🎵 {result.title}
        </h3>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex gap-0.5 overflow-x-auto rounded-xl bg-white/5 p-1 sm:mb-4 sm:gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium transition-all sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm ${
              activeTab === tab.key
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <pre
          className={`max-h-[300px] overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs leading-relaxed sm:max-h-[400px] sm:p-4 sm:text-sm ${
            isError ? "text-red-400" : "text-gray-300"
          }`}
        >
          {content[activeTab] || "No content available"}
        </pre>

        {/* Copy button */}
        {!isError && content[activeTab] && (
          <button
            onClick={() => handleCopy(activeTab)}
            className="absolute right-2 top-2 rounded-lg bg-white/10 p-1.5 text-gray-400 transition-all hover:bg-white/20 hover:text-white sm:right-3 sm:top-3 sm:p-2"
            title="Copy to clipboard"
          >
            {copied === activeTab ? (
              <FiCheck className="text-green-400" />
            ) : (
              <FiCopy />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
