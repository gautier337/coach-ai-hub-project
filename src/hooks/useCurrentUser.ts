"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Subscription {
  plan: string;
  status: string;
  monthlyCredits: number;
  creditsUsed: number;
  trialEndDate: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

interface CurrentUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  chatCredits: number;
  subscription: Subscription | null;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/user/me");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        console.error("Impossible de charger l'utilisateur");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  const remainingCredits =
    user?.subscription?.plan === "PREMIUM"
      ? -1
      : (user?.subscription?.monthlyCredits ?? 5) -
        (user?.subscription?.creditsUsed ?? 0);

  return { user, loading, remainingCredits };
}
