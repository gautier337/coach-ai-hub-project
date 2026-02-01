import { NextRequest, NextResponse } from "next/server";
import { SubscriptionService } from "@/services/subscription.service";
import { PLAN_CONFIG } from "@/types/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const subscription = await SubscriptionService.getByUserId(userId);

    if (!subscription) {
      return NextResponse.json(
        { error: "Abonnement non trouvé" },
        { status: 404 }
      );
    }

    const remainingCredits = await SubscriptionService.getRemainingCredits(
      userId
    );

    // Vérifier si l'essai est expiré
    await SubscriptionService.checkTrialExpiration(userId);

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
  } catch (error) {
    console.error("Erreur récupération abonnement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'abonnement" },
      { status: 500 }
    );
  }
}
