import type { Metadata } from "next";
import { Syne, Playfair_Display, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CertVault | Secure Editorial Credential Vault",
  description: "A secure, bold, editorial-grade showcase for your professional certifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${playfair.variable} ${spaceGrotesk.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-background text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        {/* Animated Noise Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.05] z-50 noise-bg" />
        
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
