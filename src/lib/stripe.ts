import Stripe from "stripe";

// Lazy initialization pour éviter les erreurs au build
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not defined");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export pour compatibilité
export const stripe = {
  get customers() {
    return getStripe().customers;
  },
  get checkout() {
    return getStripe().checkout;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
  get subscriptions() {
    return getStripe().subscriptions;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// Configuration des prix
export const STRIPE_PRICES = {
  BASIC: process.env.STRIPE_PRICE_BASIC || "",
  PREMIUM: process.env.STRIPE_PRICE_PREMIUM || "",
} as const;

// Configuration des plans
export const PLAN_DETAILS: Record<
  "BASIC" | "PREMIUM",
  { name: string; credits: number; price: number }
> = {
  BASIC: {
    name: "Basique",
    credits: 50,
    price: 9.99,
  },
  PREMIUM: {
    name: "Premium",
    credits: -1, // illimité
    price: 19.99,
  },
};

export default stripe;
