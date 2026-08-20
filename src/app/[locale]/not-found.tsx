import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("site");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">
        {t("name")}
      </p>
      <p className="text-lg text-[var(--text)]">404</p>
    </div>
  );
}
