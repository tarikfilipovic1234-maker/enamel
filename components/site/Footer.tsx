import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { clinic, telHref } from "@/lib/clinic";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { mainNav } from "@/lib/nav";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = mainNav(lang, dict);
  const year = new Date().getFullYear();
  const hasContact = Boolean(clinic.address || clinic.phone || clinic.email);

  // The contact and hours columns only exist once real details are configured,
  // so the grid tracks the number of columns actually rendered.
  const columnCount = 2 + (hasContact ? 1 : 0) + (clinic.hours.length ? 1 : 0);
  const columnClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columnCount as 2 | 3 | 4];

  return (
    <footer className="relative mt-32 overflow-hidden">
      <div className="bg-sardinia-900 text-white/80">
        <div className={`mx-auto grid max-w-6xl gap-12 px-6 py-16 ${columnClass}`}>
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo lang={lang} invert />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {dict.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.quickLinks}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {hasContact && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {dict.footer.contact}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/60">
                {clinic.address && <li>{clinic.address}</li>}
                {clinic.phone && (
                  <li>
                    <a href={telHref} className="hover:text-white">
                      {clinic.phone}
                    </a>
                  </li>
                )}
                {clinic.email && (
                  <li>
                    <a href={`mailto:${clinic.email}`} className="hover:text-white">
                      {clinic.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {clinic.hours.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {dict.footer.hours}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-white/60">
                {clinic.hours.map((h) => (
                  <li key={h.schema} className="flex justify-between gap-4">
                    <span>{h.label[lang]}</span>
                    <span className="tabular-nums">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/40 sm:flex-row">
            <nav aria-label={dict.footer.legal}>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <li>
                  <Link href={`/${lang}/privacy`} className="transition-colors hover:text-white">
                    {dict.nav.privacy}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/terms`} className="transition-colors hover:text-white">
                    {dict.nav.terms}
                  </Link>
                </li>
              </ul>
            </nav>
            <p>
              © {year} {clinic.name}. {dict.footer.rights} · {clinic.city},{" "}
              {clinic.country[lang]}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
