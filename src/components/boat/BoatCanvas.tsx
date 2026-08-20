"use client";

import { Html, Line, ContactShadows, CameraControls, useGLTF, useCursor } from "@react-three/drei";
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
import { partMatchesFilter, type BoatDefinition, type BoatPart, type FilterId } from "@/lib/boats";

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

export function BoatCanvas(props: CanvasProps) {
  return (
    <Canvas
      camera={{
        position: props.boat.defaultCamera.position,
        fov: 42,
        near: 0.1,
        far: 80,
      }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => props.onSelect(null)}
    >
      <color attach="background" args={["#0b1f33"]} />
      <fog attach="fog" args={["#0b1f33", 12, 28]} />
      <hemisphereLight args={["#cfe7f5", "#163044", 0.9]} />
      <directionalLight position={[6, 8, 4]} intensity={1.35} color="#fff4e5" />
      <directionalLight position={[-4, 3, -6]} intensity={0.35} color="#7fb7d4" />
      <Suspense fallback={null}>
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
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35}
        scale={12}
        blur={2.4}
        far={8}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[7.5, 64]} />
        <meshStandardMaterial color="#12324a" roughness={0.95} metalness={0.05} />
      </mesh>
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
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map((material) => material.clone())
        : mesh.material.clone();
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
      const isSail = mesh.name === "sail";
      const highlighted = Boolean(
        selectedPart?.meshNames?.includes(mesh.name),
      );
      const dimmed =
        filter !== "all" &&
        ((isSail && !["rig", "mast", "boom", "standing-rig", "running-rig"].includes(filter)) ||
          (!isSail && filter !== "hull" && filter !== "aft"));

      for (const material of materials) {
        const std = material as THREE.MeshStandardMaterial;
        if (!("opacity" in std)) {
          continue;
        }
        std.transparent = true;
        std.opacity = dimmed ? 0.28 : 1;
        if ("emissive" in std) {
          std.emissive = new THREE.Color(highlighted ? "#2ea3c4" : "#000000");
          std.emissiveIntensity = highlighted ? 0.35 : 0;
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
              color={selected ? "#7ee0f2" : "#d7ecf4"}
              lineWidth={selected ? 2.4 : 1.4}
              transparent
              opacity={selected ? 0.95 : 0.45}
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
        const isOrientation = ORIENTATION_IDS.has(part.id);
        const showCompass = isOrientation;
        return (
          <group key={part.id} position={part.position}>
            <HotspotMesh
              radius={part.radius}
              active={active}
              selected={selected}
              onSelect={() => onSelect(part.id)}
              onHover={(value) => setHovered(value ? part.id : null)}
            />
            {(selected || hovered === part.id) && (
              <Html
                center
                distanceFactor={8}
                position={[0, part.radius + 0.18, 0]}
                style={{ pointerEvents: "none" }}
              >
                <div className="rounded-full bg-[var(--navy-deep)]/90 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-[var(--foam)] shadow-lg">
                  {labels[part.id]}
                </div>
              </Html>
            )}
            {showCompass && !selected && hovered !== part.id && (
              <Html
                center
                distanceFactor={10}
                position={[0, 0.22, 0]}
                style={{ pointerEvents: "none", opacity: 0.85 }}
              >
                <div className="rounded-full border border-white/15 bg-[var(--navy-deep)]/55 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-[var(--sand)]">
                  {labels[part.id]}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function HotspotMesh({
  radius,
  active,
  selected,
  onSelect,
  onHover,
}: {
  radius: number;
  active: boolean;
  selected: boolean;
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
      <sphereGeometry args={[selected ? radius * 1.15 : radius, 20, 20]} />
      <meshStandardMaterial
        color={selected ? "#2ea3c4" : "#f4efe6"}
        emissive={selected ? "#2ea3c4" : "#8fb7c8"}
        emissiveIntensity={selected ? 0.55 : 0.12}
        transparent
        opacity={active ? 0.62 : 0.12}
        roughness={0.35}
        metalness={0.05}
        depthWrite={false}
      />
    </mesh>
  );
}

useGLTF.preload("/models/monohull-sloop-single-rudder.glb");
