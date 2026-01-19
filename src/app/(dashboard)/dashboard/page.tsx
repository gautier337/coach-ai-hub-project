"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Tableau de bord"
      subtitle="Bienvenue, Jean ! Voici vos statistiques."
    >
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total conversations */}
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs text-[var(--success)] font-medium bg-[var(--success)]/10 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-1">Total conversations</p>
            <p className="text-3xl font-bold">24</p>
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
            <p className="text-3xl font-bold">15<span className="text-lg text-[var(--muted)]">/20</span></p>
          </div>

          {/* Messages ce mois */}
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs text-[var(--success)] font-medium bg-[var(--success)]/10 px-2 py-1 rounded-full">
                +8%
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] mb-1">Messages ce mois</p>
            <p className="text-3xl font-bold">156</p>
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
            <p className="text-xl font-bold text-[var(--success)]">Premium</p>
          </div>
        </div>

        {/* Quick actions & Recent chats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent chats */}
          <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Conversations récentes</h2>
              <Link
                href="/chat"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Conseils premier rendez-vous",
                  preview: "Tu peux me donner des conseils pour un premier rendez-vous ce soir ?",
                  time: "Il y a 2h",
                  unread: true,
                },
                {
                  title: "Améliorer ma confiance",
                  preview: "Comment puis-je améliorer ma confiance en moi au quotidien ?",
                  time: "Hier",
                  unread: false,
                },
                {
                  title: "Gestion du stress",
                  preview: "J'ai un entretien important demain, comment gérer mon stress ?",
                  time: "Il y a 3 jours",
                  unread: false,
                },
              ].map((chat, index) => (
                <Link
                  key={index}
                  href="/chat"
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--background)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium truncate">{chat.title}</p>
                      <span className="text-xs text-[var(--muted)]">{chat.time}</span>
                    </div>
                    <p className="text-sm text-[var(--muted)] truncate">{chat.preview}</p>
                  </div>
                  {chat.unread && (
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0 mt-2"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-6">
            {/* New chat CTA */}
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

            {/* Usage progress */}
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
              <h3 className="font-bold mb-4">Utilisation du mois</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--muted)]">Messages</span>
                    <span className="font-medium">156/200</span>
                  </div>
                  <div className="w-full bg-[var(--border)] rounded-full h-2">
                    <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--muted)]">Conversations</span>
                    <span className="font-medium">15/20</span>
                  </div>
                  <div className="w-full bg-[var(--border)] rounded-full h-2">
                    <div className="bg-[var(--secondary)] h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>
              <Link
                href="/subscription"
                className="text-sm text-[var(--primary)] hover:underline mt-4 block"
              >
                Augmenter mes limites
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
