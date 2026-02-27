import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const body = await request.json();
    const { plan } = body;

    if (!plan || !["BASIC", "PREMIUM"].includes(plan)) {
      return NextResponse.json(
        { error: "Plan invalide. Choisir BASIC ou PREMIUM" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await StripeService.createCheckoutSession(
      userId!,
      plan,
      `${baseUrl}/subscription?success=true`,
      `${baseUrl}/subscription?canceled=true`
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erreur création checkout:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
