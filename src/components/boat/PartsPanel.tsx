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
    <aside className="flex h-[42vh] min-h-0 w-full shrink-0 flex-col border-t border-[var(--line)] bg-[var(--panel)] md:h-auto md:w-80 md:border-t-0 md:border-r">
      <div className="border-b border-[var(--line)] px-4 py-4">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
          {t("site.hullType")}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {FILTER_IDS.map((id) => {
            const active = id === filter;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onFilterChange(id)}
                className={`border-b pb-1 text-[11px] tracking-[0.12em] uppercase transition ${
                  active
                    ? "border-[var(--accent)] text-[var(--text)]"
                    : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                }`}
              >
                {tFilters(id)}
              </button>
            );
          })}
        </div>
        <label className="mt-4 block">
          <span className="sr-only">{t("search.placeholder")}</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full border border-[var(--line)] bg-[var(--studio)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--muted)]/70 focus:border-[var(--accent)]"
          />
        </label>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto py-1">
        {visibleParts.length === 0 ? (
          <li className="px-4 py-6 text-sm text-[var(--muted)]">
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
                  className={`flex w-full items-center justify-between border-l-2 px-4 py-2 text-left text-sm transition ${
                    selected
                      ? "border-[var(--accent)] bg-white/4 text-[var(--text)]"
                      : "border-transparent text-[var(--text)]/80 hover:bg-white/3 hover:text-[var(--text)]"
                  }`}
                >
                  <span>{partName(tParts, part.id)}</span>
                  {selected ? (
                    <span className="font-mono text-[9px] tracking-[0.16em] text-[var(--accent)] uppercase">
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
