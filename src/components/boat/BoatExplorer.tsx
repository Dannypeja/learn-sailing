"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { partMatchesFilter, type BoatDefinition, type FilterId } from "@/lib/boats";
import { partName } from "@/lib/part-messages";
import { PartDetail } from "./PartDetail";
import { PartsPanel } from "./PartsPanel";
import { SiteHeader } from "./SiteHeader";

const BoatCanvas = dynamic(
  () => import("./BoatCanvas").then((mod) => mod.BoatCanvas),
  {
    ssr: false,
    loading: () => <ViewerFallback />,
  },
);

type Props = {
  boat: BoatDefinition;
};

export function BoatExplorer({ boat }: Props) {
  const t = useTranslations();
  const tParts = useTranslations("parts");
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [resetToken, setResetToken] = useState(0);

  const selectedPart = boat.parts.find((part) => part.id === selectedId) ?? null;

  const labels = useMemo(
    () =>
      Object.fromEntries(boat.parts.map((part) => [part.id, partName(tParts, part.id)])),
    [boat.parts, tParts],
  );

  function handleFilterChange(next: FilterId) {
    setFilter(next);
    if (selectedPart && !partMatchesFilter(selectedPart, next)) {
      setSelectedId(null);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--studio)] text-[var(--text)]">
      <SiteHeader />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <PartsPanel
          boat={boat}
          filter={filter}
          selectedId={selectedId}
          query={query}
          onFilterChange={handleFilterChange}
          onQueryChange={setQuery}
          onSelect={setSelectedId}
        />
        <div className="relative order-first min-h-[48vh] flex-1 md:order-none md:min-h-0">
          <div className="absolute inset-0">
            <BoatCanvas
              boat={boat}
              filter={filter}
              selectedId={selectedId}
              labels={labels}
              onSelect={setSelectedId}
              resetToken={resetToken}
            />
          </div>
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setResetToken((value) => value + 1);
              }}
              className="border border-[var(--line)] bg-[var(--studio)]/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[var(--text)] uppercase backdrop-blur-sm transition hover:border-[var(--accent)]"
            >
              {t("viewer.reset")}
            </button>
            <p className="font-mono text-[9px] tracking-[0.12em] text-[var(--muted)] uppercase">
              {t("attribution.model")}
            </p>
          </div>
          <PartDetail part={selectedPart} />
        </div>
      </div>
    </div>
  );
}

function ViewerFallback() {
  const t = useTranslations();
  return (
    <div className="flex h-full min-h-[48vh] items-center justify-center bg-[var(--studio)] font-mono text-[11px] tracking-[0.16em] text-[var(--muted)] uppercase">
      {t("viewer.loading")}
    </div>
  );
}
