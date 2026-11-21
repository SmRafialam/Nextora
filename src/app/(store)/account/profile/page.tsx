import type { Metadata } from "next";
import { requireUser } from "@/server/account";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "Profile & preferences" };

export default async function ProfilePage() {
  const u = await requireUser("/account/profile");
  return <ProfileForm user={{ name: u.name ?? "", phone: u.phone ?? "", email: u.email, verified: !!u.emailVerified, marketingOptIn: u.marketingOptIn, smsUpdates: u.smsUpdates, restockAlerts: u.restockAlerts }} />;
}
