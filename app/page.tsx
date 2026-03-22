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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          song,
          mode,
          selectedProvider: provider,
        }),
      });

      const data: GenerateResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setResults(data.results);
      toast.success(
        `Generated ${data.results.length} result${data.results.length > 1 ? "s" : ""}!`
      );
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400">
            <FiMusic />
            AI-Powered Song Creation
          </div>
          <h1 className="bg-gradient-to-r from-white via-brand-200 to-violet-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            SUNO Lyric Generator
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Generate lyrics, instrument details &amp; SUNO prompts with
            <span className="text-brand-400"> Gemini</span>,
            <span className="text-orange-400"> Groq</span> &amp;
            <span className="text-violet-400"> Mistral</span>
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Left: Form */}
          <aside className="card-glass h-fit lg:sticky lg:top-8">
            <h2 className="mb-6 text-xl font-bold text-white">
              ✨ Song Details
            </h2>
            <SongForm onSubmit={handleGenerate} isLoading={isLoading} />
          </aside>

          {/* Right: Results */}
          <section className="space-y-6">
            {isLoading && <LoadingSkeleton providers={activeProviders} />}

            {!isLoading && results.length > 0 && (
              <>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white">Results</h2>
                  <span className="rounded-full bg-brand-500/10 px-3 py-1 text-sm font-medium text-brand-400">
                    {results.length} provider{results.length > 1 ? "s" : ""}
                  </span>
                </div>
                {results.map((r) => (
                  <ResultCard key={r.provider} result={r} />
                ))}
              </>
            )}

            {!isLoading && results.length === 0 && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
                    <FiMusic className="text-4xl text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400">
                    Ready to Create Music
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Fill in the song details and hit generate
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
