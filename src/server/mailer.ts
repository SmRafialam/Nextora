import "server-only";
import nodemailer from "nodemailer";

// Sends transactional email through SMTP when SMTP_* is configured.
// Without it: in development the message is printed to the dev-server console so links can
// be tested; in production nothing is sent and `sent: false` is returned. No credentials are invented.
export const emailConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export async function sendMail(to: string, subject: string, text: string): Promise<{ sent: boolean }> {
  if (emailConfigured()) {
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await t.sendMail({ from: process.env.EMAIL_FROM ?? process.env.SMTP_USER, to, subject, text });
    return { sent: true };
  }
  if (process.env.NODE_ENV !== "production") {
    console.info(`\n[dev email — SMTP not configured]\nTo: ${to}\nSubject: ${subject}\n\n${text}\n`);
  }
  return { sent: false };
}
