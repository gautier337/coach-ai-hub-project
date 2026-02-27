import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const sessions = await ChatService.getUserSessions(userId!);
    const totalMessages = await ChatService.countUserMessages(userId!);

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
  } catch (err) {
    console.error("Erreur récupération historique:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
}
