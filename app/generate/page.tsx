"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SongRequest, SongResult, GenerateResponse } from "@/types";
import SongForm from "@/components/SongForm";
import ResultCard from "@/components/ResultCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import { toast } from "sonner";
import { FiMusic } from "react-icons/fi";
import UserMenu from "@/components/UserMenu";
import { useSession } from "@/lib/auth/client";

export default function GeneratePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [result, setResult] = useState<SongResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  // Redirect unverified users
  useEffect(() => {
    if (!isPending && session?.user && !session.user.emailVerified) {
      router.replace("/verify-email");
    }
  }, [session, isPending, router]);

  const handleGenerate = async (song: SongRequest) => {
    setIsLoading(true);
    setResult(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120_000);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      const data: GenerateResponse = await res.json();

      if (!data.result) {
        throw new Error("No result returned");
      }

      setResult(data.result);
      toast.success("Lyrics generated successfully!");
    } catch (error: any) {
      const message =
        error.name === "AbortError"
          ? "Request timed out. Please try again."
          : error.message || "Something went wrong";

      console.error("[Generate]", { message, error });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
        <header className="mb-8 sm:mb-12">
          <div className="flex items-start justify-between">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-400 sm:mb-4 sm:px-4 sm:py-1.5 sm:text-sm">
                <FiMusic />
                AI-Powered Song Creation
              </div>
              <h1 className="bg-gradient-to-r from-white via-brand-200 to-violet-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
                SUNO Lyric Generator
              </h1>
            </div>
            <div className="flex flex-1 justify-end">
              <UserMenu />
            </div>
          </div>
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
            {isLoading && <LoadingSkeleton />}

            {!isLoading && result && (
              <ErrorBoundary>
                <ResultCard result={result} />
              </ErrorBoundary>
            )}

            {!isLoading && !result && (
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
