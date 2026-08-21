"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  clamp,
  computeSailing,
  courseById,
  DEFAULT_WIND_SPEED,
  headingForTwa,
  nearestCourse,
  recommendedSheets,
  type CourseId,
} from "@/lib/sailing";
import { SiteHeader } from "@/components/boat/SiteHeader";
import type { SailView } from "./SailCanvas";
import { Instruments } from "./Instruments";
import { SimControls } from "./SimControls";

const SailCanvas = dynamic(() => import("./SailCanvas").then((mod) => mod.SailCanvas), {
  ssr: false,
  loading: () => <ViewerFallback />,
});

const INITIAL_WIND = 90;
const INITIAL_HEADING = 0;
const INITIAL_SHEETS = recommendedSheets(90);

export function SailStudio() {
  const t = useTranslations("sail");
  const [windFrom, setWindFrom] = useState(INITIAL_WIND);
  const [heading, setHeading] = useState(INITIAL_HEADING);
  const [windSpeed, setWindSpeed] = useState(DEFAULT_WIND_SPEED);
  const [mainSheet, setMainSheet] = useState(INITIAL_SHEETS.main);
  const [jibSheet, setJibSheet] = useState(INITIAL_SHEETS.jib);
  const [mainOffset, setMainOffset] = useState(0);
  const [jibOffset, setJibOffset] = useState(0);
  const [holdCourse, setHoldCourse] = useState(true);
  const [courseId, setCourseId] = useState<CourseId | null>("beam-reach-starboard");
  const [view, setView] = useState<SailView>("perspective");

  const sailing = useMemo(
    () =>
      computeSailing({
        heading,
        windFrom,
        windSpeed,
        mainSheet,
        jibSheet,
      }),
    [heading, windFrom, windSpeed, mainSheet, jibSheet],
  );

  function applyCourse(id: CourseId, nextWind = windFrom, mainOff = 0, jibOff = 0) {
    const course = courseById(id);
    const nextHeading = headingForTwa(nextWind, course.twa);
    const sheets = recommendedSheets(Math.abs(course.twa));
    setCourseId(id);
    setHoldCourse(true);
    setHeading(nextHeading);
    setMainOffset(mainOff);
    setJibOffset(jibOff);
    setMainSheet(clamp(sheets.main + mainOff, 0, 1));
    setJibSheet(clamp(sheets.jib + jibOff, 0, 1));
  }

  function handleWindFrom(next: number) {
    setWindFrom(next);
    if (holdCourse && courseId) {
      applyCourse(courseId, next, mainOffset, jibOffset);
    }
  }

  function handleHeading(next: number) {
    setHeading(next);
    if (holdCourse) {
      setHoldCourse(false);
    }
  }

  function handleHoldCourse(next: boolean) {
    if (next) {
      const id = courseId ?? nearestCourse(sailing.twa).id;
      applyCourse(id, windFrom, 0, 0);
      return;
    }
    setHoldCourse(false);
  }

  function handleMainSheet(next: number) {
    setMainSheet(next);
    setMainOffset(next - sailing.recommendedMainSheet);
  }

  function handleJibSheet(next: number) {
    setJibSheet(next);
    setJibOffset(next - sailing.recommendedJibSheet);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--navy-deep)] text-[var(--foam)]">
      <SiteHeader />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <SimControls
          windFrom={windFrom}
          heading={heading}
          windSpeed={windSpeed}
          mainSheet={mainSheet}
          jibSheet={jibSheet}
          holdCourse={holdCourse}
          courseId={courseId}
          view={view}
          onWindFrom={handleWindFrom}
          onHeading={handleHeading}
          onWindSpeed={setWindSpeed}
          onMainSheet={handleMainSheet}
          onJibSheet={handleJibSheet}
          onHoldCourse={handleHoldCourse}
          onSelectCourse={(id) => applyCourse(id)}
          onView={setView}
        />
        <div className="relative order-first min-h-[48vh] flex-1 md:order-none md:min-h-0">
          <div className="absolute inset-0">
            <SailCanvas
              view={view}
              headingDeg={heading}
              heelDeg={sailing.heelDeg}
              mainBoomDeg={sailing.mainBoomDeg}
              jibDeg={sailing.jibDeg}
              billow={sailing.billow}
              luffing={sailing.luffing}
              windFrom={windFrom}
            />
          </div>
          <Instruments sailing={sailing} />
          <p className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-[var(--navy-deep)]/55 px-2.5 py-1 text-[10px] text-[var(--foam)]/70 backdrop-blur">
            {t("attribution")}
          </p>
        </div>
      </div>
    </div>
  );
}

function ViewerFallback() {
  const t = useTranslations("sail");
  return (
    <div className="flex h-full min-h-[48vh] items-center justify-center bg-[var(--navy-deep)] text-sm text-[var(--foam)]/70">
      {t("loading")}
    </div>
  );
}
