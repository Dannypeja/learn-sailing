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
      <div className="pointer-events-auto max-w-xl border border-[var(--line)] bg-[var(--studio)]/88 px-4 py-3 backdrop-blur-sm">
        {part ? (
          <>
            <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
              {t("detail.selected")}
            </p>
            <h2 className="mt-1 text-lg font-medium tracking-tight text-[var(--text)]">
              {partName(tParts, part.id)}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              {partDescription(tParts, part.id)}
            </p>
          </>
        ) : (
          <p className="text-sm text-[var(--muted)]">{t("detail.hint")}</p>
        )}
      </div>
    </section>
  );
}
