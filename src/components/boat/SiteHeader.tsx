"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const GITHUB_URL = "https://github.com/Dannypeja/learn-sailing";

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const isSail = pathname === "/sail" || pathname.startsWith("/sail/");

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[var(--navy-deep)]/90 px-4 py-3 backdrop-blur md:px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tracking-wide text-[var(--foam)]">
          {t("site.name")}
        </p>
        <p className="truncate text-xs text-[var(--foam)]/70">
          {isSail ? t("sail.tagline") : t("site.tagline")}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <nav
          className="flex rounded-full border border-white/15 bg-white/5 p-0.5"
          aria-label={t("site.name")}
        >
          <Link
            href="/"
            data-active={!isSail}
            className="rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide text-[var(--foam)]/70 transition hover:text-[var(--foam)] data-[active=true]:bg-[var(--accent)] data-[active=true]:text-[var(--navy-deep)]"
          >
            {t("nav.parts")}
          </Link>
          <Link
            href="/sail"
            data-active={isSail}
            className="rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide text-[var(--foam)]/70 transition hover:text-[var(--foam)] data-[active=true]:bg-[var(--accent)] data-[active=true]:text-[var(--navy-deep)]"
          >
            {t("nav.sail")}
          </Link>
        </nav>
        <div
          className="flex rounded-full border border-white/15 bg-white/5 p-0.5"
          role="group"
          aria-label={t("locale.switchTo")}
        >
          {routing.locales.map((locale) => (
            <Link
              key={locale}
              href={pathname}
              locale={locale}
              data-active={locale === currentLocale}
              className="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--foam)]/70 transition hover:text-[var(--foam)] data-[active=true]:bg-[var(--accent)] data-[active=true]:text-[var(--navy-deep)]"
            >
              {locale}
            </Link>
          ))}
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full border border-white/15 px-3 py-1 text-xs text-[var(--foam)]/80 transition hover:border-white/40 hover:text-[var(--foam)] sm:inline"
        >
          {t("site.github")}
        </a>
      </div>
    </header>
  );
}
