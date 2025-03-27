import type { Metadata } from "next";
import {
  Funnel_Display,
  Geist,
  Geist_Mono,
  Newsreader,
} from "next/font/google";
import "./globals.css";

const FontGeistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const FontGeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const FontNewsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});
const FontLogo = Funnel_Display({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-funnel-display",
});

export const metadata: Metadata = {
  title: "granda: Debate Tournament Planner",
  description:
    "Computer aided debate tournament organizing experience enrichment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${FontGeistSans.variable} ${FontGeistMono.variable} ${FontNewsreader.variable} ${FontLogo.variable} antialiased bg-stone-950 text-stone-100`}
      >
        {children}
      </body>
    </html>
  );
}
