import Stripe from "stripe";
import { stripe, STRIPE_PRICES, PLAN_DETAILS } from "@/lib/stripe";
import { SubscriptionService } from "./subscription.service";
import { UserService } from "./user.service";
import { SubscriptionPlan } from "@/types/database";

export class StripeService {
  /**
   * Créer ou récupérer un client Stripe
   */
  static async getOrCreateCustomer(userId: string): Promise<string> {
    const user = await UserService.findById(userId);
    if (!user) throw new Error("Utilisateur non trouvé");

    // Si l'utilisateur a déjà un customer ID Stripe
    if (user.subscription?.stripeCustomerId) {
      return user.subscription.stripeCustomerId;
    }

    // Créer un nouveau client Stripe
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: {
        userId: user.id,
      },
    });

    // Mettre à jour l'abonnement avec le customer ID
    await SubscriptionService.update(userId, {
      stripeCustomerId: customer.id,
    });

    return customer.id;
  }

  /**
   * Créer une session de checkout pour un abonnement
   */
  static async createCheckoutSession(
    userId: string,
    plan: "BASIC" | "PREMIUM",
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    const customerId = await this.getOrCreateCustomer(userId);
    const priceId = STRIPE_PRICES[plan];

    if (!priceId) {
      throw new Error(`Prix Stripe non configuré pour le plan ${plan}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        trial_period_days: 3, // 3 jours d'essai gratuit
        metadata: {
          userId,
          plan,
        },
      },
      metadata: {
        userId,
        plan,
      },
    });

    return session;
  }

  /**
   * Créer un portail client pour gérer l'abonnement
   */
  static async createPortalSession(
    userId: string,
    returnUrl: string
  ): Promise<Stripe.BillingPortal.Session> {
    const subscription = await SubscriptionService.getByUserId(userId);

    if (!subscription?.stripeCustomerId) {
      throw new Error("Aucun abonnement Stripe trouvé");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl,
    });

    return session;
  }

  /**
   * Annuler un abonnement à la fin de la période
   */
  static async cancelSubscription(userId: string): Promise<void> {
    const subscription = await SubscriptionService.getByUserId(userId);

    if (!subscription?.stripeSubscriptionId) {
      throw new Error("Aucun abonnement Stripe trouvé");
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await SubscriptionService.cancel(userId);
  }

  /**
   * Réactiver un abonnement annulé
   */
  static async reactivateSubscription(userId: string): Promise<void> {
    const subscription = await SubscriptionService.getByUserId(userId);

    if (!subscription?.stripeSubscriptionId) {
      throw new Error("Aucun abonnement Stripe trouvé");
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await SubscriptionService.reactivate(userId);
  }

  /**
   * Gérer les événements webhook Stripe
   */
  static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await this.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await this.handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await this.handleInvoicePaymentFailed(
          event.data.object as Stripe.Invoice
        );
        break;

      default:
        console.log(`Événement Stripe non géré: ${event.type}`);
    }
  }

  /**
   * Gérer la fin d'un checkout réussi
   */
  private static async handleCheckoutCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as "BASIC" | "PREMIUM";

    if (!userId || !plan) {
      console.error("Metadata manquante dans la session checkout");
      return;
    }

    // Récupérer les détails de l'abonnement
    if (session.subscription) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const periodStart =
        "current_period_start" in subscription
          ? (subscription.current_period_start as number)
          : Math.floor(Date.now() / 1000);
      const periodEnd =
        "current_period_end" in subscription
          ? (subscription.current_period_end as number)
          : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await SubscriptionService.activate(userId, plan, {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id ?? "",
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
      });
    }
  }

  /**
   * Gérer les mises à jour d'abonnement
   */
  private static async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      // Chercher par customer ID
      const sub = await SubscriptionService.getByStripeSubscriptionId(
        subscription.id
      );
      if (!sub) return;

      await this.updateSubscriptionFromStripe(sub.userId, subscription);
    } else {
      await this.updateSubscriptionFromStripe(userId, subscription);
    }
  }

  /**
   * Mettre à jour l'abonnement local depuis Stripe
   */
  private static async updateSubscriptionFromStripe(
    userId: string,
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    const plan =
      (stripeSubscription.metadata?.plan as "BASIC" | "PREMIUM") ?? "BASIC";

    let status: "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIAL" = "ACTIVE";

    if (stripeSubscription.status === "trialing") {
      status = "TRIAL";
    } else if (stripeSubscription.status === "past_due") {
      status = "PAST_DUE";
    } else if (stripeSubscription.cancel_at_period_end) {
      status = "CANCELED";
    }

    const periodStart =
      "current_period_start" in stripeSubscription
        ? (stripeSubscription.current_period_start as number)
        : Math.floor(Date.now() / 1000);
    const periodEnd =
      "current_period_end" in stripeSubscription
        ? (stripeSubscription.current_period_end as number)
        : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

    await SubscriptionService.update(userId, {
      plan,
      status,
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end ?? false,
      monthlyCredits: PLAN_DETAILS[plan]?.credits ?? 50,
    });
  }

  /**
   * Gérer la suppression d'un abonnement
   */
  private static async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    const sub = await SubscriptionService.getByStripeSubscriptionId(
      subscription.id
    );

    if (sub) {
      await SubscriptionService.expire(sub.userId);
    }
  }

  /**
   * Gérer un paiement de facture réussi (renouvellement)
   */
  private static async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice
  ): Promise<void> {
    // Accès à la subscription via parent ou subscription_details
    const invoiceData = invoice as unknown as Record<string, unknown>;
    const subscriptionId =
      (invoiceData.subscription as string) ??
      (invoiceData.parent as { subscription_details?: { subscription?: string } })
        ?.subscription_details?.subscription;

    if (!subscriptionId) return;

    const sub =
      await SubscriptionService.getByStripeSubscriptionId(subscriptionId);

    if (sub && invoice.billing_reason === "subscription_cycle") {
      // Renouvellement mensuel - reset des crédits
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const periodStart =
        "current_period_start" in subscription
          ? (subscription.current_period_start as number)
          : Math.floor(Date.now() / 1000);
      const periodEnd =
        "current_period_end" in subscription
          ? (subscription.current_period_end as number)
          : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

      await SubscriptionService.renew(
        sub.userId,
        new Date(periodStart * 1000),
        new Date(periodEnd * 1000)
      );
    }
  }

  /**
   * Gérer un paiement de facture échoué
   */
  private static async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice
  ): Promise<void> {
    // Accès à la subscription via parent ou subscription_details
    const invoiceData = invoice as unknown as Record<string, unknown>;
    const subscriptionId =
      (invoiceData.subscription as string) ??
      (invoiceData.parent as { subscription_details?: { subscription?: string } })
        ?.subscription_details?.subscription;

    if (!subscriptionId) return;

    const sub =
      await SubscriptionService.getByStripeSubscriptionId(subscriptionId);

    if (sub) {
      await SubscriptionService.update(sub.userId, {
        status: "PAST_DUE",
      });
    }
  }

  /**
   * Vérifier la signature du webhook
   */
  static constructWebhookEvent(
    payload: string | Buffer,
    signature: string
  ): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
    }

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
