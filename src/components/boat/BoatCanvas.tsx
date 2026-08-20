"use client";

import {
  CameraControls,
  ContactShadows,
  Environment,
  Grid,
  Html,
  Line,
  useCursor,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import {
  partMatchesFilter,
  type BoatDefinition,
  type BoatPart,
  type FilterId,
} from "@/lib/boats";

type Labels = Record<string, string>;

type CanvasProps = {
  boat: BoatDefinition;
  filter: FilterId;
  selectedId: string | null;
  labels: Labels;
  onSelect: (id: string | null) => void;
  resetToken: number;
};

const ORIENTATION_IDS = new Set(["bow", "stern", "port", "starboard"]);
const STUDIO_BG = "#07090c";
const RIG_FILTERS = new Set([
  "rig",
  "mast",
  "boom",
  "standing-rig",
  "running-rig",
]);

export function BoatCanvas(props: CanvasProps) {
  return (
    <Canvas
      camera={{
        position: props.boat.defaultCamera.position,
        fov: 38,
        near: 0.1,
        far: 80,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onPointerMissed={() => props.onSelect(null)}
    >
      <color attach="background" args={[STUDIO_BG]} />
      <hemisphereLight args={["#9aa7b5", "#0b0e12", 0.35]} />
      <directionalLight position={[5.5, 7, 3.5]} intensity={1.05} color="#f4f7fb" />
      <directionalLight position={[-5, 2.5, -4]} intensity={0.28} color="#7f93a8" />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.38} />
        <BoatScene {...props} />
      </Suspense>
    </Canvas>
  );
}

function BoatScene({
  boat,
  filter,
  selectedId,
  labels,
  onSelect,
  resetToken,
}: CanvasProps) {
  const controls = useRef<CameraControls>(null);
  const selected = boat.parts.find((part) => part.id === selectedId) ?? null;
  const skipResetOnMount = useRef(true);

  useEffect(() => {
    const camera = selected?.camera ?? boat.defaultCamera;
    controls.current?.setLookAt(
      camera.position[0],
      camera.position[1],
      camera.position[2],
      camera.target[0],
      camera.target[1],
      camera.target[2],
      true,
    );
  }, [selected, boat.defaultCamera]);

  useEffect(() => {
    if (skipResetOnMount.current) {
      skipResetOnMount.current = false;
      return;
    }
    const camera = boat.defaultCamera;
    controls.current?.setLookAt(
      camera.position[0],
      camera.position[1],
      camera.position[2],
      camera.target[0],
      camera.target[1],
      camera.target[2],
      true,
    );
  }, [resetToken, boat.defaultCamera]);

  return (
    <>
      <CameraControls
        ref={controls}
        minDistance={2.2}
        maxDistance={14}
        smoothTime={0.35}
        maxPolarAngle={Math.PI * 0.49}
      />
      <BoatModel boat={boat} filter={filter} selectedId={selectedId} />
      <RigLines parts={boat.parts} filter={filter} selectedId={selectedId} />
      <Hotspots
        parts={boat.parts}
        filter={filter}
        selectedId={selectedId}
        labels={labels}
        onSelect={onSelect}
      />
      <Grid
        position={[0, -0.001, 0]}
        args={[24, 24]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor="#1b222c"
        sectionSize={2.5}
        sectionThickness={0.9}
        sectionColor="#2c3644"
        fadeDistance={16}
        fadeStrength={1.15}
        infiniteGrid
      />
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.42}
        scale={14}
        blur={2.8}
        far={9}
        color="#000000"
      />
    </>
  );
}

function BoatModel({
  boat,
  filter,
  selectedId,
}: {
  boat: BoatDefinition;
  filter: FilterId;
  selectedId: string | null;
}) {
  const { scene } = useGLTF(boat.model);
  const clone = useMemo(() => {
    const next = scene.clone(true);
    next.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      const isSail = mesh.name.toLowerCase().includes("sail");
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: isSail ? "#d5dee6" : "#f2f4f6",
        metalness: isSail ? 0.06 : 0.16,
        roughness: isSail ? 0.4 : 0.22,
        clearcoat: isSail ? 0.08 : 0.82,
        clearcoatRoughness: 0.2,
        transparent: true,
        opacity: isSail ? 0.84 : 1,
        envMapIntensity: 1.05,
        side: isSail ? THREE.DoubleSide : THREE.FrontSide,
      });
    });
    return next;
  }, [scene]);

  const selectedPart = boat.parts.find((part) => part.id === selectedId) ?? null;

  useLayoutEffect(() => {
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];
      const isSail = mesh.name.toLowerCase().includes("sail");
      const highlighted = Boolean(selectedPart?.meshNames?.includes(mesh.name));
      const dimmed =
        filter !== "all" &&
        ((isSail && !RIG_FILTERS.has(filter)) ||
          (!isSail && filter !== "hull" && filter !== "aft"));

      for (const material of materials) {
        const std = material as THREE.MeshPhysicalMaterial;
        if (!("opacity" in std)) {
          continue;
        }
        std.transparent = true;
        std.opacity = dimmed ? 0.16 : isSail ? 0.84 : 1;
        if ("emissive" in std) {
          std.emissive = new THREE.Color(highlighted ? "#1b6f7c" : "#000000");
          std.emissiveIntensity = highlighted ? 0.18 : 0;
        }
      }
    });
  }, [clone, filter, selectedPart]);

  return (
    <primitive
      object={clone}
      scale={boat.modelScale}
      rotation={boat.modelRotation}
    />
  );
}

function RigLines({
  parts,
  filter,
  selectedId,
}: {
  parts: BoatPart[];
  filter: FilterId;
  selectedId: string | null;
}) {
  return (
    <group>
      {parts.map((part) =>
        (part.lines ?? []).map((points, index) => {
          const active = partMatchesFilter(part, filter);
          const selected = part.id === selectedId;
          if (!active && !selected) {
            return null;
          }
          return (
            <Line
              key={`${part.id}-${index}`}
              points={points}
              color={selected ? "#67e8f9" : "#6b7785"}
              lineWidth={selected ? 1.35 : 0.85}
              transparent
              opacity={selected ? 0.8 : 0.4}
            />
          );
        }),
      )}
    </group>
  );
}

function Hotspots({
  parts,
  filter,
  selectedId,
  labels,
  onSelect,
}: {
  parts: BoatPart[];
  filter: FilterId;
  selectedId: string | null;
  labels: Labels;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  useCursor(Boolean(hovered));

  return (
    <group>
      {parts.map((part) => {
        const active = partMatchesFilter(part, filter);
        const selected = part.id === selectedId;
        if (!active && !selected) {
          return null;
        }
        const isOrientation = ORIENTATION_IDS.has(part.id);
        const showLabel = selected || hovered === part.id;
        return (
          <group key={part.id} position={part.position}>
            <HotspotCollider
              radius={part.radius}
              onSelect={() => onSelect(part.id)}
              onHover={(value) => setHovered(value ? part.id : null)}
            />
            <Html center style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
              <div
                className={`hotspot-pin${showLabel ? " is-hovered" : ""}${selected ? " is-selected" : ""}`}
              />
            </Html>
            {showLabel ? (
              <Html center style={{ pointerEvents: "none" }} zIndexRange={[40, 10]}>
                <div className="hotspot-label">{labels[part.id]}</div>
              </Html>
            ) : isOrientation ? (
              <Html center style={{ pointerEvents: "none" }} zIndexRange={[15, 0]}>
                <div className="orientation-cap">{labels[part.id]}</div>
              </Html>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function HotspotCollider({
  radius,
  onSelect,
  onHover,
}: {
  radius: number;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
}) {
  const { invalidate } = useThree();
  return (
    <mesh
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
        invalidate();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(true);
      }}
      onPointerOut={() => onHover(false)}
    >
      <sphereGeometry args={[Math.max(radius, 0.12), 16, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

useGLTF.preload("/models/monohull-sloop-single-rudder.glb");
