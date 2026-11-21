// Input rules shared by forms (client) and server actions. The server always re-validates.
import { z } from "zod";

export const email = z.string().trim().toLowerCase().max(254).email("Please enter a valid email.");
export const password = z.string().min(8, "Use at least 8 characters.").max(128, "Use at most 128 characters.");
export const name = z.string().trim().min(2, "Please enter your name.").max(80);
// Bangladeshi mobile: 11 digits starting 013–019 (spaces, dashes and +88 are stripped).
export const bdPhone = z
  .string()
  .transform((v) => v.replace(/[\s-]/g, "").replace(/^\+?88/, ""))
  .pipe(z.string().regex(/^01[3-9]\d{8}$/, "Enter an 11-digit mobile number starting with 01."));

export const registerSchema = z.object({ name, email, password, news: z.boolean().default(false) });
export const loginSchema = z.object({ email, password: z.string().min(1, "Please enter your password.").max(128) });
export const resetRequestSchema = z.object({ email });
export const resetSchema = z.object({ token: z.string().min(20).max(200), password });

export const profileSchema = z.object({
  name,
  phone: z.union([z.literal(""), bdPhone]),
  marketingOptIn: z.boolean(),
  smsUpdates: z.boolean(),
  restockAlerts: z.boolean(),
});

export const addressSchema = z.object({
  label: z.string().trim().min(1).max(30).default("Home"),
  name,
  phone: bdPhone,
  line: z.string().trim().min(5, "Please add your house and road.").max(200),
  area: z.string().trim().min(2, "Please add your area.").max(80),
  district: z.string().trim().min(2, "Please choose a district.").max(40),
  isDefault: z.boolean().default(false),
});

/** First error message per field, for showing next to inputs. */
export function fieldErrors(e: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of e.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
