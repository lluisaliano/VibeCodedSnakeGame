import type { Metadata } from "next";
import { Space_Grotesk, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

const shareTech = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Neon Snake",
  description: "Classic Snake with a neon arcade vibe."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${shareTech.variable}`}>
      <body className="neon-grid">
        <div className="min-h-screen px-6 py-10 sm:px-10">{children}</div>
      </body>
    </html>
  );
}
