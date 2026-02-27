import { NextResponse } from "next/server";
import { SubscriptionService } from "@/services/subscription.service";
import { PLAN_CONFIG } from "@/types/database";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const subscription = await SubscriptionService.getByUserId(userId!);

    if (!subscription) {
      return NextResponse.json(
        { error: "Abonnement non trouvé" },
        { status: 404 }
      );
    }

    const remainingCredits = await SubscriptionService.getRemainingCredits(userId!);
    await SubscriptionService.checkTrialExpiration(userId!);

    const planConfig = PLAN_CONFIG[subscription.plan];

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        monthlyCredits: subscription.monthlyCredits,
        creditsUsed: subscription.creditsUsed,
        remainingCredits,
        trialEndDate: subscription.trialEndDate,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
      planDetails: planConfig,
    });
  } catch (err) {
    console.error("Erreur récupération abonnement:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'abonnement" },
      { status: 500 }
    );
  }
}
