"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const GITHUB_URL = "https://github.com/Dannypeja/learn-sailing";

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--studio)] px-4 py-3 md:px-6">
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] tracking-[0.22em] text-[var(--text)] uppercase">
          {t("site.name")}
        </p>
        <p className="truncate text-xs text-[var(--muted)]">{t("site.tagline")}</p>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase"
          role="group"
          aria-label={t("locale.switchTo")}
        >
          {routing.locales.map((locale, index) => (
            <span key={locale} className="flex items-center gap-2">
              {index > 0 ? <span className="text-[var(--line)]">/</span> : null}
              <Link
                href={pathname}
                locale={locale}
                className={
                  locale === currentLocale
                    ? "text-[var(--accent)]"
                    : "text-[var(--muted)] transition hover:text-[var(--text)]"
                }
              >
                {locale}
              </Link>
            </span>
          ))}
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden text-[11px] tracking-[0.08em] text-[var(--muted)] transition hover:text-[var(--text)] sm:inline"
        >
          {t("site.github")}
        </a>
      </div>
    </header>
  );
}
