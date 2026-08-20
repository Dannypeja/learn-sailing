"use client";

import { useTranslations } from "next-intl";
import { partDescription, partName } from "@/lib/part-messages";
import type { BoatPart } from "@/lib/boats";

type Props = {
  part: BoatPart | null;
};

export function PartDetail({ part }: Props) {
  const t = useTranslations();
  const tParts = useTranslations("parts");

  return (
    <section className="pointer-events-none absolute inset-x-0 bottom-0 p-3 md:p-4">
      <div className="pointer-events-auto max-w-xl rounded-2xl border border-white/10 bg-[var(--navy-deep)]/85 px-4 py-3 shadow-xl backdrop-blur">
        {part ? (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">
              {t("detail.selected")}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--foam)]">
              {partName(tParts, part.id)}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--foam)]/80">
              {partDescription(tParts, part.id)}
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--foam)]/75">{t("detail.hint")}</p>
        )}
      </div>
    </section>
  );
}
