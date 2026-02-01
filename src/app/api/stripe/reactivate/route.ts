import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    await StripeService.reactivateSubscription(userId);

    return NextResponse.json({
      success: true,
      message: "Abonnement réactivé avec succès.",
    });
  } catch (error) {
    console.error("Erreur réactivation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la réactivation de l'abonnement" },
      { status: 500 }
    );
  }
}
