import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { clinic } from "@/lib/clinic";
import { formatDate } from "@/lib/format";
import { LegalSection } from "@/components/sections/LegalSection";

/** Bump when the text below changes, so the stated date stays honest. */
const LAST_UPDATED = "2026-09-18";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.legal.termsTitle,
    description: dict.legal.termsSubtitle,
    alternates: { canonical: `/${lang}/terms` },
  };
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const l = dict.legal;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {l.termsTitle}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/60">{l.termsSubtitle}</p>
      <p className="mt-2 text-sm text-ink/45">
        {l.lastUpdated}: {formatDate(LAST_UPDATED, lang as Locale)}
      </p>

      {clinic.legalName && (
        <LegalSection title={l.controllerTitle}>
          <p>
            {clinic.legalName}
            {clinic.legalId ? `, ${clinic.legalId}` : ""}
            {clinic.address ? `, ${clinic.address}` : ""}
          </p>
        </LegalSection>
      )}

      <LegalSection title={l.termsUseTitle}>
        <p>{l.termsUseText}</p>
      </LegalSection>

      <LegalSection title={l.termsBookingTitle}>
        <p>{l.termsBookingText}</p>
      </LegalSection>

      <LegalSection title={l.termsPricesTitle}>
        <p>{l.termsPricesText}</p>
      </LegalSection>

      <LegalSection title={l.termsReviewsTitle}>
        <p>{l.termsReviewsText}</p>
      </LegalSection>

      <LegalSection title={l.termsContentTitle}>
        <p>{l.termsContentText}</p>
      </LegalSection>

      <LegalSection title={l.termsChangesTitle}>
        <p>{l.termsChangesText}</p>
      </LegalSection>
    </div>
  );
}
