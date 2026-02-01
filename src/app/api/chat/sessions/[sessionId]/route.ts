import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";

type RouteParams = { params: Promise<{ sessionId: string }> };

// GET /api/chat/sessions/[sessionId] - Obtenir une session avec ses messages
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;

    const session = await ChatService.getSessionById(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messages: session.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Erreur récupération session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la session" },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/sessions/[sessionId] - Mettre à jour le titre
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "title est requis" },
        { status: 400 }
      );
    }

    const session = await ChatService.updateSessionTitle(sessionId, title);

    return NextResponse.json({
      session: {
        id: session.id,
        title: session.title,
      },
    });
  } catch (error) {
    console.error("Erreur mise à jour session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la session" },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/sessions/[sessionId] - Supprimer une session
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { sessionId } = await params;

    await ChatService.deleteSession(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression session:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la session" },
      { status: 500 }
    );
  }
}
