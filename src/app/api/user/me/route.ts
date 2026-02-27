import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const user = await UserService.findById(userId!);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        chatCredits: user.chatCredits,
        subscription: user.subscription,
      },
    });
  } catch (err) {
    console.error("Erreur user/me:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
