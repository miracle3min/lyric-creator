"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { data: session, isPending } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) return null;

  if (!session?.user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Sign In
      </button>
    );
  }

  const user = session.user;
  const initial = (user.name?.[0] || user.email?.[0] || "?").toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {user.image ? (
          <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {initial}
          </div>
        )}
        <span className="text-sm text-gray-300 hidden sm:inline">
          {user.name || user.email}
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              router.push("/login");
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
