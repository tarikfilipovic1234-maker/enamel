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
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.legal.privacyTitle,
    description: dict.legal.privacySubtitle,
    alternates: { canonical: `/${lang}/privacy` },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const l = dict.legal;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {l.privacyTitle}
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-ink/60">{l.privacySubtitle}</p>
      <p className="mt-2 text-sm text-ink/45">
        {l.lastUpdated}: {formatDate(LAST_UPDATED, lang as Locale)}
      </p>

      <LegalSection title={l.controllerTitle}>
        {clinic.legalName ? (
          <p>
            {clinic.legalName}
            {clinic.legalId ? `, ${clinic.legalId}` : ""}
            {clinic.address ? `, ${clinic.address}` : ""}
            {clinic.email ? (
              <>
                {". "}
                <a className="text-teal-700 underline" href={`mailto:${clinic.email}`}>
                  {clinic.email}
                </a>
              </>
            ) : null}
          </p>
        ) : (
          <p>{l.controllerPending}</p>
        )}
      </LegalSection>

      <LegalSection title={l.dataTitle}>
        <p>{l.dataIntro}</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{l.dataContact}</li>
          <li>{l.dataAppointment}</li>
          <li>{l.dataTestimonial}</li>
        </ul>
        <p>{l.dataNote}</p>
      </LegalSection>

      <LegalSection title={l.purposeTitle}>
        <p>{l.purposeText}</p>
      </LegalSection>

      <LegalSection title={l.storageTitle}>
        <p>{l.storageText}</p>
      </LegalSection>

      <LegalSection title={l.retentionTitle}>
        <p>{l.retentionText}</p>
      </LegalSection>

      <LegalSection title={l.cookiesTitle}>
        <p>{l.cookiesText}</p>
      </LegalSection>

      {/* The map is only embedded once a real address is configured. */}
      {clinic.address && (
        <LegalSection title={l.mapTitle}>
          <p>{l.mapText}</p>
        </LegalSection>
      )}

      <LegalSection title={l.rightsTitle}>
        <p>{l.rightsText}</p>
      </LegalSection>
    </div>
  );
}
