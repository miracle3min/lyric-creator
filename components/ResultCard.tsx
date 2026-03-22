"use client";

import { useState } from "react";
import { SongResult, PROVIDER_LABELS, PROVIDER_COLORS } from "@/types";
import { FiCopy, FiCheck, FiMusic, FiCpu, FiTerminal, FiImage } from "react-icons/fi";
import { toast } from "sonner";

interface ResultCardProps {
  result: SongResult;
}

type Tab = "lyrics" | "instruments" | "suno" | "coverArt";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "lyrics", label: "Lyrics", icon: <FiMusic /> },
  { key: "instruments", label: "Instruments", icon: <FiCpu /> },
  { key: "suno", label: "SUNO Prompt", icon: <FiTerminal /> },
  { key: "coverArt", label: "Cover Art", icon: <FiImage /> },
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
    await navigator.clipboard.writeText(content[tab]);
    setCopied(tab);
    toast.success(`${TABS.find((t) => t.key === tab)?.label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const gradientClass = PROVIDER_COLORS[result.provider];

  return (
    <div className="card-glass overflow-hidden">
      {/* Provider header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full bg-gradient-to-r ${gradientClass}`}
          />
          <h3 className="text-lg font-bold text-white">
            {PROVIDER_LABELS[result.provider]}
          </h3>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(result.generatedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-white/5 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-4 text-sm leading-relaxed text-gray-300">
          {content[activeTab]}
        </pre>

        {/* Copy button */}
        <button
          onClick={() => handleCopy(activeTab)}
          className="absolute right-3 top-3 rounded-lg bg-white/10 p-2 text-gray-400 transition-all hover:bg-white/20 hover:text-white"
          title="Copy to clipboard"
        >
          {copied === activeTab ? (
            <FiCheck className="text-green-400" />
          ) : (
            <FiCopy />
          )}
        </button>
      </div>
    </div>
  );
}
