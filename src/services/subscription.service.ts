import prisma from "@/lib/prisma";
import {
  UpdateSubscriptionDTO,
  SubscriptionPlan,
  PLAN_CONFIG,
} from "@/types/database";

export class SubscriptionService {
  /**
   * Obtenir l'abonnement d'un utilisateur
   */
  static async getByUserId(userId: string) {
    return prisma.subscription.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  /**
   * Obtenir l'abonnement par Stripe Customer ID
   */
  static async getByStripeCustomerId(stripeCustomerId: string) {
    return prisma.subscription.findUnique({
      where: { stripeCustomerId },
      include: { user: true },
    });
  }

  /**
   * Obtenir l'abonnement par Stripe Subscription ID
   */
  static async getByStripeSubscriptionId(stripeSubscriptionId: string) {
    return prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
      include: { user: true },
    });
  }

  /**
   * Mettre à jour un abonnement
   */
  static async update(userId: string, data: UpdateSubscriptionDTO) {
    return prisma.subscription.update({
      where: { userId },
      data,
      include: { user: true },
    });
  }

  /**
   * Activer un abonnement après paiement Stripe
   */
  static async activate(
    userId: string,
    plan: SubscriptionPlan,
    stripeData: {
      stripeCustomerId: string;
      stripeSubscriptionId: string;
      stripePriceId: string;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
    }
  ) {
    const monthlyCredits = PLAN_CONFIG[plan].credits;

    return prisma.subscription.update({
      where: { userId },
      data: {
        plan,
        status: "ACTIVE",
        monthlyCredits,
        creditsUsed: 0,
        ...stripeData,
      },
      include: { user: true },
    });
  }

  /**
   * Annuler un abonnement (à la fin de la période)
   */
  static async cancel(userId: string) {
    return prisma.subscription.update({
      where: { userId },
      data: {
        status: "CANCELED",
        cancelAtPeriodEnd: true,
      },
      include: { user: true },
    });
  }

  /**
   * Réactiver un abonnement annulé
   */
  static async reactivate(userId: string) {
    return prisma.subscription.update({
      where: { userId },
      data: {
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
      },
      include: { user: true },
    });
  }

  /**
   * Expirer un abonnement
   */
  static async expire(userId: string) {
    return prisma.subscription.update({
      where: { userId },
      data: {
        plan: "FREE",
        status: "EXPIRED",
        monthlyCredits: PLAN_CONFIG.FREE.credits,
        creditsUsed: 0,
        stripeSubscriptionId: null,
        stripePriceId: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
      include: { user: true },
    });
  }

  /**
   * Renouveler un abonnement (nouveau cycle de facturation)
   */
  static async renew(
    userId: string,
    currentPeriodStart: Date,
    currentPeriodEnd: Date
  ) {
    return prisma.subscription.update({
      where: { userId },
      data: {
        status: "ACTIVE",
        creditsUsed: 0, // Reset des crédits utilisés
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
      include: { user: true },
    });
  }

  /**
   * Vérifier si l'essai est expiré
   */
  static async checkTrialExpiration(userId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.status !== "TRIAL") {
      return false;
    }

    if (subscription.trialEndDate && new Date() > subscription.trialEndDate) {
      // L'essai est expiré, mettre à jour le statut
      await prisma.subscription.update({
        where: { userId },
        data: { status: "EXPIRED" },
      });
      return true;
    }

    return false;
  }

  /**
   * Obtenir les crédits restants
   */
  static async getRemainingCredits(userId: string): Promise<number> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) return 0;

    // Premium = illimité
    if (subscription.plan === "PREMIUM") {
      return -1;
    }

    return subscription.monthlyCredits - subscription.creditsUsed;
  }
}
