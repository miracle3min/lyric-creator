import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }
  // Server-side / build-time fallback
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (url) {
    const base = url.startsWith("http") ? url : `https://${url}`;
    return `${base}/api/auth`;
  }
  return "http://localhost:3000/api/auth";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, useSession } = authClient;
