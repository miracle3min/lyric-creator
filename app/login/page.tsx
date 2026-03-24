"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMusic, FiArrowLeft } from "react-icons/fi";

const floatingNotes = ["♪", "♫", "♩", "♬", "♭", "🎵", "🎶"];

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Redirect if already logged in
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/generate");
    }
  }, [session, isPending, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/generate",
      });
    } catch (err: any) {
      setError(err?.message || "Login gagal. Silakan coba lagi.");
      setLoading(false);
    }
  };

  if (isPending || session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[130px]" />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-indigo-500/8 blur-[100px]" />
      </div>

      {/* Floating Music Notes */}
      {mounted && (
        <div className="fixed inset-0 -z-5 pointer-events-none overflow-hidden">
          {floatingNotes.map((note, i) => (
            <span
              key={i}
              className="absolute text-white/[0.04] select-none"
              style={{
                fontSize: `${Math.random() * 40 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {note}
            </span>
          ))}
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </Link>

        <div className="card-glass relative overflow-hidden">
          {/* Glow accent */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-500/15 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-violet-500/15 blur-[60px]" />

          <div className="relative z-10">
            {/* Logo & Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-500/25 mb-5">
                <FiMusic className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Selamat Datang di{" "}
                <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                  BuatLirik
                </span>
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                Masuk untuk mulai membuat lirik lagu profesional<br />
                dengan kekuatan AI ✨
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? "Memproses..." : "Lanjutkan dengan Google"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-600 text-xs uppercase tracking-wider">info</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                { emoji: "🎵", text: "Generate lirik lagu unlimited" },
                { emoji: "🎹", text: "Prompt SUNO & cover art otomatis" },
                { emoji: "📁", text: "Simpan history generasi kamu" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-400"
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-xs mt-8">
              Dengan masuk, kamu menyetujui{" "}
              <span className="text-gray-500 hover:text-gray-400 cursor-pointer transition-colors">
                Ketentuan Layanan
              </span>{" "}
              kami
            </p>
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-gray-700 text-xs mt-6">
          A product by <span className="text-purple-500/70 font-medium">DirgaX Media</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
