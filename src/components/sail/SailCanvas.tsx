"use client";

import { CameraControls, ContactShadows, Html, Line } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import * as THREE from "three";
import { degToRad } from "@/lib/sailing";
import { SloopRig } from "./SloopRig";

export type SailView = "perspective" | "top";

type Props = {
  view: SailView;
  headingDeg: number;
  heelDeg: number;
  mainBoomDeg: number;
  jibDeg: number;
  billow: number;
  luffing: boolean;
  windFrom: number;
};

export function SailCanvas(props: Props) {
  const isTop = props.view === "top";
  return (
    <Canvas
      key={props.view}
      orthographic={isTop}
      shadows
      camera={
        isTop
          ? {
              position: [0, 16, 0],
              zoom: 38,
              near: 0.1,
              far: 60,
              up: [0, 0, 1],
            }
          : {
              position: [5.2, 3.1, 4.2],
              fov: 42,
              near: 0.1,
              far: 80,
            }
      }
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#0b1f33"]} />
      <fog attach="fog" args={["#0b1f33", isTop ? 28 : 14, isTop ? 46 : 32]} />
      <hemisphereLight args={["#cfe7f5", "#163044", 0.95]} />
      <directionalLight position={[6, 9, 4]} intensity={1.35} color="#fff4e5" castShadow />
      <directionalLight position={[-4, 3, -6]} intensity={0.32} color="#7fb7d4" />
      <Suspense fallback={null}>
        <SailScene {...props} />
      </Suspense>
    </Canvas>
  );
}

function SailScene({
  view,
  headingDeg,
  heelDeg,
  mainBoomDeg,
  jibDeg,
  billow,
  luffing,
  windFrom,
}: Props) {
  const controls = useRef<CameraControls>(null);
  const isTop = view === "top";

  useEffect(() => {
    const camera = controls.current?.camera;
    if (isTop && camera) {
      camera.up.set(0, 0, 1);
      camera.lookAt(0, 0, 0);
      controls.current?.setLookAt(0, 16, 0, 0, 0, 0, false);
    }
  }, [isTop]);

  return (
    <>
      <CameraControls
        ref={controls}
        minDistance={isTop ? 6 : 3}
        maxDistance={isTop ? 28 : 16}
        smoothTime={0.3}
        polarRotateSpeed={isTop ? 0 : 1}
        azimuthRotateSpeed={isTop ? 0 : 1}
        maxPolarAngle={isTop ? 0 : Math.PI * 0.49}
        minPolarAngle={isTop ? 0 : 0.18}
      />
      <CompassRose />
      <WindMarker windFrom={windFrom} />
      <SloopRig
        pose={{
          headingDeg,
          heelDeg,
          mainBoomDeg,
          jibDeg,
          billow,
          luffing,
        }}
      />
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.32}
        scale={14}
        blur={2.2}
        far={8}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[8.5, 72]} />
        <meshStandardMaterial color="#12324a" roughness={0.95} metalness={0.05} />
      </mesh>
    </>
  );
}

function CompassRose() {
  const t = useTranslations("sail.compass");
  const ticks = useMemo(() => {
    const marks = [];
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = degToRad(deg);
      const major = deg % 90 === 0;
      const inner = major ? 5.15 : 5.38;
      const outer = 5.72;
      marks.push({
        deg,
        major,
        points: [
          [Math.sin(rad) * inner, 0.03, Math.cos(rad) * inner],
          [Math.sin(rad) * outer, 0.03, Math.cos(rad) * outer],
        ] as [number, number, number][],
      });
    }
    return marks;
  }, []);
  return (
    <group position={[0, 0.02, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.55, 5.72, 64]} />
        <meshBasicMaterial color="#d7ecf4" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      {ticks.map((tick) => (
        <Line
          key={tick.deg}
          points={tick.points}
          color="#d7ecf4"
          lineWidth={tick.major ? 1.6 : 1}
          transparent
          opacity={tick.major ? 0.7 : 0.28}
        />
      ))}
      <Cardinal label={t("n")} position={[0, 0.02, 6.15]} />
      <Cardinal label={t("e")} position={[6.15, 0.02, 0]} />
      <Cardinal label={t("s")} position={[0, 0.02, -6.15]} />
      <Cardinal label={t("w")} position={[-6.15, 0.02, 0]} />
    </group>
  );
}

function Cardinal({ label, position }: { label: string; position: [number, number, number] }) {
  return (
    <Html position={position} center style={{ pointerEvents: "none" }} sprite>
      <div className="rounded-full bg-[var(--navy-deep)]/75 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--sand)] uppercase">
        {label}
      </div>
    </Html>
  );
}

function WindMarker({ windFrom }: { windFrom: number }) {
  const t = useTranslations("sail");
  const rad = degToRad(windFrom);
  const r = 4.85;
  const x = Math.sin(rad) * r;
  const z = Math.cos(rad) * r;
  return (
    <group position={[x, 0.35, z]} rotation={[0, rad, 0]}>
      <mesh position={[0, 0, -0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.7, 8]} />
        <meshStandardMaterial color="#e8b84a" emissive="#e8b84a" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, 0, -1.05]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.42, 10]} />
        <meshStandardMaterial color="#e8b84a" emissive="#e8b84a" emissiveIntensity={0.35} />
      </mesh>
      <Html position={[0, 0.45, 0]} center style={{ pointerEvents: "none" }} sprite>
        <div className="rounded-full bg-[var(--navy-deep)]/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#e8b84a] uppercase">
          {t("wind")}
        </div>
      </Html>
    </group>
  );
}
