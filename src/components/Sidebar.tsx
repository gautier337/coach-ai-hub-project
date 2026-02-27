"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const navigation = [
  {
    name: "Tableau de bord",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Chat",
    href: "/chat",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    name: "Abonnement",
    href: "/subscription",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, remainingCredits } = useCurrentUser();

  const monthlyCredits = user?.subscription?.monthlyCredits ?? 5;
  const creditsUsed = user?.subscription?.creditsUsed ?? 0;
  const creditsPercent =
    remainingCredits === -1
      ? 10
      : monthlyCredits > 0
      ? Math.min(100, Math.round(((monthlyCredits - Math.max(0, remainingCredits)) / monthlyCredits) * 100))
      : 0;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--card-bg)] border-r border-[var(--border)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--border)]">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Coach AI</span>
            <button
              onClick={onClose}
              className="ml-auto lg:hidden p-2 hover:bg-[var(--border)] rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "hover:bg-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Credits indicator */}
          <div className="px-4 pb-4">
            <div className="bg-[var(--background)] rounded-xl p-4 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Crédits restants</span>
                <span className="text-sm font-bold text-[var(--primary)]">
                  {remainingCredits === -1 ? "∞" : `${Math.max(0, remainingCredits)}/${monthlyCredits}`}
                </span>
              </div>
              <div className="w-full bg-[var(--border)] rounded-full h-2">
                <div
                  className="gradient-primary h-2 rounded-full transition-all"
                  style={{ width: `${creditsPercent}%` }}
                />
              </div>
              <Link
                href="/subscription"
                className="text-xs text-[var(--primary)] hover:underline mt-2 block"
              >
                Obtenir plus de crédits
              </Link>
            </div>
          </div>

          {/* User profile + logout */}
          <div className="px-4 pb-6">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--border)] transition-colors">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name ?? "Avatar"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium text-sm">
                  {getInitials(user?.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name ?? "..."}</p>
                <p className="text-xs text-[var(--muted)] truncate">{user?.email ?? ""}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Se déconnecter"
                className="p-1.5 hover:bg-[var(--accent)]/10 rounded-lg transition-colors text-[var(--muted)] hover:text-[var(--accent)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
