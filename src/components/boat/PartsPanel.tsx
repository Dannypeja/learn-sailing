"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  FILTER_IDS,
  partMatchesFilter,
  type BoatDefinition,
  type FilterId,
} from "@/lib/boats";
import { partName } from "@/lib/part-messages";

type Props = {
  boat: BoatDefinition;
  filter: FilterId;
  selectedId: string | null;
  query: string;
  onFilterChange: (filter: FilterId) => void;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
};

export function PartsPanel({
  boat,
  filter,
  selectedId,
  query,
  onFilterChange,
  onQueryChange,
  onSelect,
}: Props) {
  const t = useTranslations();
  const tParts = useTranslations("parts");
  const tFilters = useTranslations("filters");

  const visibleParts = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return boat.parts.filter((part) => {
      if (!partMatchesFilter(part, filter)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const name = partName(tParts, part.id).toLocaleLowerCase();
      return name.includes(needle) || part.id.toLocaleLowerCase().includes(needle);
    });
  }, [boat.parts, filter, query, tParts]);

  return (
    <aside className="flex h-[42vh] min-h-0 w-full shrink-0 flex-col border-t border-white/10 bg-[var(--navy-soft)] md:h-auto md:w-80 md:border-r md:border-t-0">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">
          {t("site.hullType")}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTER_IDS.map((id) => {
            const active = id === filter;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onFilterChange(id)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-[var(--accent)] text-[var(--navy-deep)]"
                    : "bg-white/8 text-[var(--foam)]/80 hover:bg-white/14"
                }`}
              >
                {tFilters(id)}
              </button>
            );
          })}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">{t("search.placeholder")}</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full rounded-lg border border-white/10 bg-[var(--navy-deep)] px-3 py-2 text-sm text-[var(--foam)] outline-none placeholder:text-[var(--foam)]/40 focus:border-[var(--accent)]"
          />
        </label>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto p-2">
        {visibleParts.length === 0 ? (
          <li className="px-3 py-6 text-sm text-[var(--foam)]/60">
            {t("search.empty")}
          </li>
        ) : (
          visibleParts.map((part) => {
            const selected = part.id === selectedId;
            return (
              <li key={part.id}>
                <button
                  type="button"
                  onClick={() => onSelect(part.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "bg-[var(--accent)]/20 text-[var(--foam)]"
                      : "text-[var(--foam)]/85 hover:bg-white/8"
                  }`}
                >
                  <span>{partName(tParts, part.id)}</span>
                  {selected ? (
                    <span className="text-[10px] uppercase tracking-wide text-[var(--accent)]">
                      {t("detail.selected")}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
}
