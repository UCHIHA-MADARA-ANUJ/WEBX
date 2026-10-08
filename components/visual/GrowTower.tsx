"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useSettings } from "@/components/providers/SettingsProvider";

const LEVELS = 7;
const TRAYS_PER_RING = 7;

type Ring = { y: number; radius: number };

const RINGS: Ring[] = Array.from({ length: LEVELS }, (_, i) => ({
  y: -1.5 + i * 0.52,
  radius: 1.32 - i * 0.085,
}));

const TRAY_POSITIONS: [number, number, number][] = RINGS.flatMap((ring, ringIndex) =>
  Array.from({ length: TRAYS_PER_RING }, (_, tray) => {
    const angle = (tray / TRAYS_PER_RING) * Math.PI * 2 + ringIndex * 0.42;
    const radius = ring.radius - 0.12;
    return [Math.cos(angle) * radius, ring.y + 0.045, Math.sin(angle) * radius] as [number, number, number];
  }),
);

function Trays() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(0.062, 0.02, 0.062), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#c8f7de" }), []);

  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    TRAY_POSITIONS.forEach((position, index) => {
      matrix.makeTranslation(position[0], position[1], position[2]);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  return <instancedMesh ref={ref} args={[geometry, material, TRAY_POSITIONS.length]} />;
}

function Mist() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 360;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 0.5 + Math.random() * 1.35;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -2 + Math.random() * 4.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#3fe08c"
        size={0.024}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Tower({ moving }: { moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const scan = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const node = group.current;
    if (!node) return;

    if (moving) node.rotation.y += delta * 0.1;
    node.position.x = THREE.MathUtils.lerp(node.position.x, state.pointer.x * 0.09, 0.04);
    node.position.y = THREE.MathUtils.lerp(node.position.y, -state.pointer.y * 0.06, 0.04);

    const mesh = scan.current;
    if (mesh && moving) {
      const t = (state.clock.elapsedTime % 9) / 9;
      const travel = t < 0.5 ? t * 2 : (1 - t) * 2;
      mesh.position.y = -1.62 + travel * 3.3;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = Math.sin(Math.PI * travel) * 0.45;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.36, 0.46, 3.9, 26, 1, true]} />
        <meshBasicMaterial
          color="#3fe08c"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {RINGS.map((ring, index) => (
        <group key={index}>
          <mesh position={[0, ring.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius, 0.0075, 8, 72]} />
            <meshBasicMaterial color="#3fe08c" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, ring.y - 0.055, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius - 0.1, 0.003, 6, 48]} />
            <meshBasicMaterial color="#5fe3d6" transparent opacity={0.22} />
          </mesh>
        </group>
      ))}

      <Trays />
      <Mist />

      <mesh position={[0, -1.78, 0]}>
        <cylinderGeometry args={[1.32, 1.44, 0.16, 48]} />
        <meshBasicMaterial color="#3fe08c" transparent opacity={0.09} depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.006, 8, 64]} />
        <meshBasicMaterial color="#3fe08c" transparent opacity={0.32} />
      </mesh>

      <mesh ref={scan} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <torusGeometry args={[1.06, 0.008, 8, 64]} />
        <meshBasicMaterial color="#5fe3d6" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/** If WebGL is unavailable or misbehaves we simply keep the SVG poster. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function GrowTower({ className }: { className?: string }) {
  const { ambient, tier } = useSettings();
  const [inView, setInView] = useState(true);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = holder.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? true), {
      threshold: 0.02,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!ambient || tier !== "high") return null;

  return (
    <div ref={holder} className={className} aria-hidden>
      <CanvasBoundary>
        <Canvas
          dpr={[1, 1.75]}
          frameloop={inView ? "always" : "never"}
          camera={{ position: [0, 0.2, 7.1], fov: 32 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.8} />
          <pointLight position={[3, 2, 3]} intensity={16} color="#3fe08c" distance={14} />
          <pointLight position={[-3, -1, 2]} intensity={10} color="#5fe3d6" distance={14} />
          <Tower moving={inView} />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
