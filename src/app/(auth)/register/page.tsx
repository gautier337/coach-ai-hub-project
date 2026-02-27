"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-2xl font-bold">Coach AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">
            Commencez votre transformation dès aujourd&apos;hui
          </h1>
          <p className="text-lg text-white/80 mb-8">
            Rejoignez des milliers d&apos;utilisateurs qui ont déjà amélioré leur vie
            grâce à nos conseils personnalisés.
          </p>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                👤
              </div>
              <div>
                <p className="font-medium">Essai gratuit</p>
                <p className="text-sm text-white/70">3 jours sans engagement</p>
              </div>
            </div>
            <p className="text-white/80 text-sm italic">
              &quot;Coach AI m&apos;a aidé à reprendre confiance en moi. Les conseils sont
              vraiment personnalisés et pertinents !&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">Coach AI</span>
          </div>

          <div className="bg-[var(--card-bg)] rounded-2xl shadow-lg border border-[var(--border)] p-8">
            <h2 className="text-2xl font-bold text-center mb-2">Créer un compte</h2>
            <p className="text-[var(--muted)] text-center mb-8">
              Commencez avec 3 jours d&apos;essai gratuit
            </p>

            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[var(--border)] rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              S&apos;inscrire avec Google
            </button>

            <p className="text-center text-[var(--muted)] text-sm mt-6">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-[var(--muted)] mt-6">
            En continuant, vous acceptez nos{" "}
            <Link href="/terms" className="underline hover:text-[var(--primary)]">
              Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline hover:text-[var(--primary)]">
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
