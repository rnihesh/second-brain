import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/providers";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nihesh's Second Brain | AI-Powered Knowledge System",
  description:
    "Capture, organize, and query your knowledge with AI. A portable, API-first knowledge management system built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <Analytics />
          {children}
        </Providers>
      </body>
    </html>
  );
}
