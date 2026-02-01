import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";

// GET /api/chat/history?userId=xxx&limit=50 - Obtenir l'historique complet des chats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    const sessions = await ChatService.getUserSessions(userId);

    // Calculer les statistiques
    const totalMessages = await ChatService.countUserMessages(userId);

    // Formater pour l'API
    const history = sessions.slice(0, limit).map((session) => ({
      id: session.id,
      title: session.title,
      preview: session.messages[0]?.content.slice(0, 150) || null,
      messageCount: session._count.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    return NextResponse.json({
      history,
      stats: {
        totalSessions: sessions.length,
        totalMessages,
      },
    });
  } catch (error) {
    console.error("Erreur récupération historique:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
}
