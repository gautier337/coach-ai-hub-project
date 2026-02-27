import { NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function POST() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    await StripeService.reactivateSubscription(userId!);

    return NextResponse.json({
      success: true,
      message: "Abonnement réactivé avec succès.",
    });
  } catch (err) {
    console.error("Erreur réactivation:", err);
    return NextResponse.json(
      { error: "Erreur lors de la réactivation de l'abonnement" },
      { status: 500 }
    );
  }
}
