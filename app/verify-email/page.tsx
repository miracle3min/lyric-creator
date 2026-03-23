"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth/client";

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
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if already verified
  useEffect(() => {
    if (!isPending && session?.user?.emailVerified) {
      router.replace("/");
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

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
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
      setTimeout(() => router.replace("/"), 1500);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-700">
        {success ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Terverifikasi!</h2>
            <p className="text-gray-400">Mengalihkan ke halaman utama...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-white mb-2">Verifikasi Email</h1>
              <p className="text-gray-400">
                Kami mengirim kode 6 digit ke{" "}
                <span className="text-purple-400 font-medium">{session.user.email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={verifying}
                  className="w-12 h-14 text-center text-2xl font-bold bg-gray-700 border-2 border-gray-600 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50"
                />
              ))}
            </div>

            {verifying && (
              <div className="flex justify-center mb-4">
                <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Resend */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-gray-500 text-sm">
                  Kirim ulang dalam <span className="text-purple-400">{countdown}s</span>
                </p>
              ) : (
                <button
                  onClick={sendOTP}
                  disabled={sending}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {sending ? "Mengirim..." : "Kirim Ulang Kode"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
