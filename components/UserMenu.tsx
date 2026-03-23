'use client';

import { useState, useEffect, useRef } from 'react';
import { authClient } from '@/lib/auth/client';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      if (data?.user) {
        setUser(data.user as User);
      }
    });
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white transition-all hover:border-white/20 hover:bg-white/10"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="h-6 w-6 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
            <FiUser className="text-xs" />
          </div>
        )}
        <span className="hidden sm:inline">{user.name || user.email}</span>
        <FiChevronDown className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 transition-colors hover:bg-white/5"
          >
            <FiLogOut />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
