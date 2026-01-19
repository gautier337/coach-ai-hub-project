"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    price: "0€",
    period: "/mois",
    description: "Pour découvrir Coach AI",
    features: [
      "5 conversations par mois",
      "20 messages par conversation",
      "Conseils de base",
      "Support par email",
    ],
    limitations: [
      "Pas d'historique avancé",
      "Réponses standards",
    ],
    current: false,
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "9.99€",
    period: "/mois",
    description: "Pour un coaching régulier",
    features: [
      "20 conversations par mois",
      "Messages illimités",
      "Conseils personnalisés",
      "Historique complet",
      "Support prioritaire",
      "3 jours d'essai gratuit",
    ],
    limitations: [],
    current: true,
    popular: true,
  },
  {
    id: "unlimited",
    name: "Illimité",
    price: "19.99€",
    period: "/mois",
    description: "Pour les utilisateurs intensifs",
    features: [
      "Conversations illimitées",
      "Messages illimités",
      "Conseils ultra-personnalisés",
      "Historique complet",
      "Support VIP 24/7",
      "Accès aux nouvelles fonctionnalités",
    ],
    limitations: [],
    current: false,
    popular: false,
  },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Calculate days remaining (mock)
  const daysRemaining = 18;
  const totalDays = 30;
  const progressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <DashboardLayout
      title="Abonnement"
      subtitle="Gérez votre abonnement et vos paiements"
    >
      <div className="space-y-8">
        {/* Current subscription status */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Plan Premium</h2>
                  <span className="bg-[var(--success)]/10 text-[var(--success)] text-xs font-medium px-2 py-1 rounded-full">
                    Actif
                  </span>
                </div>
                <p className="text-[var(--muted)]">Prochain renouvellement le 15 février 2025</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--border)] transition-colors font-medium">
                Changer de plan
              </button>
              <button className="px-4 py-2 rounded-xl text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors font-medium">
                Annuler
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 p-4 bg-[var(--background)] rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--muted)]">Période en cours</span>
              <span className="font-medium">{daysRemaining} jours restants</span>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-3">
              <div
                className="gradient-primary h-3 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--muted)] mt-2">
              <span>15 jan 2025</span>
              <span>15 fév 2025</span>
            </div>
          </div>
        </div>

        {/* Usage stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Conversations</p>
                <p className="text-xl font-bold">15<span className="text-sm text-[var(--muted)]">/20</span></p>
              </div>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-2">
              <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--secondary)]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Messages</p>
                <p className="text-xl font-bold">156<span className="text-sm text-[var(--muted)]">/∞</span></p>
              </div>
            </div>
            <div className="w-full bg-[var(--border)] rounded-full h-2">
              <div className="bg-[var(--secondary)] h-2 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-[var(--muted)]">Économisé ce mois</p>
                <p className="text-xl font-bold text-[var(--success)]">12.50€</p>
              </div>
            </div>
            <p className="text-xs text-[var(--muted)]">vs. paiement à l&apos;usage</p>
          </div>
        </div>

        {/* Plans */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">Choisir un plan</h2>
            <div className="flex items-center gap-2 bg-[var(--card-bg)] rounded-xl p-1 border border-[var(--border)]">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Annuel
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  billingCycle === "yearly"
                    ? "bg-white/20"
                    : "bg-[var(--success)]/10 text-[var(--success)]"
                }`}>
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-[var(--card-bg)] rounded-2xl border-2 p-6 transition-all ${
                  plan.current
                    ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      Plus populaire
                    </span>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium px-2 py-1 rounded-full">
                      Actuel
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {billingCycle === "yearly"
                      ? plan.price === "0€"
                        ? "0€"
                        : `${(parseFloat(plan.price.replace("€", "")) * 0.8).toFixed(2)}€`
                      : plan.price}
                  </span>
                  <span className="text-[var(--muted)]">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-[var(--success)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <svg className="w-5 h-5 text-[var(--muted)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {limitation}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                    plan.current
                      ? "bg-[var(--border)] text-[var(--muted)] cursor-not-allowed"
                      : plan.popular
                      ? "gradient-primary text-white hover:opacity-90"
                      : "border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? "Plan actuel" : "Choisir ce plan"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-bold mb-4">Historique des paiements</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 text-sm font-medium text-[var(--muted)]">Date</th>
                  <th className="text-left py-3 text-sm font-medium text-[var(--muted)]">Description</th>
                  <th className="text-left py-3 text-sm font-medium text-[var(--muted)]">Montant</th>
                  <th className="text-left py-3 text-sm font-medium text-[var(--muted)]">Statut</th>
                  <th className="text-right py-3 text-sm font-medium text-[var(--muted)]">Facture</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "15 jan 2025", desc: "Abonnement Premium - Janvier", amount: "9.99€", status: "paid" },
                  { date: "15 déc 2024", desc: "Abonnement Premium - Décembre", amount: "9.99€", status: "paid" },
                  { date: "15 nov 2024", desc: "Abonnement Premium - Novembre", amount: "9.99€", status: "paid" },
                ].map((payment, index) => (
                  <tr key={index} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-4 text-sm">{payment.date}</td>
                    <td className="py-4 text-sm">{payment.desc}</td>
                    <td className="py-4 text-sm font-medium">{payment.amount}</td>
                    <td className="py-4">
                      <span className="bg-[var(--success)]/10 text-[var(--success)] text-xs font-medium px-2 py-1 rounded-full">
                        Payé
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[var(--primary)] text-sm hover:underline">
                        Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
