"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/server/db";
import { DISTRICTS } from "@/lib/bd";
import { addressSchema, fieldErrors, profileSchema } from "@/lib/validation";

export type FormState = { ok?: boolean; message?: string; errors?: Record<string, string> } | undefined;

async function uid() {
  const s = await auth();
  if (!s?.user?.id) throw new Error("Not signed in");
  return s.user.id;
}

export async function updateProfileAction(_: FormState, fd: FormData): Promise<FormState> {
  const userId = await uid();
  const parsed = profileSchema.safeParse({
    name: fd.get("name"), phone: String(fd.get("phone") ?? ""),
    marketingOptIn: fd.get("marketingOptIn") === "on", smsUpdates: fd.get("smsUpdates") === "on", restockAlerts: fd.get("restockAlerts") === "on",
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const { phone, ...rest } = parsed.data;
  const user = await db.user.update({ where: { id: userId }, data: { ...rest, phone: phone || null } });
  if (rest.marketingOptIn) await db.newsletterSubscriber.upsert({ where: { email: user.email }, create: { email: user.email }, update: { unsubscribed: false } });
  else await db.newsletterSubscriber.updateMany({ where: { email: user.email }, data: { unsubscribed: true } });
  revalidatePath("/account", "layout");
  return { ok: true, message: "Your details are saved." };
}

export async function addAddressAction(_: FormState, fd: FormData): Promise<FormState> {
  const userId = await uid();
  const parsed = addressSchema.safeParse({
    label: fd.get("label") || "Home", name: fd.get("name"), phone: fd.get("phone"), line: fd.get("line"),
    area: fd.get("area"), district: fd.get("district"), isDefault: fd.get("isDefault") === "on",
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  if (!(DISTRICTS as readonly string[]).includes(parsed.data.district)) return { errors: { district: "Please choose a district." } };
  const count = await db.address.count({ where: { userId } });
  if (count >= 10) return { message: "You can save up to 10 addresses." };
  const isDefault = parsed.data.isDefault || count === 0;
  await db.$transaction([
    ...(isDefault ? [db.address.updateMany({ where: { userId }, data: { isDefault: false } })] : []),
    db.address.create({ data: { ...parsed.data, isDefault, userId } }),
  ]);
  revalidatePath("/account", "layout");
  return { ok: true, message: "Address saved." };
}

export async function setDefaultAddressAction(id: string) {
  const userId = await uid();
  const a = await db.address.findFirst({ where: { id, userId } });
  if (!a) return;
  await db.$transaction([
    db.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    db.address.update({ where: { id }, data: { isDefault: true } }),
  ]);
  revalidatePath("/account/addresses");
}

export async function deleteAddressAction(id: string) {
  const userId = await uid();
  const a = await db.address.findFirst({ where: { id, userId } });
  if (!a) return;
  await db.address.delete({ where: { id } });
  if (a.isDefault) {
    const next = await db.address.findFirst({ where: { userId }, orderBy: { id: "asc" } });
    if (next) await db.address.update({ where: { id: next.id }, data: { isDefault: true } });
  }
  revalidatePath("/account", "layout");
}
