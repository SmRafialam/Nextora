// Protects /account (signed-in) and /admin (ADMIN role) before rendering. Rules live in auth.config.ts.
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = { matcher: ["/account/:path*", "/admin/:path*"] };
