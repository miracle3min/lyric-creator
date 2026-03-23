"use client";

import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiMusic, FiMail, FiCalendar, FiUser } from "react-icons/fi";

interface Stats {
  totalGenerations: number;
  lastGenerated: string | null;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/history?limit=1000");
        const data = await res.json();
        const gens = data.generations || [];
        setStats({
          totalGenerations: gens.length,
          lastGenerated: gens.length > 0 ? gens[0].created_at : null,
        });
      } catch {
        setStats({ totalGenerations: 0, lastGenerated: null });
      }
    }
    if (session?.user) fetchStats();
  }, [session]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user;
  const initial = (user.name?.[0] || user.email?.[0] || "?").toUpperCase();

  function formatDate(d: string | null) {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  return (
    <main className="min-h-screen min-h-[100dvh]">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <FiArrowLeft /> Back to Generator
        </button>

        {/* Profile card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
          {/* Avatar & name */}
          <div className="flex flex-col items-center text-center mb-8">
            {user.image ? (
              <img
                src={user.image}
                alt=""
                className="w-24 h-24 rounded-full ring-4 ring-purple-500/30 mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-purple-500/30 mb-4">
                {initial}
              </div>
            )}
            <h1 className="text-2xl font-bold text-white">{user.name || "User"}</h1>
            <p className="text-gray-400 mt-1">{user.email}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FiMusic className="text-purple-400" />
                </div>
                <span className="text-sm text-gray-400">Total Generations</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats !== null ? stats.totalGenerations : "..."}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <FiCalendar className="text-violet-400" />
                </div>
                <span className="text-sm text-gray-400">Last Generated</span>
              </div>
              <p className="text-lg font-semibold text-white">
                {stats !== null ? formatDate(stats.lastGenerated) : "..."}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FiMail className="text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">Email</span>
              </div>
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <FiUser className="text-emerald-400" />
                </div>
                <span className="text-sm text-gray-400">Account</span>
              </div>
              <p className="text-sm font-medium text-white">Google OAuth</p>
            </div>
          </div>

          {/* View history link */}
          <button
            onClick={() => router.push("/history")}
            className="w-full mt-6 py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            <FiMusic className="text-base" />
            View Generation History
          </button>
        </div>
      </div>
    </main>
  );
}
