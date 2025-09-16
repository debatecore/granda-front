import type { Metadata } from "next";
import {
  Funnel_Display,
  Geist,
  Geist_Mono,
  Lexend,
  Newsreader,
} from "next/font/google";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

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
const FontLexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("title"),
    description: t("description"),
  } as Metadata;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  console.log(locale);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body
        className={`${FontGeistSans.variable} ${FontGeistMono.variable} ${FontLexend.variable} ${FontNewsreader.variable} ${FontLogo.variable} dark font-sans antialiased bg-stone-950 text-stone-100`}
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
