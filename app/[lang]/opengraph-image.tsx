import { ImageResponse } from "next/og";
import { getDictionary } from "@/lib/dictionaries";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { clinic } from "@/lib/clinic";

export const alt = "Enamel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** Link preview card: wordmark and the plain description, no stock imagery. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = hasLocale(lang) ? lang : "bs";
  const dict = await getDictionary(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a2c46",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#0f766e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="44" height="44" viewBox="0 0 32 32">
              <path
                d="M16 7c4.1 0 7 2.8 7 7 0 3.7-1.4 5.8-2.3 9.3-.6 2.2-1.4 4.7-4.7 4.7s-4.1-2.5-4.7-4.7C10.4 19.8 9 17.7 9 14c0-4.2 2.9-7 7-7Z"
                fill="none"
                stroke="#fff"
                strokeWidth="2.1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", color: "#fff", fontSize: 54, fontWeight: 600 }}>
            Enamel
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", color: "#fff", fontSize: 58, lineHeight: 1.15 }}>
            {dict.home.heroTitle}
          </div>
          <div style={{ display: "flex", color: "#8fb3c7", fontSize: 30 }}>
            {`${clinic.city}, ${clinic.country[locale]}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
