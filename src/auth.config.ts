import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const protectedRoutes = ["/dashboard", "/chat", "/subscription"];
const authRoutes = ["/login", "/register"];

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, token }) {
      if (token.dbUserId) {
        session.user.id = token.dbUserId as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user?.id;
      const isProtected = protectedRoutes.some((r) =>
        nextUrl.pathname.startsWith(r)
      );
      const isAuthRoute = authRoutes.some((r) =>
        nextUrl.pathname.startsWith(r)
      );

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
};
