"use client";

import { useState } from "react";
import {
  SongRequest,
  SongResult,
  GenerateMode,
  Provider,
  GenerateResponse,
} from "@/types";
import SongForm from "@/components/SongForm";
import ResultCard from "@/components/ResultCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import { toast } from "sonner";
import { FiMusic } from "react-icons/fi";

export default function Home() {
  const [results, setResults] = useState<SongResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProviders, setActiveProviders] = useState<Provider[]>([]);

  const handleGenerate = async (
    song: SongRequest,
    mode: GenerateMode,
    provider?: Provider
  ) => {
    setIsLoading(true);
    setResults([]);

    if (mode === "multi") {
      setActiveProviders(["gemini", "groq", "mistral"]);
    } else {
      setActiveProviders([provider || "gemini"]);
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, mode, selectedProvider: provider }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || `Server error (${res.status})`
        );
      }

      const data: GenerateResponse = await res.json();

      if (!data.results || data.results.length === 0) {
        throw new Error("No results returned from AI providers");
      }

      setResults(data.results);
      toast.success(
        `Generated ${data.results.length} result${data.results.length > 1 ? "s" : ""}!`
      );
    } catch (error: any) {
      const message =
        error.name === "AbortError"
          ? "Request timed out. Try again or use Single AI mode."
          : error.message || "Something went wrong";

      console.error("[Generate]", { message, error });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen min-h-[100dvh]">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400 sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
            <FiMusic />
            AI-Powered Song Creation
          </div>
          <h1 className="bg-gradient-to-r from-white via-brand-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            SUNO Lyric Generator
          </h1>
        </header>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[400px_1fr]">
          {/* Left: Form */}
          <aside className="card-glass h-fit lg:sticky lg:top-8">
            <h2 className="mb-4 text-lg font-bold text-white sm:mb-6 sm:text-xl">
              ✨ Song Details
            </h2>
            <ErrorBoundary>
              <SongForm onSubmit={handleGenerate} isLoading={isLoading} />
            </ErrorBoundary>
          </aside>

          {/* Right: Results */}
          <section className="space-y-4 sm:space-y-6">
            {isLoading && <LoadingSkeleton providers={activeProviders} />}

            {!isLoading && results.length > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">Results</h2>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400 sm:text-sm">
                    {results.length} provider{results.length > 1 ? "s" : ""}
                  </span>
                </div>
                <ErrorBoundary>
                  {results.map((r) => (
                    <ResultCard key={r.provider} result={r} />
                  ))}
                </ErrorBoundary>
              </>
            )}

            {!isLoading && results.length === 0 && (
              <div className="flex min-h-[200px] items-center justify-center sm:min-h-[400px]">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 sm:h-20 sm:w-20">
                    <FiMusic className="text-3xl text-gray-600 sm:text-4xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-400 sm:text-xl">
                    Ready to Create Music
                  </h3>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
