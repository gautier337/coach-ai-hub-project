import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, plan } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    if (!plan || !["BASIC", "PREMIUM"].includes(plan)) {
      return NextResponse.json(
        { error: "Plan invalide. Choisir BASIC ou PREMIUM" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await StripeService.createCheckoutSession(
      userId,
      plan,
      `${baseUrl}/subscription?success=true`,
      `${baseUrl}/subscription?canceled=true`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur création checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
