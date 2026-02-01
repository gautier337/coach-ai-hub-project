import prisma from "@/lib/prisma";
import { CreateUserDTO, TRIAL_DURATION_DAYS } from "@/types/database";

export class UserService {
  /**
   * Créer un nouvel utilisateur avec son abonnement d'essai
   */
  static async createUser(data: CreateUserDTO) {
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DURATION_DAYS);

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.image,
        googleId: data.googleId,
        chatCredits: 5,
        subscription: {
          create: {
            plan: "FREE",
            status: "TRIAL",
            monthlyCredits: 5,
            trialStartDate,
            trialEndDate,
          },
        },
      },
      include: {
        subscription: true,
      },
    });
  }

  /**
   * Trouver un utilisateur par email
   */
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
      },
    });
  }

  /**
   * Trouver un utilisateur par Google ID
   */
  static async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
      include: {
        subscription: true,
      },
    });
  }

  /**
   * Trouver un utilisateur par ID
   */
  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        chatSessions: {
          orderBy: { updatedAt: "desc" },
          take: 10,
        },
      },
    });
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async updateUser(id: string, data: Partial<CreateUserDTO>) {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        subscription: true,
      },
    });
  }

  /**
   * Décrémenter les crédits de chat
   */
  static async decrementCredits(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) throw new Error("Utilisateur non trouvé");

    // Si premium avec crédits illimités, ne pas décrémenter
    if (user.subscription?.plan === "PREMIUM") {
      return user;
    }

    // Décrémenter les crédits utilisés dans l'abonnement
    if (user.subscription) {
      await prisma.subscription.update({
        where: { userId },
        data: {
          creditsUsed: { increment: 1 },
        },
      });
    }

    // Décrémenter les crédits de l'utilisateur
    return prisma.user.update({
      where: { id: userId },
      data: {
        chatCredits: { decrement: 1 },
      },
      include: {
        subscription: true,
      },
    });
  }

  /**
   * Vérifier si l'utilisateur a des crédits disponibles
   */
  static async hasCredits(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) return false;

    // Premium = illimité
    if (user.subscription?.plan === "PREMIUM") {
      return true;
    }

    // Vérifier les crédits
    if (user.subscription) {
      const remainingCredits =
        user.subscription.monthlyCredits - user.subscription.creditsUsed;
      return remainingCredits > 0;
    }

    return user.chatCredits > 0;
  }

  /**
   * Obtenir les statistiques de l'utilisateur
   */
  static async getStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        _count: {
          select: {
            chatSessions: true,
          },
        },
      },
    });

    if (!user) return null;

    const totalMessages = await prisma.message.count({
      where: {
        chatSession: {
          userId,
        },
        role: "USER",
      },
    });

    const remainingCredits = user.subscription
      ? user.subscription.plan === "PREMIUM"
        ? -1 // Illimité
        : user.subscription.monthlyCredits - user.subscription.creditsUsed
      : user.chatCredits;

    return {
      totalChats: user._count.chatSessions,
      totalMessages,
      remainingCredits,
      plan: user.subscription?.plan ?? "FREE",
      status: user.subscription?.status ?? "TRIAL",
    };
  }
}
