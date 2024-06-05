import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atelier",
  description:
    "Atelier is a place where you have the freedom to explore your curiosity. We gather weekly to create things: software apps, blogs, paintings, videos, music, games, graphics, and so on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <link rel="icon" href="/images/favicon.avif" sizes="any" />
        {children}
      </body>
    </html>
  );
}
