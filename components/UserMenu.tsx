"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth/client";

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const initials = (user.name || user.email || "U")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
      >
        {user.image ? (
          <img
            src={user.image}
            alt=""
            className="w-7 h-7 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
        )}
        <span className="text-sm text-gray-300 hidden sm:inline max-w-[120px] truncate">
          {user.name || user.email}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur border border-white/10 rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-2 border-b border-white/10">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              signOut().then(() => {
                window.location.href = "/login";
              });
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
