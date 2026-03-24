"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import Link from "next/link";
import {
  FiMusic,
  FiZap,
  FiClock,
  FiGlobe,
  FiArrowRight,
  FiStar,
  FiHeadphones,
  FiEdit3,
  FiCpu,
} from "react-icons/fi";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // If logged in, redirect to generator
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/generate");
    }
  }, [session, isPending, router]);

  // Show nothing while checking auth
  if (isPending || session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-brand-500/8 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-violet-500/8 blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      {/* Floating music notes - decorative */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {mounted && (
          <>
            <div className="absolute top-[15%] left-[10%] text-brand-500/20 text-4xl animate-bounce" style={{ animationDuration: "3s", animationDelay: "0s" }}>♪</div>
            <div className="absolute top-[25%] right-[15%] text-violet-500/20 text-3xl animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>♫</div>
            <div className="absolute top-[60%] left-[8%] text-indigo-500/15 text-5xl animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>♩</div>
            <div className="absolute top-[45%] right-[8%] text-brand-400/15 text-4xl animate-bounce" style={{ animationDuration: "4.5s", animationDelay: "2s" }}>♬</div>
            <div className="absolute bottom-[20%] left-[20%] text-violet-400/10 text-6xl animate-bounce" style={{ animationDuration: "5s", animationDelay: "1.5s" }}>♪</div>
            <div className="absolute bottom-[30%] right-[25%] text-brand-300/10 text-3xl animate-bounce" style={{ animationDuration: "3.2s", animationDelay: "0.8s" }}>♫</div>
          </>
        )}
      </div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-500/25">
                <FiMusic className="text-white text-lg" />
              </div>
              <span className="text-lg font-bold text-white">BuatLirik</span>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400 mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <FiZap className="text-brand-400" />
              Powered by Google Gemini AI
            </div>

            {/* Headline */}
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <span className="text-white">Buat Lirik Lagu</span>
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Dalam Hitungan Detik
              </span>
            </h1>

            {/* Subheadline */}
            <p className={`text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              Generate lirik lagu, prompt SUNO AI, dan prompt cover art
              secara otomatis. Tinggal pilih genre, mood, bahasa — AI yang kerjakan sisanya.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Link
                href="/login"
                className="group btn-primary text-lg px-8 py-4"
              >
                Mulai Gratis
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-gray-300 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                Lihat Fitur
              </a>
            </div>

            {/* Social proof */}
            <div className={`mt-12 flex items-center justify-center gap-2 text-sm text-gray-500 transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-500 fill-yellow-500 w-4 h-4" />
                ))}
              </div>
              <span>Gratis tanpa batas · Tidak perlu kartu kredit</span>
            </div>
          </div>

          {/* Hero Visual - Floating Card Preview */}
          <div className={`mt-16 sm:mt-20 mx-auto max-w-3xl transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-brand-500/20 via-violet-500/20 to-indigo-500/20 blur-2xl" />

              {/* Card */}
              <div className="relative rounded-2xl border border-white/10 bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                {/* Mock browser bar */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4 rounded-lg bg-white/5 px-4 py-1.5 text-xs text-gray-500 text-center">
                    buatlirik.app
                  </div>
                </div>

                {/* Mock content */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Left - form mock */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Input</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                        <span className="text-brand-400">🎸</span>
                        <span className="text-gray-400">Genre:</span>
                        <span className="text-white font-medium">Pop</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                        <span className="text-brand-400">💫</span>
                        <span className="text-gray-400">Mood:</span>
                        <span className="text-white font-medium">Upbeat</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                        <span className="text-brand-400">🌐</span>
                        <span className="text-gray-400">Bahasa:</span>
                        <span className="text-white font-medium">Indonesia</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm">
                        <span className="text-brand-400">📝</span>
                        <span className="text-gray-400">Tema:</span>
                        <span className="text-white font-medium">Cinta pertama</span>
                      </div>
                    </div>
                    <div className="mt-2 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 px-4 py-2 text-center text-sm font-semibold text-white">
                      ✨ Generate Lyrics
                    </div>
                  </div>

                  {/* Right - result mock */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Output</div>
                    <div className="rounded-xl bg-white/5 p-4 space-y-2">
                      <div className="text-xs font-medium text-brand-400 mb-2">🎵 Lirik</div>
                      <div className="space-y-1 text-sm text-gray-300 italic leading-relaxed">
                        <p>Di bawah langit senja yang bercerita</p>
                        <p>Ku temukan namamu di antara bintang</p>
                        <p>Detak jantung ini bermain nada</p>
                        <p>Untuk cinta pertama yang tak terlupakan...</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-2 text-center text-xs text-violet-400">
                        SUNO Prompt ✓
                      </div>
                      <div className="flex-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-center text-xs text-indigo-400">
                        Cover Art ✓
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-4">
              <FiCpu />
              Fitur Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Semua yang Kamu Butuhkan
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Dari ide sampai lagu jadi — satu platform AI yang mengurus semuanya
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FiEdit3 className="text-2xl" />,
                title: "Lirik Otomatis",
                desc: "Generate lirik lengkap dengan verse, chorus, bridge — sesuai genre dan mood pilihanmu.",
                gradient: "from-brand-500 to-pink-500",
                glow: "bg-brand-500/10",
              },
              {
                icon: <FiHeadphones className="text-2xl" />,
                title: "SUNO AI Ready",
                desc: "Langsung dapat prompt yang optimized untuk SUNO AI. Copy-paste, dan biarkan musik tercipta.",
                gradient: "from-violet-500 to-indigo-500",
                glow: "bg-violet-500/10",
              },
              {
                icon: <FiGlobe className="text-2xl" />,
                title: "Multi Bahasa",
                desc: "Support Bahasa Indonesia, English, Korean, Japanese, dan banyak lagi. Bikin lagu dalam bahasa apapun.",
                gradient: "from-indigo-500 to-cyan-500",
                glow: "bg-indigo-500/10",
              },
              {
                icon: <FiZap className="text-2xl" />,
                title: "Super Cepat",
                desc: "Powered by Google Gemini AI. Generate lirik lengkap dalam hitungan detik, bukan menit.",
                gradient: "from-amber-500 to-orange-500",
                glow: "bg-amber-500/10",
              },
              {
                icon: <FiClock className="text-2xl" />,
                title: "History & Profil",
                desc: "Semua lirik yang pernah kamu buat tersimpan aman. Akses kapan saja, dari mana saja.",
                gradient: "from-emerald-500 to-teal-500",
                glow: "bg-emerald-500/10",
              },
              {
                icon: <FiStar className="text-2xl" />,
                title: "Cover Art Prompt",
                desc: "Bonus prompt untuk generate cover art yang matching dengan lagu. Siap pakai di AI image generator.",
                gradient: "from-rose-500 to-brand-500",
                glow: "bg-rose-500/10",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl ${f.glow} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`} />
                
                <div className="relative">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg`}>
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-400 mb-4">
              <FiMusic />
              Cara Kerja
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              3 Langkah Mudah
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Dari nol sampai punya lirik lagu profesional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Isi Detail Lagu",
                desc: "Pilih genre, mood, bahasa, dan tema lagumu. Atau biarkan AI yang memilihkan.",
                emoji: "🎯",
              },
              {
                step: "02",
                title: "AI Generate",
                desc: "Google Gemini AI akan membuat lirik, prompt SUNO, dan prompt cover art.",
                emoji: "🤖",
              },
              {
                step: "03",
                title: "Copy & Create",
                desc: "Copy hasilnya ke SUNO AI dan buat lagu! Semua tersimpan di history-mu.",
                emoji: "🚀",
              },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t border-dashed border-white/10" />
                )}
                
                <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                  {/* Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-brand-500/20" />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-brand-500/10 to-violet-500/10" />
                  <span className="text-4xl">{s.emoji}</span>
                </div>
                
                <div className="mb-2 text-xs font-bold text-brand-400 uppercase tracking-widest">
                  Step {s.step}
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 sm:py-32 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-3xl text-center">
            {/* Glow */}
            <div className="absolute -inset-20 rounded-full bg-gradient-to-r from-brand-500/10 via-violet-500/10 to-indigo-500/10 blur-3xl" />
            
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
                Siap Bikin Lagu
                <br />
                <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
                  Pertamamu?
                </span>
              </h2>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                Bergabung sekarang — gratis, tanpa batas, tanpa kartu kredit. 
                Cukup login dengan Google dan mulai berkarya.
              </p>
              <Link
                href="/login"
                className="group btn-primary text-lg px-10 py-4"
              >
                Mulai Gratis Sekarang
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600">
                <FiMusic className="text-white text-xs" />
              </div>
              <span className="text-sm font-semibold text-gray-400">BuatLirik</span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 BuatLirik. Powered by Google Gemini AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
