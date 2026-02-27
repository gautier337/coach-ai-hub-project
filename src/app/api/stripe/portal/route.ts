import { NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function POST() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await StripeService.createPortalSession(
      userId!,
      `${baseUrl}/subscription`
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erreur création portail:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du portail de gestion" },
      { status: 500 }
    );
  }
}
