"use client";

import { useTranslations } from "next-intl";
import { COURSES, type CourseId } from "@/lib/sailing";
import type { SailView } from "./SailCanvas";

type Props = {
  windFrom: number;
  heading: number;
  windSpeed: number;
  mainSheet: number;
  jibSheet: number;
  holdCourse: boolean;
  courseId: CourseId | null;
  view: SailView;
  onWindFrom: (value: number) => void;
  onHeading: (value: number) => void;
  onWindSpeed: (value: number) => void;
  onMainSheet: (value: number) => void;
  onJibSheet: (value: number) => void;
  onHoldCourse: (value: boolean) => void;
  onSelectCourse: (id: CourseId) => void;
  onView: (view: SailView) => void;
};

export function SimControls({
  windFrom,
  heading,
  windSpeed,
  mainSheet,
  jibSheet,
  holdCourse,
  courseId,
  view,
  onWindFrom,
  onHeading,
  onWindSpeed,
  onMainSheet,
  onJibSheet,
  onHoldCourse,
  onSelectCourse,
  onView,
}: Props) {
  const t = useTranslations("sail");
  const tCourses = useTranslations("sail.courses");

  return (
    <aside className="flex h-[42vh] min-h-0 w-full shrink-0 flex-col overflow-y-auto border-t border-white/10 bg-[var(--navy-soft)] md:h-auto md:w-[22.5rem] md:border-r md:border-t-0">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sand)]">
          {t("panelTitle")}
        </p>
        <p className="mt-1 text-xs text-[var(--foam)]/65">{t("panelHint")}</p>
        <div className="mt-3 flex rounded-full border border-white/15 bg-white/5 p-0.5" role="group">
          {(["perspective", "top"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onView(id)}
              className="flex-1 rounded-full px-2.5 py-1 text-xs font-semibold transition data-[active=true]:bg-[var(--accent)] data-[active=true]:text-[var(--navy-deep)] text-[var(--foam)]/75"
              data-active={view === id}
            >
              {t(`view.${id}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--sand)]">
            {t("courses.title")}
          </p>
          <label className="flex items-center gap-2 text-xs text-[var(--foam)]/80">
            <input
              type="checkbox"
              checked={holdCourse}
              onChange={(event) => onHoldCourse(event.target.checked)}
              className="accent-[var(--accent)]"
            />
            {t("courses.hold")}
          </label>
        </div>
        <p className="mt-1 text-[11px] text-[var(--foam)]/55">{t("courses.holdHint")}</p>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {COURSES.map((course) => {
            const active = courseId === course.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => onSelectCourse(course.id)}
                className={`rounded-lg px-2 py-1.5 text-left text-[11px] font-medium leading-tight transition ${
                  active
                    ? "bg-[var(--accent)] text-[var(--navy-deep)]"
                    : "bg-white/8 text-[var(--foam)]/85 hover:bg-white/14"
                }`}
              >
                {tCourses(course.id)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-3">
        <AngleSlider
          label={t("controls.wind")}
          value={windFrom}
          onChange={onWindFrom}
          format={(v) => `${Math.round(v)}°`}
        />
        <AngleSlider
          label={t("controls.heading")}
          value={heading}
          onChange={onHeading}
          disabled={holdCourse}
          format={(v) => `${Math.round(v)}°`}
        />
        <RangeSlider
          label={t("controls.windSpeed")}
          min={2}
          max={22}
          step={1}
          value={windSpeed}
          onChange={onWindSpeed}
          format={(v) => t("controls.knots", { value: Math.round(v) })}
        />
        <RangeSlider
          label={t("controls.mainSheet")}
          min={0}
          max={1}
          step={0.01}
          value={mainSheet}
          onChange={onMainSheet}
          format={(v) => formatSheet(t, v)}
        />
        <RangeSlider
          label={t("controls.jibSheet")}
          min={0}
          max={1}
          step={0.01}
          value={jibSheet}
          onChange={onJibSheet}
          format={(v) => formatSheet(t, v)}
        />
      </div>
    </aside>
  );
}

function formatSheet(
  t: ReturnType<typeof useTranslations<"sail">>,
  value: number,
): string {
  if (value < 0.18) {
    return t("controls.sheeted");
  }
  if (value > 0.82) {
    return t("controls.eased");
  }
  return t("controls.sheetPct", { value: Math.round(value * 100) });
}

function AngleSlider({
  label,
  value,
  onChange,
  disabled,
  format,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  format: (value: number) => string;
}) {
  return (
    <div className={disabled ? "opacity-50" : ""}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--foam)]/85">{label}</span>
        <span className="text-xs tabular-nums text-[var(--sand)]">{format(value)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange((value + 345) % 360)}
          className="rounded-md border border-white/15 px-2 py-0.5 text-xs text-[var(--foam)]/80 hover:border-white/35 disabled:cursor-not-allowed"
        >
          −15
        </button>
        <input
          type="range"
          min={0}
          max={359}
          step={1}
          value={Math.round(value)}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-1.5 w-full accent-[var(--accent)]"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange((value + 15) % 360)}
          className="rounded-md border border-white/15 px-2 py-0.5 text-xs text-[var(--foam)]/80 hover:border-white/35 disabled:cursor-not-allowed"
        >
          +15
        </button>
      </div>
    </div>
  );
}

function RangeSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--foam)]/85">{label}</span>
        <span className="text-xs tabular-nums text-[var(--sand)]">{format(value)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full accent-[var(--accent)]"
      />
    </label>
  );
}
