// Edge-safe Auth.js settings, shared by middleware (no database access here) and src/auth.ts.
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
  providers: [],
  callbacks: {
    // Route protection, evaluated by middleware before the page renders.
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/admin")) return auth?.user?.role === "ADMIN";
      if (path.startsWith("/account")) return !!auth?.user;
      return true;
    },
    session({ session, token }) {
      if (token.uid) {
        session.user.id = token.uid as string;
        session.user.role = (token.role as "CUSTOMER" | "ADMIN") ?? "CUSTOMER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
