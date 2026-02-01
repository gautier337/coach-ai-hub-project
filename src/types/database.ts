// Types dérivés du schéma Prisma pour utilisation dans le frontend/backend

export type SubscriptionStatus =
  | "TRIAL"
  | "ACTIVE"
  | "CANCELED"
  | "EXPIRED"
  | "PAST_DUE";

export type SubscriptionPlan = "FREE" | "BASIC" | "PREMIUM";

export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

// User
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  googleId: string | null;
  chatCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription
export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  monthlyCredits: number;
  creditsUsed: number;
  trialStartDate: Date | null;
  trialEndDate: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ChatSession
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Message
export interface Message {
  id: string;
  chatSessionId: string;
  role: MessageRole;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

// Types avec relations
export interface UserWithSubscription extends User {
  subscription: Subscription | null;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: Message[];
}

export interface UserWithAll extends User {
  subscription: Subscription | null;
  chatSessions: ChatSessionWithMessages[];
}

// DTOs pour les API
export interface CreateUserDTO {
  email: string;
  name?: string;
  image?: string;
  googleId?: string;
}

export interface CreateChatSessionDTO {
  userId: string;
  title?: string;
}

export interface CreateMessageDTO {
  chatSessionId: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionDTO {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  monthlyCredits?: number;
  creditsUsed?: number;
  trialStartDate?: Date;
  trialEndDate?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}

// Configuration des plans
export const PLAN_CONFIG = {
  FREE: {
    name: "Gratuit",
    credits: 5,
    price: 0,
    features: ["5 messages par mois", "Historique limité"],
  },
  BASIC: {
    name: "Basique",
    credits: 50,
    price: 9.99,
    features: [
      "50 messages par mois",
      "Historique complet",
      "Support prioritaire",
    ],
  },
  PREMIUM: {
    name: "Premium",
    credits: -1, // -1 = illimité
    price: 19.99,
    features: [
      "Messages illimités",
      "Historique complet",
      "Support prioritaire",
      "Accès anticipé aux nouvelles fonctionnalités",
    ],
  },
} as const;

// Durée de l'essai gratuit en jours
export const TRIAL_DURATION_DAYS = 3;
