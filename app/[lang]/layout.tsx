import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { mainNav } from "@/lib/nav";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Splash } from "@/components/site/Splash";
import { ViewTransition } from "@/components/ui/ViewTransition";
import { JsonLd } from "@/components/seo/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Enamel — Stomatološka poliklinika Sarajevo",
    template: "%s · Enamel",
  },
  description:
    "Enamel — vrhunska stomatološka njega u Sarajevu. Premium dental care in Sarajevo.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    siteName: "Enamel",
    title: "Enamel — Stomatološka poliklinika Sarajevo",
    description: "Vrhunska stomatološka njega u Sarajevu.",
  },
  twitter: { card: "summary_large_image" },
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const nav = mainNav(lang as Locale, dict);

  return (
    <html
      lang={lang}
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuroraBackground />
        <JsonLd dict={dict} />
        <Splash tagline={dict.splash.tagline} />
        <Header lang={lang as Locale} nav={nav} bookLabel={dict.nav.book} />
        <ViewTransition
          enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
          exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
          default="none"
        >
          <main className="flex-1 pt-24">{children}</main>
        </ViewTransition>
        <Footer lang={lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
