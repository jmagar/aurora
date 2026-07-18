import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// A request nonce cannot be applied to build-time HTML. Keep every route on the
// request path so Next.js can copy proxy.ts's nonce onto framework/hydration
// scripts. Removing this requires replacing the CSP with tested build-time hashes.
export const dynamic = "force-dynamic";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Aurora Design System",
  description: "Labby Aurora — operator-first design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased aurora-page-shell`}
      >
        {children}
      </body>
    </html>
  );
}
