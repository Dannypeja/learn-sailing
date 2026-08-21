"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { degToRad, wrap180 } from "@/lib/sailing";

const HULL = "#d9cbb3";
const DECK = "#c4a57a";
const CABIN = "#efe6d6";
const BOTTOM = "#1d3d55";
const ACCENT = "#2ea3c4";
const SPAR = "#f0ebe3";
const SAIL = "#f7f4ee";
const KEEL = "#8c2f2f";

const MAST_Z = 0.15;
const MAST_FOOT_Y = 0.42;
const MAST_TOP_Y = 3.35;
const BOOM_Y = 0.95;
const BOOM_LENGTH = 1.55;
const BOW_Z = 1.72;
const STERN_Z = -1.78;
const JIB_CLEW_RADIUS = 1.15;

type RigPose = {
  headingDeg: number;
  heelDeg: number;
  mainBoomDeg: number;
  jibDeg: number;
  billow: number;
  luffing: boolean;
};

function lerpAngle(current: number, target: number, lambda: number): number {
  return current + (target - current) * lambda;
}

export function SloopRig({ pose }: { pose: RigPose }) {
  const yaw = useRef<THREE.Group>(null);
  const roll = useRef<THREE.Group>(null);
  const boom = useRef<THREE.Group>(null);
  const displayed = useRef({
    heading: pose.headingDeg,
    heel: pose.heelDeg,
    boom: pose.mainBoomDeg,
  });

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-6 * delta);
    displayed.current.heading += wrap180(pose.headingDeg - displayed.current.heading) * k;
    displayed.current.heel = lerpAngle(displayed.current.heel, pose.heelDeg, k);
    displayed.current.boom = lerpAngle(displayed.current.boom, pose.mainBoomDeg, k);
    if (yaw.current) {
      yaw.current.rotation.y = degToRad(displayed.current.heading);
    }
    if (roll.current) {
      roll.current.rotation.z = degToRad(displayed.current.heel);
    }
    if (boom.current) {
      boom.current.rotation.y = degToRad(displayed.current.boom);
    }
  });

  const jibClew = useMemo(() => {
    const yawRad = degToRad(pose.jibDeg);
    return new THREE.Vector3(
      Math.sin(yawRad) * JIB_CLEW_RADIUS,
      1.05,
      BOW_Z - Math.cos(yawRad) * JIB_CLEW_RADIUS * 0.55,
    );
  }, [pose.jibDeg]);

  return (
    <group ref={yaw}>
      <group ref={roll}>
        <Hull />
        <Mast />
        <group ref={boom} position={[0, BOOM_Y, MAST_Z]}>
          <mesh position={[0, 0, -BOOM_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.04, BOOM_LENGTH, 8]} />
            <meshStandardMaterial color={SPAR} roughness={0.45} />
          </mesh>
          <Mainsail billow={pose.billow} luffing={pose.luffing} />
        </group>
        <Jib clew={jibClew} billow={pose.billow} luffing={pose.luffing} />
        <Rigging jibClew={jibClew} />
      </group>
    </group>
  );
}

function Hull() {
  return (
    <group>
      <mesh position={[0, 0.22, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.38, 2.55]} />
        <meshStandardMaterial color={HULL} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.22, 1.35]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.46, 0.85, 4]} />
        <meshStandardMaterial color={HULL} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.42, -0.08]} receiveShadow>
        <boxGeometry args={[0.88, 0.06, 2.45]} />
        <meshStandardMaterial color={DECK} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.68, 0.22]} castShadow>
        <boxGeometry args={[0.62, 0.46, 1.15]} />
        <meshStandardMaterial color={CABIN} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.72, -0.72]}>
        <boxGeometry args={[0.7, 0.12, 0.55]} />
        <meshStandardMaterial color="#1a3348" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.05, -0.1]}>
        <boxGeometry args={[0.94, 0.08, 2.4]} />
        <meshStandardMaterial color={BOTTOM} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.35, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.85, 0.85]} />
        <meshStandardMaterial color={KEEL} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.15, STERN_Z + 0.08]} castShadow>
        <boxGeometry args={[0.05, 0.55, 0.28]} />
        <meshStandardMaterial color={BOTTOM} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.58, STERN_Z + 0.35]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[0.04, 0.04, 0.7]} />
        <meshStandardMaterial color="#5c4030" roughness={0.7} />
      </mesh>
      <mesh position={[0.46, 0.3, 0.85]}>
        <boxGeometry args={[0.04, 0.12, 0.18]} />
        <meshStandardMaterial color="#2d8a4a" emissive="#2d8a4a" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.46, 0.3, 0.85]}>
        <boxGeometry args={[0.04, 0.12, 0.18]} />
        <meshStandardMaterial color="#b23b3b" emissive="#b23b3b" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.44, -0.05]}>
        <boxGeometry args={[0.94, 0.05, 0.08]} />
        <meshStandardMaterial color={ACCENT} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Mast() {
  const height = MAST_TOP_Y - MAST_FOOT_Y;
  return (
    <group position={[0, MAST_FOOT_Y, MAST_Z]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.05, height, 10]} />
        <meshStandardMaterial color={SPAR} roughness={0.4} metalness={0.12} />
      </mesh>
      <mesh position={[0, 2.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.7, 6]} />
        <meshStandardMaterial color={SPAR} roughness={0.45} />
      </mesh>
    </group>
  );
}

function Mainsail({ billow, luffing }: { billow: number; luffing: boolean }) {
  const head = useMemo(() => new THREE.Vector3(0, MAST_TOP_Y - BOOM_Y, 0), []);
  const tack = useMemo(() => new THREE.Vector3(0, 0.02, 0), []);
  const clew = useMemo(() => new THREE.Vector3(0, 0.02, -BOOM_LENGTH + 0.05), []);
  return (
    <SailCloth
      head={head}
      tack={tack}
      clew={clew}
      billow={billow}
      luffing={luffing}
      color={SAIL}
    />
  );
}

function Jib({
  clew,
  billow,
  luffing,
}: {
  clew: THREE.Vector3;
  billow: number;
  luffing: boolean;
}) {
  const head = useMemo(() => new THREE.Vector3(0, MAST_TOP_Y - 0.12, MAST_Z), []);
  const tack = useMemo(() => new THREE.Vector3(0, 0.5, BOW_Z), []);
  return (
    <SailCloth
      head={head}
      tack={tack}
      clew={clew}
      billow={billow * 0.85}
      luffing={luffing}
      color="#fffdf8"
    />
  );
}

function Rigging({ jibClew }: { jibClew: THREE.Vector3 }) {
  const forestay = useMemo(
    () => [new THREE.Vector3(0, MAST_TOP_Y, MAST_Z), new THREE.Vector3(0, 0.48, BOW_Z)],
    [],
  );
  const backstay = useMemo(
    () => [new THREE.Vector3(0, MAST_TOP_Y, MAST_Z), new THREE.Vector3(0, 0.48, STERN_Z)],
    [],
  );
  const shroudStbd = useMemo(
    () => [new THREE.Vector3(0, MAST_TOP_Y - 0.15, MAST_Z), new THREE.Vector3(0.42, 0.48, MAST_Z - 0.05)],
    [],
  );
  const shroudPort = useMemo(
    () => [new THREE.Vector3(0, MAST_TOP_Y - 0.15, MAST_Z), new THREE.Vector3(-0.42, 0.48, MAST_Z - 0.05)],
    [],
  );
  const sheet = useMemo(
    () => [jibClew.clone(), new THREE.Vector3(Math.sign(jibClew.x || 1) * 0.28, 0.5, -0.35)],
    [jibClew],
  );

  return (
    <group>
      <Stay points={forestay} />
      <Stay points={backstay} />
      <Stay points={shroudStbd} />
      <Stay points={shroudPort} />
      <Stay points={sheet} />
    </group>
  );
}

function Stay({ points }: { points: THREE.Vector3[] }) {
  return <Line points={points} color="#d7ecf4" lineWidth={1.2} transparent opacity={0.55} />;
}

const U_SEG = 7;
const V_SEG = 9;

function SailCloth({
  head,
  tack,
  clew,
  billow,
  luffing,
  color,
}: {
  head: THREE.Vector3;
  tack: THREE.Vector3;
  clew: THREE.Vector3;
  billow: number;
  luffing: boolean;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => makeSailGeometry(head, tack, clew, 0), [head, tack, clew]);

  useLayoutEffect(() => {
    if (luffing) {
      return;
    }
    updateSailGeometry(geometry, head, tack, clew, billow, 0);
  }, [geometry, head, tack, clew, billow, luffing]);

  useFrame((state) => {
    if (!luffing) {
      return;
    }
    const flutter = Math.sin(state.clock.elapsedTime * 14) * 0.07;
    updateSailGeometry(geometry, head, tack, clew, 0.12, flutter);
    if (meshRef.current) {
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        roughness={0.85}
        metalness={0}
        transparent
        opacity={0.92}
        depthWrite
      />
    </mesh>
  );
}

function makeSailGeometry(
  head: THREE.Vector3,
  tack: THREE.Vector3,
  clew: THREE.Vector3,
  belly: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const vertexCount = (U_SEG + 1) * (V_SEG + 1);
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3));
  const indices: number[] = [];
  for (let iv = 0; iv < V_SEG; iv += 1) {
    for (let iu = 0; iu < U_SEG; iu += 1) {
      const a = iu + iv * (U_SEG + 1);
      const b = a + 1;
      const c = a + (U_SEG + 1);
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  geometry.setIndex(indices);
  updateSailGeometry(geometry, head, tack, clew, belly, 0);
  geometry.computeVertexNormals();
  return geometry;
}

function updateSailGeometry(
  geometry: THREE.BufferGeometry,
  head: THREE.Vector3,
  tack: THREE.Vector3,
  clew: THREE.Vector3,
  belly: number,
  flutter: number,
): void {
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const luff = new THREE.Vector3().subVectors(head, tack);
  const foot = new THREE.Vector3().subVectors(clew, tack);
  const normal = new THREE.Vector3().crossVectors(foot, luff).normalize();
  if (normal.x * clew.x < 0) {
    normal.multiplyScalar(-1);
  }
  if (Math.abs(clew.x) < 0.02) {
    normal.set(1, 0, 0);
  }

  const luffP = new THREE.Vector3();
  const leechP = new THREE.Vector3();
  const point = new THREE.Vector3();

  let index = 0;
  for (let iv = 0; iv <= V_SEG; iv += 1) {
    const v = iv / V_SEG;
    for (let iu = 0; iu <= U_SEG; iu += 1) {
      const u = iu / U_SEG;
      luffP.lerpVectors(tack, head, u);
      leechP.lerpVectors(clew, head, u);
      point.lerpVectors(luffP, leechP, v);
      const shape = Math.sin(v * Math.PI) * Math.sin(u * Math.PI);
      const wave = flutter * Math.sin(u * Math.PI * 3) * Math.sin(v * Math.PI);
      point.addScaledVector(normal, (belly * 0.42 + wave) * shape);
      positions.setXYZ(index, point.x, point.y, point.z);
      index += 1;
    }
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}
