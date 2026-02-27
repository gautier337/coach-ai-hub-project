import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function GET() {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const sessions = await ChatService.getUserSessions(userId!);

    const formattedSessions = sessions.map((session) => ({
      id: session.id,
      title: session.title,
      lastMessage: session.messages[0]?.content.slice(0, 100) || null,
      messageCount: session._count.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (err) {
    console.error("Erreur récupération sessions:", err);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const body = await request.json();
    const { title } = body;

    const session = await ChatService.createSession({
      userId: userId!,
      title: title || "Nouvelle conversation",
    });

    return NextResponse.json({
      session: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
      },
    });
  } catch (err) {
    console.error("Erreur création session:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}
