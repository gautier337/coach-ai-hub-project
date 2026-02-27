"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface SubscriptionData {
  plan: string;
  status: string;
  monthlyCredits: number;
  creditsUsed: number;
  remainingCredits: number;
  trialEndDate: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

const PLANS = [
  {
    id: "FREE",
    name: "Gratuit",
    price: 0,
    description: "Pour découvrir Coach AI",
    features: ["5 messages par mois", "Historique limité", "Support par email"],
    limitations: ["Pas de personnalisation avancée"],
    popular: false,
  },
  {
    id: "BASIC",
    name: "Basique",
    price: 9.99,
    description: "Pour un coaching régulier",
    features: [
      "50 messages par mois",
      "Historique complet",
      "Conseils personnalisés",
      "Support prioritaire",
      "3 jours d'essai gratuit",
    ],
    limitations: [],
    popular: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    price: 19.99,
    description: "Pour les utilisateurs intensifs",
    features: [
      "Messages illimités",
      "Historique complet",
      "Conseils ultra-personnalisés",
      "Support VIP",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
    limitations: [],
    popular: false,
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  TRIAL: { label: "Essai gratuit", color: "text-[var(--secondary)]", bg: "bg-[var(--secondary)]/10" },
  ACTIVE: { label: "Actif", color: "text-[var(--success)]", bg: "bg-[var(--success)]/10" },
  CANCELED: { label: "Annulé", color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
  EXPIRED: { label: "Expiré", color: "text-[var(--muted)]", bg: "bg-[var(--border)]" },
  PAST_DUE: { label: "Paiement en retard", color: "text-red-500", bg: "bg-red-500/10" },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDaysRemaining(endDateStr: string | null): number {
  if (!endDateStr) return 0;
  const end = new Date(endDateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
}

export default function SubscriptionPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`/api/subscription`)
      .then((r) => r.json())
      .then((data) => {
        if (data.subscription) setSubscription(data.subscription);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleSubscribe(planId: string) {
    if (!user || actionLoading) return;
    if (planId === "FREE") return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!user || actionLoading) return;
    if (!confirm("Êtes-vous sûr de vouloir annuler votre abonnement ? Il restera actif jusqu'à la fin de la période.")) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setSuccessMessage("Abonnement annulé. Il restera actif jusqu'à la fin de la période.");
        setSubscription((prev) => prev ? { ...prev, status: "CANCELED", cancelAtPeriodEnd: true } : prev);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivate() {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/stripe/reactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setSuccessMessage("Abonnement réactivé avec succès !");
        setSubscription((prev) => prev ? { ...prev, status: "ACTIVE", cancelAtPeriodEnd: false } : prev);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePortal() {
    if (!user || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }

  const isLoading = userLoading || loading;
  const currentPlan = subscription?.plan ?? "FREE";
  const status = subscription?.status ?? "TRIAL";
  const statusConfig = STATUS_CONFIG[status];

  const endDate = subscription?.currentPeriodEnd ?? subscription?.trialEndDate ?? null;
  const daysRemaining = getDaysRemaining(endDate);
  const totalDays = 30;
  const progressPercent = Math.min(100, Math.round(((totalDays - daysRemaining) / totalDays) * 100));

  const hasActiveSubscription = ["ACTIVE", "CANCELED", "TRIAL"].includes(status) && currentPlan !== "FREE";

  return (
    <DashboardLayout title="Abonnement" subtitle="Gérez votre abonnement et vos paiements">
      <div className="space-y-8">
        {/* Message de succès */}
        {successMessage && (
          <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-xl text-[var(--success)] text-sm">
            {successMessage}
          </div>
        )}

        {/* Statut abonnement actuel */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-[var(--border)] rounded w-1/3" />
              <div className="h-4 bg-[var(--border)] rounded w-1/2" />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold">
                        Plan {PLANS.find((p) => p.id === currentPlan)?.name ?? currentPlan}
                      </h2>
                      <span className={`${statusConfig?.bg} ${statusConfig?.color} text-xs font-medium px-2 py-1 rounded-full`}>
                        {statusConfig?.label}
                      </span>
                    </div>
                    {endDate && (
                      <p className="text-[var(--muted)] text-sm mt-1">
                        {subscription?.cancelAtPeriodEnd
                          ? `Expire le ${formatDate(endDate)}`
                          : status === "TRIAL"
                          ? `Essai jusqu'au ${formatDate(endDate)}`
                          : `Renouvellement le ${formatDate(endDate)}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {hasActiveSubscription && !subscription?.cancelAtPeriodEnd && (
                    <>
                      <button
                        onClick={handlePortal}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--border)] transition-colors font-medium disabled:opacity-50"
                      >
                        Gérer
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors font-medium disabled:opacity-50"
                      >
                        Annuler
                      </button>
                    </>
                  )}
                  {subscription?.cancelAtPeriodEnd && (
                    <button
                      onClick={handleReactivate}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl gradient-primary text-white hover:opacity-90 transition-opacity font-medium disabled:opacity-50"
                    >
                      Réactiver
                    </button>
                  )}
                </div>
              </div>

              {/* Barre de progression */}
              {endDate && (
                <div className="mt-6 p-4 bg-[var(--background)] rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--muted)]">Période en cours</span>
                    <span className="font-medium">{daysRemaining} jours restants</span>
                  </div>
                  <div className="w-full bg-[var(--border)] rounded-full h-3">
                    <div
                      className="gradient-primary h-3 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Utilisation */}
        {!isLoading && subscription && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">Crédits utilisés ce mois</p>
                  <p className="text-xl font-bold">
                    {subscription.creditsUsed}
                    <span className="text-sm text-[var(--muted)]">
                      /{subscription.remainingCredits === -1 ? "∞" : subscription.monthlyCredits}
                    </span>
                  </p>
                </div>
              </div>
              {subscription.remainingCredits !== -1 && (
                <div className="w-full bg-[var(--border)] rounded-full h-2">
                  <div
                    className="bg-[var(--primary)] h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (subscription.creditsUsed / subscription.monthlyCredits) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--muted)]">Crédits restants</p>
                  <p className="text-xl font-bold text-[var(--success)]">
                    {subscription.remainingCredits === -1 ? "Illimité" : subscription.remainingCredits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-xl font-bold mb-6">Choisir un plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`relative bg-[var(--card-bg)] rounded-2xl border-2 p-6 transition-all ${
                    isCurrent
                      ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
                      : "border-[var(--border)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="gradient-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                        Plus populaire
                      </span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium px-2 py-1 rounded-full">
                        Actuel
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{plan.description}</p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? "0€" : `${plan.price}€`}
                    </span>
                    <span className="text-[var(--muted)]">/mois</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {plan.limitations.map((lim, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                        <svg className="w-5 h-5 text-[var(--muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {lim}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrent || plan.id === "FREE" || actionLoading || !user}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                      isCurrent || plan.id === "FREE" || !user
                        ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                        : plan.popular
                        ? "gradient-primary text-white hover:opacity-90"
                        : "border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    {actionLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Chargement...
                      </span>
                    ) : isCurrent ? (
                      "Plan actuel"
                    ) : plan.id === "FREE" ? (
                      "Plan gratuit"
                    ) : (
                      "Choisir ce plan"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
