import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SUNO Lyric Generator — AI-Powered Song Creation",
  description:
    "Generate song lyrics, instrument details, and SUNO AI prompts using multiple AI providers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          toastOptions={{
            style: {
              background: "rgba(15, 15, 25, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
