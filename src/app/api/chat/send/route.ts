import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { UserService } from "@/services/user.service";
import { getOpenAI, SYSTEM_PROMPT } from "@/lib/openai";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  const { userId, error } = await getAuthenticatedUser();
  if (error) return error;

  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "message est requis et ne peut pas être vide" },
        { status: 400 }
      );
    }

    const hasCredits = await UserService.hasCredits(userId!);
    if (!hasCredits) {
      return NextResponse.json(
        {
          error: "Crédits insuffisants",
          code: "NO_CREDITS",
          message:
            "Vous avez épuisé vos crédits de chat. Passez à un abonnement supérieur pour continuer.",
        },
        { status: 402 }
      );
    }

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = await ChatService.createSession({ userId: userId! });
      currentSessionId = newSession.id;
    } else {
      const isOwner = await ChatService.isSessionOwner(currentSessionId, userId!);
      if (!isOwner) {
        return NextResponse.json(
          { error: "Session non autorisée" },
          { status: 403 }
        );
      }
    }

    const userMessage = await ChatService.addMessage({
      chatSessionId: currentSessionId,
      role: "USER",
      content: message.trim(),
    });

    const history = await ChatService.getFormattedHistory(currentSessionId);

    const openaiMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history,
    ];

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantContent =
      completion.choices[0]?.message?.content ||
      "Désolé, je n'ai pas pu générer une réponse.";

    const assistantMessage = await ChatService.addMessage({
      chatSessionId: currentSessionId,
      role: "ASSISTANT",
      content: assistantContent,
      metadata: {
        model: "gpt-4o-mini",
        tokens: {
          prompt: completion.usage?.prompt_tokens,
          completion: completion.usage?.completion_tokens,
          total: completion.usage?.total_tokens,
        },
      },
    });

    await UserService.decrementCredits(userId!);

    const session = await ChatService.getSessionById(currentSessionId);
    if (session && session.messages.length <= 2) {
      await ChatService.generateTitle(currentSessionId);
    }

    const user = await UserService.findById(userId!);
    const remainingCredits = user?.subscription
      ? user.subscription.plan === "PREMIUM"
        ? -1
        : user.subscription.monthlyCredits - user.subscription.creditsUsed
      : user?.chatCredits ?? 0;

    return NextResponse.json({
      sessionId: currentSessionId,
      userMessage: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        createdAt: userMessage.createdAt,
      },
      assistantMessage: {
        id: assistantMessage.id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        createdAt: assistantMessage.createdAt,
      },
      remainingCredits,
    });
  } catch (err) {
    console.error("Erreur envoi message:", err);

    if (err instanceof Error && err.message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "Configuration OpenAI manquante" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}
