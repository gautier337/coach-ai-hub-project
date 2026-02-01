import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { UserService } from "@/services/user.service";
import { getOpenAI, SYSTEM_PROMPT } from "@/lib/openai";

// POST /api/chat/send - Envoyer un message et obtenir une réponse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, message } = body;

    // Validation des paramètres
    if (!userId) {
      return NextResponse.json(
        { error: "userId est requis" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json(
        { error: "message est requis et ne peut pas être vide" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a des crédits disponibles
    const hasCredits = await UserService.hasCredits(userId);
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

    // Créer une nouvelle session si nécessaire
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = await ChatService.createSession({ userId });
      currentSessionId = newSession.id;
    } else {
      // Vérifier que la session appartient à l'utilisateur
      const isOwner = await ChatService.isSessionOwner(currentSessionId, userId);
      if (!isOwner) {
        return NextResponse.json(
          { error: "Session non autorisée" },
          { status: 403 }
        );
      }
    }

    // Sauvegarder le message de l'utilisateur
    const userMessage = await ChatService.addMessage({
      chatSessionId: currentSessionId,
      role: "USER",
      content: message.trim(),
    });

    // Récupérer l'historique pour le contexte
    const history = await ChatService.getFormattedHistory(currentSessionId);

    // Préparer les messages pour OpenAI
    const openaiMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history,
    ];

    // Appeler l'API OpenAI
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

    // Sauvegarder la réponse de l'assistant
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

    // Décrémenter les crédits de l'utilisateur
    await UserService.decrementCredits(userId);

    // Générer un titre si c'est le premier message
    const session = await ChatService.getSessionById(currentSessionId);
    if (session && session.messages.length <= 2) {
      await ChatService.generateTitle(currentSessionId);
    }

    // Obtenir les crédits restants
    const user = await UserService.findById(userId);
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
  } catch (error) {
    console.error("Erreur envoi message:", error);

    if (error instanceof Error && error.message.includes("OPENAI_API_KEY")) {
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
