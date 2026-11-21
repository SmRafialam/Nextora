import type { Metadata } from "next";
import { db } from "@/server/db";
import { requireUser } from "@/server/account";
import { AddressBook } from "@/components/account/AddressBook";

export const metadata: Metadata = { title: "Addresses" };

export default async function AddressesPage() {
  const u = await requireUser("/account/addresses");
  const list = await db.address.findMany({ where: { userId: u.id }, orderBy: [{ isDefault: "desc" }, { id: "asc" }], select: { id: true, label: true, name: true, phone: true, line: true, area: true, district: true, isDefault: true } });
  return <AddressBook list={list} defaults={{ name: u.name ?? "", phone: u.phone ?? "" }} />;
}
