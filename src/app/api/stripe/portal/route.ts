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

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    const session = await StripeService.createPortalSession(
      userId,
      `${baseUrl}/subscription`
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur création portail:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du portail de gestion" },
      { status: 500 }
    );
  }
}
