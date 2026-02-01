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

    await StripeService.cancelSubscription(userId);

    return NextResponse.json({
      success: true,
      message: "Abonnement annulé. Il restera actif jusqu'à la fin de la période.",
    });
  } catch (error) {
    console.error("Erreur annulation:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'annulation de l'abonnement" },
      { status: 500 }
    );
  }
}
