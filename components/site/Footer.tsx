import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { mainNav } from "@/lib/nav";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const nav = mainNav(lang, dict);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 overflow-hidden">
      <div className="bg-sardinia-900 text-white/80">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
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
                    className="text-white/60 transition-colors hover:text-accent-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.contact}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>{dict.contact.addressValue}</li>
              <li>
                <a href={`tel:${dict.contact.phoneValue.replace(/\s/g, "")}`} className="hover:text-accent-400">
                  {dict.contact.phoneValue}
                </a>
              </li>
              <li>
                <a href={`mailto:${dict.contact.emailValue}`} className="hover:text-accent-400">
                  {dict.contact.emailValue}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {dict.footer.hours}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {dict.contact.hoursValue}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/40 sm:flex-row">
            <p>
              © {year} Enamel. {dict.footer.rights}
            </p>
            <p>Sarajevo, Bosna i Hercegovina</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
