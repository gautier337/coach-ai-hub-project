import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";

// GET /api/chat/sessions?userId=xxx - Obtenir toutes les sessions d'un utilisateur
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

    const sessions = await ChatService.getUserSessions(userId);

    // Formater les sessions pour l'API
    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      title: session.title,
      lastMessage: session.messages[0]?.content.slice(0, 100) || null,
      messageCount: session._count.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error("Erreur récupération sessions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sessions" },
      { status: 500 }
    );
  }
}

// POST /api/chat/sessions - Créer une nouvelle session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const session = await ChatService.createSession({
      userId,
      title: title || "Nouvelle conversation",
    });

    return NextResponse.json({
      session: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur création session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}
