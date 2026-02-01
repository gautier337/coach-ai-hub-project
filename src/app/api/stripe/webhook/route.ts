import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature Stripe manquante" },
        { status: 400 }
      );
    }

    // Vérifier et construire l'événement
    const event = StripeService.constructWebhookEvent(body, signature);

    // Gérer l'événement
    await StripeService.handleWebhookEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Stripe:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur webhook inconnue" },
      { status: 500 }
    );
  }
}
