import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("site");
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="text-sm font-semibold tracking-wide text-[var(--sand)]">
        {t("name")}
      </p>
      <p className="text-lg text-[var(--foam)]">404</p>
    </div>
  );
}
