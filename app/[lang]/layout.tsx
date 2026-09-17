import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { defaultLocale, hasLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { mainNav } from "@/lib/nav";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
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

/**
 * Metadata is per-locale: the previous static export served the Bosnian title
 * and a mixed-language description on /en too, and emitted no canonical or
 * hreflang links.
 */
export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
      default: dict.meta.siteTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Enamel",
      locale: lang === "bs" ? "bs_BA" : "en_US",
      url: `/${lang}`,
      title: dict.meta.siteTitle,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.description,
    },
  };
}

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
        <JsonLd dict={dict} lang={lang as Locale} />
        <Header lang={lang as Locale} nav={nav} bookLabel={dict.nav.book} />
        <ViewTransition
          enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
          exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
          default="none"
        >
          <main className="flex-1 pt-16">{children}</main>
        </ViewTransition>
        <Footer lang={lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
