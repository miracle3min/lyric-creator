"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { FiUser, FiClock, FiLogOut, FiChevronDown } from "react-icons/fi";

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

  const menuItems = [
    {
      label: "Profile",
      icon: FiUser,
      onClick: () => { router.push("/profile"); setShowMenu(false); },
      className: "text-gray-300 hover:text-white",
    },
    {
      label: "History",
      icon: FiClock,
      onClick: () => { router.push("/history"); setShowMenu(false); },
      className: "text-gray-300 hover:text-white",
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
      >
        {user.image ? (
          <img src={user.image} alt="" className="w-9 h-9 rounded-full ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-purple-500/30">
            {initial}
          </div>
        )}
        <FiChevronDown className={`text-gray-400 text-sm transition-transform ${showMenu ? "rotate-180" : ""}`} />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-3 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold">
                  {initial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-white/5 transition-colors ${item.className}`}
              >
                <item.icon className="text-base" />
                {item.label}
              </button>
            ))}
          </div>

          {/* Sign out */}
          <div className="border-t border-white/10 pt-1.5">
            <button
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center gap-3"
            >
              <FiLogOut className="text-base" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
