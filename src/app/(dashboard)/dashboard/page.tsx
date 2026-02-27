"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Stats {
  totalChats: number;
  totalMessages: number;
  remainingCredits: number;
  plan: string;
  status: string;
}

interface RecentSession {
  id: string;
  title: string;
  preview: string | null;
  updatedAt: string;
}

const PLAN_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  BASIC: "Basique",
  PREMIUM: "Premium",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  TRIAL: { label: "Essai", color: "text-[var(--secondary)]" },
  ACTIVE: { label: "Actif", color: "text-[var(--success)]" },
  CANCELED: { label: "Annulé", color: "text-[var(--accent)]" },
  EXPIRED: { label: "Expiré", color: "text-[var(--muted)]" },
  PAST_DUE: { label: "Impayé", color: "text-red-500" },
};

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return "À l'instant";
  if (h < 24) return `Il y a ${h}h`;
  if (d === 1) return "Hier";
  return `Il y a ${d} jours`;
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--border)]" />
      </div>
      <div className="h-3 bg-[var(--border)] rounded w-2/3 mb-2" />
      <div className="h-8 bg-[var(--border)] rounded w-1/2" />
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: userLoading, remainingCredits } = useCurrentUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingStats(true);

    Promise.all([
      fetch(`/api/user/stats`).then((r) => r.json()),
      fetch(`/api/chat/history?limit=3`).then((r) => r.json()),
    ])
      .then(([statsData, historyData]) => {
        if (statsData.stats) setStats(statsData.stats);
        if (historyData.history) setRecentSessions(historyData.history);
      })
      .catch(console.error)
      .finally(() => setLoadingStats(false));
  }, [user]);

  const loading = userLoading || loadingStats;
  const planLabel = PLAN_LABELS[stats?.plan ?? "FREE"] ?? "Gratuit";
  const statusInfo = STATUS_LABELS[stats?.status ?? "TRIAL"];
  const monthlyCredits = user?.subscription?.monthlyCredits ?? 5;
  const creditsUsed = user?.subscription?.creditsUsed ?? 0;
  const creditsPercent =
    monthlyCredits > 0
      ? Math.min(100, Math.round((creditsUsed / monthlyCredits) * 100))
      : 0;

  return (
    <DashboardLayout
      title="Tableau de bord"
      subtitle={`Bienvenue, ${user?.name?.split(" ")[0] ?? "..."} ! Voici vos statistiques.`}
    >
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              {/* Total conversations */}
              <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted)] mb-1">Total conversations</p>
                <p className="text-3xl font-bold">{stats?.totalChats ?? 0}</p>
              </div>

              {/* Crédits restants */}
              <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--secondary)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted)] mb-1">Crédits restants</p>
                {remainingCredits === -1 ? (
                  <p className="text-3xl font-bold">∞</p>
                ) : (
                  <p className="text-3xl font-bold">
                    {remainingCredits}
                    <span className="text-lg text-[var(--muted)]">/{monthlyCredits}</span>
                  </p>
                )}
              </div>

              {/* Messages ce mois */}
              <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted)] mb-1">Messages envoyés</p>
                <p className="text-3xl font-bold">{stats?.totalMessages ?? 0}</p>
              </div>

              {/* Abonnement */}
              <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted)] mb-1">Abonnement</p>
                <p className="text-xl font-bold">{planLabel}</p>
                {statusInfo && (
                  <p className={`text-xs font-medium mt-1 ${statusInfo.color}`}>
                    {statusInfo.label}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Conversations récentes & Utilisation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations récentes */}
          <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Conversations récentes</h2>
              <Link href="/chat" className="text-sm text-[var(--primary)] hover:underline">
                Voir tout
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-[var(--border)] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[var(--muted)] text-sm">Aucune conversation pour l&apos;instant.</p>
                <Link
                  href="/chat"
                  className="inline-block mt-3 text-sm text-[var(--primary)] hover:underline"
                >
                  Démarrer une conversation
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/chat?session=${session.id}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--background)] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{session.title}</p>
                        <span className="text-xs text-[var(--muted)] flex-shrink-0 ml-2">
                          {formatRelativeTime(session.updatedAt)}
                        </span>
                      </div>
                      {session.preview && (
                        <p className="text-sm text-[var(--muted)] truncate">{session.preview}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* CTA nouveau chat */}
            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Besoin d&apos;un conseil ?</h3>
              <p className="text-sm text-white/80 mb-4">
                Démarrez une nouvelle conversation avec votre coach IA personnel.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-medium px-4 py-2 rounded-xl hover:bg-white/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nouveau chat
              </Link>
            </div>

            {/* Utilisation des crédits */}
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
              <h3 className="font-bold mb-4">Utilisation du mois</h3>
              {loading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-[var(--border)] rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--muted)]">Crédits utilisés</span>
                      <span className="font-medium">
                        {creditsUsed}/{remainingCredits === -1 ? "∞" : monthlyCredits}
                      </span>
                    </div>
                    <div className="w-full bg-[var(--border)] rounded-full h-2">
                      <div
                        className="bg-[var(--primary)] h-2 rounded-full transition-all"
                        style={{ width: remainingCredits === -1 ? "10%" : `${creditsPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <Link
                href="/subscription"
                className="text-sm text-[var(--primary)] hover:underline mt-4 block"
              >
                Augmenter mes limites →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
