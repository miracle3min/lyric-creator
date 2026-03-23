"use client";

import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiMusic, FiClock, FiChevronRight, FiX, FiCopy, FiCheck } from "react-icons/fi";

interface Generation {
  id: number;
  title: string;
  lyrics: string;
  genre: string | null;
  mood: string | null;
  language: string | null;
  tempo: string | null;
  vocal_style: string | null;
  instruments_input: string | null;
  instruments_output: string | null;
  suno_prompt: string | null;
  cover_art_prompt: string | null;
  description: string | null;
  created_at: string;
}

export default function HistoryPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Generation | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/history?limit=100");
        const data = await res.json();
        setGenerations(data.generations || []);
      } catch {
        setGenerations([]);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchHistory();
  }, [session]);

  function formatDate(d: string) {
    const date = new Date(d);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }

  async function copyToClipboard(text: string, field: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  }

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen min-h-[100dvh]">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <FiArrowLeft /> Back to Generator
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FiClock className="text-purple-400" />
            Generation History
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {generations.length} generation{generations.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-white/5 shimmer" />
            ))}
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-16">
            <FiMusic className="text-4xl text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No generations yet</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Create your first lyric →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {generations.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setSelected(gen)}
                className="w-full text-left bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate group-hover:text-purple-300 transition-colors">
                      {gen.title || "Untitled"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {gen.genre && (
                        <span className="text-xs bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-full">
                          {gen.genre}
                        </span>
                      )}
                      {gen.mood && (
                        <span className="text-xs bg-violet-500/15 text-violet-300 px-2 py-0.5 rounded-full">
                          {gen.mood}
                        </span>
                      )}
                      {gen.language && (
                        <span className="text-xs bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded-full">
                          {gen.language}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{formatDate(gen.created_at)}</span>
                    </div>
                  </div>
                  <FiChevronRight className="text-gray-500 group-hover:text-purple-400 transition-colors ml-3 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-5 flex items-start justify-between z-10">
              <div>
                <h2 className="text-xl font-bold text-white">{selected.title || "Untitled"}</h2>
                <p className="text-sm text-gray-400 mt-1">{formatDate(selected.created_at)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selected.genre && <Tag label="Genre" value={selected.genre} color="purple" />}
                {selected.mood && <Tag label="Mood" value={selected.mood} color="violet" />}
                {selected.language && <Tag label="Language" value={selected.language} color="blue" />}
                {selected.tempo && <Tag label="Tempo" value={selected.tempo} color="emerald" />}
                {selected.vocal_style && <Tag label="Vocal" value={selected.vocal_style} color="amber" />}
              </div>

              {/* Description */}
              {selected.description && (
                <Section title="Description">
                  <p className="text-gray-300 text-sm">{selected.description}</p>
                </Section>
              )}

              {/* Lyrics */}
              <Section
                title="Lyrics"
                copyable
                onCopy={() => copyToClipboard(selected.lyrics, "lyrics")}
                copied={copiedField === "lyrics"}
              >
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {selected.lyrics}
                </pre>
              </Section>

              {/* Instruments */}
              {selected.instruments_output && (
                <Section
                  title="Instruments"
                  copyable
                  onCopy={() => copyToClipboard(selected.instruments_output!, "instruments")}
                  copied={copiedField === "instruments"}
                >
                  <p className="text-gray-300 text-sm">{selected.instruments_output}</p>
                </Section>
              )}

              {/* SUNO Prompt */}
              {selected.suno_prompt && (
                <Section
                  title="SUNO Prompt"
                  copyable
                  onCopy={() => copyToClipboard(selected.suno_prompt!, "suno")}
                  copied={copiedField === "suno"}
                >
                  <p className="text-gray-300 text-sm">{selected.suno_prompt}</p>
                </Section>
              )}

              {/* Cover Art Prompt */}
              {selected.cover_art_prompt && (
                <Section
                  title="Cover Art Prompt"
                  copyable
                  onCopy={() => copyToClipboard(selected.cover_art_prompt!, "cover")}
                  copied={copiedField === "cover"}
                >
                  <p className="text-gray-300 text-sm">{selected.cover_art_prompt}</p>
                </Section>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Tag({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    purple: "bg-purple-500/15 text-purple-300",
    violet: "bg-violet-500/15 text-violet-300",
    blue: "bg-blue-500/15 text-blue-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full ${colors[color] || colors.purple}`}>
      {label}: {value}
    </span>
  );
}

function Section({
  title,
  children,
  copyable,
  onCopy,
  copied,
}: {
  title: string;
  children: React.ReactNode;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
        {copyable && onCopy && (
          <button
            onClick={onCopy}
            className="text-xs text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1"
          >
            {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}
