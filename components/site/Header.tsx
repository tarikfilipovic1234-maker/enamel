"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n";
import type { NavItem } from "@/lib/nav";

export function Header({
  lang,
  nav,
  bookLabel,
}: {
  lang: Locale;
  nav: NavItem[];
  bookLabel: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation by adjusting state during render
  // rather than in an effect, which would cause a second render pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === `/${lang}` ? pathname === href : pathname.startsWith(href);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={`fixed inset-x-0 top-0 z-[120] bg-mist/95 backdrop-blur-[2px] transition-shadow ${
        scrolled ? "border-b border-ink/10 shadow-[var(--shadow-soft)]" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Logo lang={lang} />

        <nav aria-label={lang === "bs" ? "Glavna navigacija" : "Main navigation"} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative -my-1 block py-1 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-teal-700 ${
                    isActive(item.href)
                      ? "font-medium text-teal-800 after:block"
                      : "text-ink/70 after:hidden hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher current={lang} />
          {/* The display utility lives on the wrapper: the button's own base
              class sets `inline-flex`, which would otherwise win over `hidden`. */}
          <span className="hidden sm:block">
            <LinkButton href={`/${lang}/appointment`} transitionTypes={["nav-forward"]}>
              {bookLabel}
            </LinkButton>
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={lang === "bs" ? "Meni" : "Menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 grid h-10 w-10 place-items-center rounded-md text-ink hover:bg-ink/5 lg:hidden"
          >
            <span className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink/10 bg-white lg:hidden"
      >
        <nav aria-label={lang === "bs" ? "Glavna navigacija" : "Main navigation"}>
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded-md px-3 py-2.5 text-base ${
                    isActive(item.href)
                      ? "font-medium text-teal-800"
                      : "text-ink/80 hover:bg-ink/5"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="px-3 pb-2 pt-3 sm:hidden">
              <LinkButton href={`/${lang}/appointment`} size="lg" className="w-full">
                {bookLabel}
              </LinkButton>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
