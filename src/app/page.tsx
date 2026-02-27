import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Coach AI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="gradient-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                Commencer gratuitement
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium px-4 py-2 rounded-full mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
              </span>
              Essai gratuit de 3 jours
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Votre coach personnel
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] bg-clip-text text-transparent"> propulse par l&apos;IA</span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto">
              Obtenez des conseils personnalises en dating et dans votre vie quotidienne.
              Disponible 24/7, confidentiel et bienveillant.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto gradient-primary text-white font-medium px-8 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto border border-[var(--border)] font-medium px-8 py-4 rounded-xl hover:bg-[var(--card-bg)] transition-colors text-lg"
              >
                En savoir plus
              </Link>
            </div>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 gradient-bg opacity-10 blur-3xl rounded-full"></div>
            <div className="relative bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="bg-[var(--border)] px-4 py-3 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--accent)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[var(--warning)]"></div>
                  <div className="w-3 h-3 rounded-full bg-[var(--success)]"></div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <div className="gradient-primary text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs">
                    <p className="text-sm">J&apos;ai un rendez-vous ce soir et je suis stresse...</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl rounded-bl-md px-4 py-3 max-w-md">
                    <p className="text-sm">Je comprends ! C&apos;est tout a fait normal. Voici quelques conseils pour te sentir plus confiant : sois toi-meme, prepare quelques sujets de conversation, et n&apos;oublie pas de respirer ! Tu vas assurer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--card-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pourquoi Coach AI ?</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Une intelligence artificielle conçue pour vous accompagner dans tous les aspects de votre vie personnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Disponible 24/7",
                description: "Posez vos questions à tout moment, jour et nuit. Votre coach est toujours là pour vous.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "100% Confidentiel",
                description: "Vos conversations restent privées. Parlez librement sans jugement.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Conseils Personnalises",
                description: "Notre IA s'adapte à votre situation pour des conseils vraiment pertinents.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[var(--background)] rounded-2xl border border-[var(--border)] p-8 hover:border-[var(--primary)]/50 transition-colors"
              >
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              Commencez gratuitement, evoluez selon vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Gratuit",
                price: "0",
                features: ["5 conversations/mois", "20 messages/conv.", "Conseils de base"],
                popular: false,
              },
              {
                name: "Premium",
                price: "9.99",
                features: ["20 conversations/mois", "Messages illimites", "Conseils personnalises", "3 jours d'essai gratuit"],
                popular: true,
              },
              {
                name: "Illimite",
                price: "19.99",
                features: ["Conversations illimitees", "Messages illimites", "Support VIP 24/7"],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative bg-[var(--card-bg)] rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
                    : "border-[var(--border)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      Plus populaire
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-[var(--muted)]">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 px-4 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? "gradient-primary text-white hover:opacity-90"
                      : "border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-primary rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à transformer votre vie ?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui ont déjà franchi le pas.
              3 jours d'essai gratuit, sans engagement.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-[var(--primary)] font-medium px-8 py-4 rounded-xl hover:bg-white/90 transition-colors text-lg"
            >
              Commencer maintenant
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-bold">Coach AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
              <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-sm text-[var(--muted)]">
              2026 Coach AI. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
