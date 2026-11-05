"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Project } from "@/content/projects";
import type { TheatreStore } from "./store";

const R = 9.5; // ring radius
const PANEL_W = 5.6;
const PANEL_H = 3.5;
const ARC = PANEL_W / R;
/** Angle between panels: a gap when there is room, otherwise the ring closes evenly. */
const stepFor = (n: number) => Math.min(ARC + 0.18, (Math.PI * 2) / n);

/* ---------- media textures ---------- */
// The inner face of a cylinder is mirrored, so flip the texture back.
function mirror<T extends THREE.Texture>(t: T) {
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.x = -1;
  t.offset.x = 1;
  return t;
}

// Small deterministic PRNG so the dust field is the same on every render.
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
function useMediaTexture(p: Project, index: number, store: TheatreStore) {
  const { tex, video } = useMemo(() => {
    if (p.media.loop) {
      const v = document.createElement("video");
      v.src = p.media.loop;
      v.crossOrigin = "anonymous";
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.preload = "auto";
      v.poster = p.media.poster;
      const t = new THREE.VideoTexture(v);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
      return { tex: mirror(t), video: v };
    }
    const t = new THREE.TextureLoader().load(p.media.poster || p.media.screens[0]);
    t.colorSpace = THREE.SRGBColorSpace;
    return { tex: mirror(t), video: null as HTMLVideoElement | null };
  }, [p]);
  const videoRef = useRef(video);

  useEffect(() => () => {
    video?.pause();
    video?.removeAttribute("src");
    video?.load();
    tex.dispose();
  }, [tex, video]);

  // only the front panel (and its neighbours, paused) decode video
  useFrame(() => {
    const video = videoRef.current;
    if (!video) return;
    const d = Math.abs(store.active - index);
    if (d < 0.6 && store.visible) {
      if (video.paused) video.play().catch(() => {});
    } else if (!video.paused) video.pause();
    if (d < 1.6 && video.preload !== "auto") video.preload = "auto";
  });
  return tex;
}

/* ---------- one curved screen ---------- */
function Panel({ p, index, step, store, onOpen }: { p: Project; index: number; step: number; store: TheatreStore; onOpen: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const frame = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useMediaTexture(p, index, store);

  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(R, R, PANEL_H, 64, 1, true, Math.PI - ARC / 2, ARC);
    g.translate(0, 0, R);
    return g;
  }, []);
  const frameGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(R + 0.04, R + 0.04, PANEL_H + 0.14, 64, 1, true, Math.PI - (ARC + 0.02) / 2, ARC + 0.02);
    g.translate(0, 0, R);
    return g;
  }, []);

  const angle = index * step;
  useFrame((_, dt) => {
    const g = group.current;
    if (!g || !mat.current) return;
    const d = Math.abs(store.active - index);
    const focus = THREE.MathUtils.clamp(1 - d, 0, 1);
    const b = 0.22 + 0.78 * Math.pow(focus, 1.4);
    mat.current.color.setScalar(THREE.MathUtils.damp(mat.current.color.r, b, 6, dt));
    if (frame.current) frame.current.opacity = 0.05 + focus * 0.25;
    // lean toward the pointer when in front
    const lean = focus * (store.hoverPanel ? 1 : 0.55);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -angle + store.pointer.x * 0.12 * lean, 5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -store.pointer.y * 0.08 * lean, 5, dt);
    const s = 0.92 + 0.08 * focus;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 5, dt));
  });

  return (
    <group ref={group} position={[R * Math.sin(angle) * 1, 0, -R * Math.cos(angle)]} rotation={[0, -angle, 0]}>
      <mesh geometry={frameGeo} position={[0, 0, 0.02]}>
        <meshBasicMaterial ref={frame} color="#f3f2ef" side={THREE.BackSide} transparent opacity={0.1} toneMapped={false} />
      </mesh>
      <mesh
        geometry={geo}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(index);
        }}
        onPointerOver={() => (document.body.dataset.theatreHover = String(index))}
        onPointerOut={() => delete document.body.dataset.theatreHover}
      >
        <meshBasicMaterial ref={mat} map={tex} side={THREE.BackSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- the glass Z ---------- */
function GlassZ({ store, full }: { store: TheatreStore; full: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const pts: [number, number][] = [
      [0, 100], [100, 100], [100, 82], [30, 18], [100, 18], [100, 0], [0, 0], [0, 18], [70, 82], [0, 82],
    ];
    const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
    const g = new THREE.ExtrudeGeometry(shape, { depth: 26, bevelEnabled: true, bevelThickness: 5, bevelSize: 3.5, bevelSegments: 5, curveSegments: 4 });
    g.center();
    g.scale(0.017, 0.017, 0.017);
    return g;
  }, []);

  // Big in the centre when you land inside; a moment later it glides to the top-left corner and stays there.
  // It only returns to the centre if you scroll back up into the intro.
  const settle = useRef(0);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    settle.current = store.intro >= 0.97 ? settle.current + dt : Math.max(0, settle.current - dt * 3);
    const t = THREE.MathUtils.smoothstep(settle.current, 0.6, 2.0);
    const big = 1 - t;
    const s = 0.24 + 0.78 * big;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 5, dt));
    const tx = THREE.MathUtils.lerp(-1.45, 0, big);
    const ty = THREE.MathUtils.lerp(0.7, 0, big);
    g.position.x = THREE.MathUtils.damp(g.position.x, tx + store.pointer.x * 0.1, 5, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, ty + store.pointer.y * 0.06, 5, dt);
    g.rotation.y += dt * (0.3 + big * 0.8);
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.16;
  });

  return (
    <group ref={ref} position={[0, 0, -4.8]}>
      <mesh geometry={geo}>
        {full ? (
          <MeshTransmissionMaterial
            samples={6}
            resolution={512}
            thickness={0.55}
            roughness={0.04}
            ior={1.42}
            chromaticAberration={0.6}
            anisotropy={0.25}
            distortion={0.35}
            distortionScale={0.4}
            temporalDistortion={0.12}
            backside
            backsideThickness={0.3}
            color="#f3f2ef"
          />
        ) : (
          <meshPhysicalMaterial color="#d9d6d0" metalness={0.9} roughness={0.18} clearcoat={1} />
        )}
      </mesh>
      <mesh position={[0.78 * 1.04, 0.62, 0.05]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial color="#ff5a1f" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- grid room ---------- */
function Room() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `
          varying vec2 vUv; uniform float uTime;
          float line(float x, float w){ float d=abs(fract(x)-0.5); return smoothstep(0.5-w,0.5,d); }
          void main(){
            vec2 g = vec2(vUv.x*64.0, vUv.y*14.0);
            float l = max(line(g.x+0.5,0.012), line(g.y+0.5,0.02));
            vec2 c = abs(fract(g)-0.5);
            float plus = (step(c.x,0.012)*step(c.y,0.09)+step(c.y,0.018)*step(c.x,0.045));
            vec2 cc = abs(fract(g/2.0)-0.5);
            float big = step(cc.x,0.006)*step(cc.y,0.05)+step(cc.y,0.012)*step(cc.x,0.022);
            float fade = smoothstep(0.0,0.35,vUv.y)*smoothstep(1.0,0.65,vUv.y);
            float a = (l*0.05 + min(plus,1.0)*0.18 + min(big,1.0)*0.35) * fade;
            gl_FragColor = vec4(vec3(0.95,0.94,0.93), a);
          }`,
      }),
    [],
  );
  const matRef = useRef<THREE.ShaderMaterial>(mat);
  useFrame((_, dt) => {
    matRef.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh material={mat}>
      <cylinderGeometry args={[17, 17, 26, 96, 1, true]} />
    </mesh>
  );
}

/* ---------- WORKS word far behind ---------- */
function BackWord({ store }: { store: TheatreStore }) {
  const mesh = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 2048;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const family = getComputedStyle(document.body).getPropertyValue("--font-anton").trim() || "Impact";
    ctx.font = `400 430px ${family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(243,242,239,0.9)";
    ctx.strokeText("WORKS", 1024, 270);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useFrame((_, dt) => {
    if (!mesh.current) return;
    const m = mesh.current.material as THREE.MeshBasicMaterial;
    m.opacity = THREE.MathUtils.damp(m.opacity, 0.07 + 0.1 * (1 - store.intro), 3, dt);
    mesh.current.position.x = -store.active * 0.6 + 2;
  });
  return (
    <mesh ref={mesh} position={[0, 1.4, -16]}>
      <planeGeometry args={[24, 6]} />
      <meshBasicMaterial map={tex} transparent opacity={0.1} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 500;
    const rand = seeded(7);
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3 + rand() * 12;
      const t = rand() * Math.PI * 2;
      a[i * 3] = Math.cos(t) * r;
      a[i * 3 + 1] = (rand() - 0.5) * 10;
      a[i * 3 + 2] = Math.sin(t) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.025} color="#f3f2ef" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig({ store }: { store: TheatreStore }) {
  useFrame(({ camera }, dt) => {
    const introPush = (1 - store.intro) * 2.4;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, store.pointer.x * 0.35, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, store.pointer.y * 0.2, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, -1 + introPush, 3, dt);
    camera.lookAt(0, 0, -R);
  });
  return null;
}

function Ring({ projects, store, onOpen }: { projects: Project[]; store: TheatreStore; onOpen: (i: number) => void }) {
  const ring = useRef<THREE.Group>(null);
  const step = stepFor(projects.length);
  useFrame(() => {
    if (ring.current) ring.current.rotation.y = store.active * step;
  });
  return (
    <group ref={ring}>
      {projects.map((p, i) => (
        <Panel key={p.slug} p={p} index={i} step={step} store={store} onOpen={onOpen} />
      ))}
    </group>
  );
}

export default function Theatre({
  projects,
  store,
  full,
  onOpen,
}: {
  projects: Project[];
  store: TheatreStore;
  full: boolean;
  onOpen: (i: number) => void;
}) {
  return (
    <Canvas
      dpr={full ? [1, 1.6] : 1}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 0, 1.4] }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor("#0b0c0e")}
    >
      <fog attach="fog" args={["#0b0c0e", 13, 30]} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, -4]} scale={[10, 2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.2} position={[-5, 0, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#ffd9c7" />
        <Lightformer form="rect" intensity={1} position={[5, 0, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#dfe8f2" />
        <Lightformer form="ring" intensity={0.8} position={[0, 0, 5]} scale={4} color="#ffffff" />
      </Environment>
      <Room />
      <BackWord store={store} />
      <Dust />
      <Ring projects={projects} store={store} onOpen={onOpen} />
      <GlassZ store={store} full={full} />
      <Rig store={store} />
    </Canvas>
  );
}
