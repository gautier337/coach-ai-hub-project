import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { CreateChatSessionDTO, CreateMessageDTO } from "@/types/database";

export class ChatService {
  /**
   * Créer une nouvelle session de chat
   */
  static async createSession(data: CreateChatSessionDTO) {
    return prisma.chatSession.create({
      data: {
        userId: data.userId,
        title: data.title ?? "Nouvelle conversation",
      },
      include: {
        messages: true,
      },
    });
  }

  /**
   * Obtenir une session par ID
   */
  static async getSessionById(sessionId: string) {
    return prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  /**
   * Obtenir toutes les sessions d'un utilisateur
   */
  static async getUserSessions(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Dernier message pour l'aperçu
        },
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  /**
   * Mettre à jour le titre d'une session
   */
  static async updateSessionTitle(sessionId: string, title: string) {
    return prisma.chatSession.update({
      where: { id: sessionId },
      data: { title },
    });
  }

  /**
   * Supprimer une session
   */
  static async deleteSession(sessionId: string) {
    return prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }

  /**
   * Ajouter un message à une session
   */
  static async addMessage(data: CreateMessageDTO) {
    // Mettre à jour le timestamp de la session
    await prisma.chatSession.update({
      where: { id: data.chatSessionId },
      data: { updatedAt: new Date() },
    });

    return prisma.message.create({
      data: {
        chatSessionId: data.chatSessionId,
        role: data.role,
        content: data.content,
        metadata: data.metadata
          ? (data.metadata as Prisma.InputJsonValue)
          : undefined,
      },
    });
  }

  /**
   * Obtenir les messages d'une session
   */
  static async getSessionMessages(sessionId: string, limit?: number) {
    return prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: "asc" },
      take: limit,
    });
  }

  /**
   * Obtenir l'historique formaté pour l'API OpenAI
   */
  static async getFormattedHistory(sessionId: string) {
    const messages = await prisma.message.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        role: true,
        content: true,
      },
    });

    return messages.map((msg) => ({
      role: msg.role.toLowerCase() as "user" | "assistant" | "system",
      content: msg.content,
    }));
  }

  /**
   * Générer un titre automatique basé sur le premier message
   */
  static async generateTitle(sessionId: string) {
    const firstMessage = await prisma.message.findFirst({
      where: {
        chatSessionId: sessionId,
        role: "USER",
      },
      orderBy: { createdAt: "asc" },
    });

    if (firstMessage) {
      // Prendre les 50 premiers caractères comme titre
      const title =
        firstMessage.content.slice(0, 50) +
        (firstMessage.content.length > 50 ? "..." : "");

      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { title },
      });

      return title;
    }

    return null;
  }

  /**
   * Compter le nombre total de messages d'un utilisateur
   */
  static async countUserMessages(userId: string) {
    return prisma.message.count({
      where: {
        chatSession: { userId },
        role: "USER",
      },
    });
  }

  /**
   * Vérifier si une session appartient à un utilisateur
   */
  static async isSessionOwner(
    sessionId: string,
    userId: string
  ): Promise<boolean> {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    });

    return session?.userId === userId;
  }
}
