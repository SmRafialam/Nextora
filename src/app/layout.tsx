import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Overlays } from "@/components/shop/Overlays";

const fraunces = Fraunces({ subsets: ["latin"], weight: "variable", style: ["normal", "italic"], axes: ["opsz"], variable: "--font-fraunces", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Nestora — Make Every Space Feel Like Home", template: "%s — Nestora" },
  description: "Thoughtfully curated furniture, lighting and home décor. Delivered across Bangladesh.",
  openGraph: { siteName: "Nestora", type: "website", locale: "en_BD" },
};
export const viewport: Viewport = { themeColor: "#F8F5EF" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      {/* suppressHydrationWarning: browser extensions (e.g. Grammarly) inject attributes on <body>. */}
      <body suppressHydrationWarning>
        {children}
        <Overlays />
      </body>
    </html>
  );
}
