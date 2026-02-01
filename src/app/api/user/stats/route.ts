import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

// GET /api/user/stats?userId=xxx - Obtenir les statistiques de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const stats = await UserService.getStats(userId);

    if (!stats) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Erreur récupération stats:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
