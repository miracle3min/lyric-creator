"use client";

import { useState } from "react";
import { SongResult } from "@/types";
import { FiCopy, FiCheck, FiMusic, FiTerminal, FiImage, FiDownload, FiLoader, FiRefreshCw } from "react-icons/fi";
import { toast } from "sonner";

interface ResultCardProps {
  result: SongResult;
}

type Tab = "lyrics" | "suno" | "coverArt";

const TABS: { key: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
  { key: "lyrics", label: "Lyrics", shortLabel: "Lyrics", icon: <FiMusic /> },
  { key: "suno", label: "SUNO Prompt", shortLabel: "SUNO", icon: <FiTerminal /> },
  { key: "coverArt", label: "Cover Art", shortLabel: "Cover", icon: <FiImage /> },
];

export default function ResultCard({ result }: ResultCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("lyrics");
  const [copied, setCopied] = useState<Tab | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const content: Record<Tab, string> = {
    lyrics: result.lyrics,
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
        `━━━ SUNO PROMPT ━━━\n${result.sunoPrompt}\n\n` +
        `━━━ COVER ART PROMPT ━━━\n${result.coverArtPrompt}`;
      await navigator.clipboard.writeText(allContent);
      toast.success("All content copied!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    setImageError(false);
    const prompt = encodeURIComponent(result.coverArtPrompt);
    const seed = Math.floor(Math.random() * 100000);
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
    setGeneratedImage(imageUrl);
  };

  const handleImageLoad = () => {
    setIsGeneratingImage(false);
    toast.success("Cover art generated! 🎨");
  };

  const handleImageError = () => {
    setIsGeneratingImage(false);
    setImageError(true);
    toast.error("Failed to generate image. Try again!");
  };

  const handleDownloadImage = async () => {
    if (!generatedImage) return;
    try {
      toast.info("Downloading image...");
      const res = await fetch(generatedImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.title.replace(/[^a-zA-Z0-9]/g, "_")}_cover.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
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
        {/* Cover Art Tab - Special Layout */}
        {activeTab === "coverArt" ? (
          <div className="space-y-4">
            {/* Prompt text */}
            <div className="relative">
              <pre className="max-h-[200px] overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs leading-relaxed text-gray-300 sm:p-4 sm:text-sm">
                {content.coverArt || "No content available"}
              </pre>
              {content.coverArt && (
                <button
                  onClick={() => handleCopy("coverArt")}
                  className="absolute right-2 top-2 rounded-lg bg-white/10 p-1.5 text-gray-400 transition-all hover:bg-white/20 hover:text-white sm:right-3 sm:top-3 sm:p-2"
                  title="Copy to clipboard"
                >
                  {copied === "coverArt" ? (
                    <FiCheck className="text-green-400" />
                  ) : (
                    <FiCopy />
                  )}
                </button>
              )}
            </div>

            {/* Generate Image Button */}
            {!generatedImage && !isGeneratingImage && (
              <button
                onClick={handleGenerateImage}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-violet-600 hover:shadow-lg hover:shadow-brand-500/25 sm:text-base"
              >
                <FiImage />
                Generate Cover Art with AI
              </button>
            )}

            {/* Loading State */}
            {isGeneratingImage && !imageError && (
              <div className="flex flex-col items-center justify-center rounded-xl bg-black/30 p-8">
                <div className="relative mb-4">
                  <div className="h-16 w-16 rounded-full border-2 border-brand-500/30" />
                  <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                  <FiImage className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-brand-400" />
                </div>
                <p className="text-sm text-gray-400">Generating your cover art...</p>
                <p className="mt-1 text-xs text-gray-500">This may take 10-30 seconds</p>
              </div>
            )}

            {/* Generated Image */}
            {generatedImage && (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-xl bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedImage}
                    alt={`Cover art for ${result.title}`}
                    className={`w-full rounded-xl transition-opacity duration-500 ${isGeneratingImage ? "opacity-0" : "opacity-100"}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>

                {/* Image action buttons */}
                {!isGeneratingImage && !imageError && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadImage}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <FiDownload />
                      Download
                    </button>
                    <button
                      onClick={handleGenerateImage}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <FiRefreshCw />
                      Regenerate
                    </button>
                  </div>
                )}

                {/* Error state */}
                {imageError && (
                  <div className="text-center">
                    <p className="mb-3 text-sm text-red-400">Failed to generate image</p>
                    <button
                      onClick={handleGenerateImage}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <FiRefreshCw />
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Other tabs - normal layout */
          <>
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

            {/* Character count for SUNO prompt */}
            {activeTab === "suno" && content.suno && (
              <div className="mt-2 text-right text-[10px] text-gray-500">
                {content.suno.length} / 1000 characters
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
