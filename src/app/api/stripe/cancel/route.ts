import { NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function POST() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    await StripeService.cancelSubscription(userId!);

    return NextResponse.json({
      success: true,
      message: "Abonnement annulé. Il restera actif jusqu'à la fin de la période.",
    });
  } catch (err) {
    console.error("Erreur annulation:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
