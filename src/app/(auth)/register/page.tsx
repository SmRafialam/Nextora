import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthView } from "@/components/auth/AuthView";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string; callbackUrl?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const sp = await searchParams;
  let next = sp.next ?? sp.callbackUrl;
  // Only same-site paths (Auth.js passes a full URL in callbackUrl).
  if (next && /^https?:/.test(next)) { try { next = new URL(next).pathname; } catch { next = undefined; } }
  if (next && (!next.startsWith("/") || next.startsWith("//"))) next = undefined;
  if ((await auth())?.user) redirect(next ?? "/account");
  return <main id="main"><AuthView initial="up" next={next} /></main>;
}
