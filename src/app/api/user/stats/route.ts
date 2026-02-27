import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const stats = await UserService.getStats(userId!);

    if (!stats) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ stats });
  } catch (err) {
    console.error("Erreur récupération stats:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
