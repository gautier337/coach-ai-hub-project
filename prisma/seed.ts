import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding...");

  // Créer un utilisateur de test
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Utilisateur Test",
      chatCredits: 5,
      subscription: {
        create: {
          plan: "FREE",
          status: "TRIAL",
          monthlyCredits: 5,
          trialStartDate: new Date(),
          trialEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 jours
        },
      },
    },
    include: {
      subscription: true,
    },
  });

  console.log("✅ Utilisateur créé:", testUser.email);

  // Créer une session de chat de test
  const testSession = await prisma.chatSession.create({
    data: {
      userId: testUser.id,
      title: "Ma première conversation",
      messages: {
        create: [
          {
            role: "SYSTEM",
            content:
              "Tu es un coach personnel bienveillant, spécialisé en développement personnel et en relations. Tu donnes des conseils pratiques et encourageants.",
          },
          {
            role: "USER",
            content: "Bonjour, j'aimerais avoir des conseils pour améliorer ma confiance en moi.",
          },
          {
            role: "ASSISTANT",
            content:
              "Bonjour ! Je suis ravi de t'accompagner dans cette démarche. La confiance en soi se construit progressivement. Commençons par identifier tes forces : quelles sont les qualités que tu apprécies chez toi ?",
          },
        ],
      },
    },
    include: {
      messages: true,
    },
  });

  console.log("✅ Session de chat créée:", testSession.title);
  console.log("✅ Messages créés:", testSession.messages.length);

  console.log("🎉 Seeding terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
