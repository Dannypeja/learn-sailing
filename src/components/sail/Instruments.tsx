"use client";

import { useTranslations } from "next-intl";
import type { SailingState } from "@/lib/sailing";

type Props = {
  sailing: SailingState;
};

export function Instruments({ sailing }: Props) {
  const t = useTranslations("sail");
  const tPoints = useTranslations("sail.points");
  const tTacks = useTranslations("sail.tacks");
  const heelAbs = Math.abs(sailing.heelDeg);
  const heelSide =
    sailing.heelDeg > 2 ? tTacks("port") : sailing.heelDeg < -2 ? tTacks("starboard") : tTacks("none");

  return (
    <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap gap-2 md:right-auto md:max-w-[28rem]">
      <Meter label={t("instruments.twa")} value={`${Math.round(sailing.twa)}°`} />
      <Meter
        label={t("instruments.course")}
        value={`${tPoints(sailing.pointOfSail)}${sailing.tack !== "none" ? ` · ${tTacks(sailing.tack)}` : ""}`}
      />
      <Meter
        label={t("instruments.heel")}
        value={heelAbs < 1 ? t("instruments.upright") : `${Math.round(heelAbs)}° ${heelSide}`}
      />
      <Meter
        label={t("instruments.drive")}
        value={`${Math.round(sailing.drive * 100)}%`}
        bar={sailing.drive}
        warn={sailing.luffing}
      />
    </div>
  );
}

function Meter({
  label,
  value,
  bar,
  warn,
}: {
  label: string;
  value: string;
  bar?: number;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-[var(--navy-deep)]/78 px-3 py-2 text-[var(--foam)] shadow-lg backdrop-blur">
      <p className="text-[10px] font-semibold tracking-wide text-[var(--sand)] uppercase">{label}</p>
      <p className={`text-sm font-semibold ${warn ? "text-[#e8b84a]" : ""}`}>{value}</p>
      {bar !== undefined ? (
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full ${warn ? "bg-[#e8b84a]" : "bg-[var(--accent)]"}`}
            style={{ width: `${Math.round(bar * 100)}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
