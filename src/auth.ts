import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { UserService } from "@/services/user.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          let dbUser = await UserService.findByEmail(user.email);
          if (!dbUser) {
            dbUser = await UserService.createUser({
              email: user.email,
              name: user.name ?? undefined,
              image: user.image ?? undefined,
              googleId: account.providerAccountId,
            });
          } else if (!dbUser.googleId) {
            await UserService.updateUser(dbUser.id, {
              googleId: account.providerAccountId,
            });
          }
          return true;
        } catch (error) {
          console.error("Erreur lors de la connexion:", error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const dbUser = await UserService.findByEmail(user.email);
        if (dbUser) {
          token.dbUserId = dbUser.id;
        }
      }
      return token;
    },
  },
});
