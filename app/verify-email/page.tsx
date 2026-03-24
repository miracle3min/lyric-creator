"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth/client";
import { FiMail, FiCheck, FiRefreshCw, FiShield } from "react-icons/fi";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => setMounted(true), []);

  // Redirect if already verified
  useEffect(() => {
    if (!isPending && session?.user?.emailVerified) {
      router.replace("/generate");
    }
  }, [session, isPending, router]);

  // Auto-send OTP on first load
  useEffect(() => {
    if (session?.user?.email && !sent && !session?.user?.emailVerified) {
      sendOTP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = async () => {
    if (!session?.user?.email || sending) return;
    setSending(true);
    setError("");
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: session.user.email,
        type: "email-verification",
      });
      if (error) throw new Error(error.message || "Failed to send OTP");
      setSent(true);
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || "Gagal mengirim kode. Coba lagi.");
    } finally {
      setSending(false);
    }
  };

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 6) {
      verifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      verifyOTP(pasted);
    }
  };

  const verifyOTP = async (code: string) => {
    if (!session?.user?.email || verifying) return;
    setVerifying(true);
    setError("");
    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email: session.user.email,
        otp: code,
      });
      if (error) throw new Error(error.message || "Invalid code");
      setSuccess(true);
      setTimeout(() => router.replace("/generate"), 2000);
    } catch (err: any) {
      setError(err.message || "Kode salah. Coba lagi.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[130px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="card-glass relative overflow-hidden">
          {/* Glow accent */}
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand-500/15 blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-violet-500/15 blur-[60px]" />

          <div className="relative z-10">
            {success ? (
              /* Success State */
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 mb-6">
                  <FiCheck className="w-10 h-10 text-emerald-400 animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Email Terverifikasi! 🎉
                </h2>
                <p className="text-gray-400 text-sm">
                  Selamat! Kamu sudah bisa mulai membuat lirik.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 text-sm">
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  Mengalihkan ke generator...
                </div>
              </div>
            ) : (
              /* Verification Form */
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-lg shadow-brand-500/25 mb-5">
                    <FiMail className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Verifikasi Email Kamu
                  </h1>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Kami mengirim kode 6 digit ke
                  </p>
                  <p className="text-brand-400 font-medium text-sm mt-1">
                    {session.user.email}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {/* OTP Input */}
                <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInput(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      disabled={verifying}
                      className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-300 disabled:opacity-50 bg-white/5 backdrop-blur-sm ${
                        digit
                          ? "border-brand-500/60 text-white shadow-lg shadow-brand-500/10"
                          : "border-white/10 text-gray-300 hover:border-white/20"
                      } focus:border-brand-500 focus:shadow-lg focus:shadow-brand-500/20`}
                    />
                  ))}
                </div>

                {/* Verifying spinner */}
                {verifying && (
                  <div className="flex items-center justify-center gap-2 mb-4 text-brand-400 text-sm">
                    <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                    Memverifikasi...
                  </div>
                )}

                {/* Resend */}
                <div className="text-center mb-6">
                  {countdown > 0 ? (
                    <p className="text-gray-500 text-sm">
                      Kirim ulang dalam{" "}
                      <span className="text-brand-400 font-semibold tabular-nums">
                        {countdown}s
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={sendOTP}
                      disabled={sending}
                      className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors disabled:opacity-50 group"
                    >
                      <FiRefreshCw className={`w-3.5 h-3.5 ${sending ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                      {sending ? "Mengirim..." : "Kirim Ulang Kode"}
                    </button>
                  )}
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 justify-center text-gray-600 text-xs">
                  <FiShield className="w-3.5 h-3.5" />
                  <span>Verifikasi satu kali untuk keamanan akun</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Branding */}
        <p className="text-center text-gray-700 text-xs mt-6">
          A product by <span className="text-purple-500/70 font-medium">DirgaX Media</span>
        </p>
      </div>
    </div>
  );
}
