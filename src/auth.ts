import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { db } from "@/server/db";
import { loginSchema } from "@/lib/validation";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: "CUSTOMER" | "ADMIN" } & DefaultSession["user"];
  }
  interface User {
    role?: "CUSTOMER" | "ADMIN";
    sessionVersion?: number;
  }
}

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("nestora-timing-guard", 12);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({ where: { email: parsed.data.email } });
        const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !user.passwordHash || !ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role, sessionVersion: user.sessionVersion };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = user.role;
        token.sv = user.sessionVersion ?? 0;
        return token;
      }
      // On later requests, drop the session if the account was deleted or its password was reset,
      // and pick up role changes made by an admin.
      if (token.uid) {
        const u = await db.user.findUnique({ where: { id: token.uid as string }, select: { role: true, sessionVersion: true, name: true } });
        if (!u || u.sessionVersion !== token.sv) return null;
        token.role = u.role;
        token.name = u.name;
      }
      return token;
    },
  },
});
