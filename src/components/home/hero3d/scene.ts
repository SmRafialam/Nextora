// Three.js scene for the homepage 3D scroll hero.
// Plain Three.js, loaded on demand. Two quality tiers:
//  - "high": standard (PBR) materials, one soft sun shadow, antialiasing.
//  - "low": for software rendering / weak devices — Lambert materials, no shadow maps
//    (soft "blob" shadows are textures instead), lower resolution, 30 fps cap.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Tier = "high" | "low";
export type HeroScene = {
  tier: Tier;
  /** 0 → 1 scroll progress through the hero. */
  setProgress(p: number): void;
  /** Normalised pointer position (-1..1) for a gentle parallax. */
  setPointer(x: number, y: number): void;
  /** Advance time-based motion and draw. Returns false when nothing changed (skip frame). */
  frame(timeMs: number): boolean;
  resize(w: number, h: number): void;
  dispose(): void;
};

const C = {
  bg: "#F3ECE1", wall: "#EFE6D8", floor: "#D9C8AF", rug: "#E8DCC9",
  sage: "#8E9A89", sageLight: "#9CA897", oak: "#C9AE8A", travertine: "#E6D9C4",
  ivory: "#F6F0E6", brass: "#B08D57", terracotta: "#C68C70", leaf: "#6F7C6B", leafDark: "#5E6A5B",
  window: "#FFFDF8", frame: "#E7DCCB", charcoal: "#4A4B47",
};

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const smooth = (t: number) => { const x = clamp01(t); return x * x * (3 - 2 * x); };
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

/** Detects software WebGL (SwiftShader, Microsoft Basic Render Driver, llvmpipe) or a very small device. */
export function detectTier(): Tier {
  try {
    const gl = document.createElement("canvas").getContext("webgl2") ?? document.createElement("canvas").getContext("webgl");
    if (!gl) return "low";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (/swiftshader|basic render|llvmpipe|software|mesa offscreen/i.test(name)) return "low";
    if ((navigator.hardwareConcurrency ?? 8) <= 2) return "low";
    return "high";
  } catch {
    return "low";
  }
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: { mobile: boolean; tier: Tier }): HeroScene {
  const { tier, mobile } = opts;
  const hi = tier === "high";
  const seg = hi ? 1 : 0.5; // geometry detail multiplier

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: hi, alpha: false, powerPreference: hi ? "high-performance" : "low-power" });
  renderer.setPixelRatio(hi ? Math.min(window.devicePixelRatio, mobile ? 1.5 : 2) : Math.min(window.devicePixelRatio, 1) * 0.75);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = hi ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = hi;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.Fog(C.bg, 12, 24);

  const camera = new THREE.PerspectiveCamera(mobile ? 50 : 36, 1, 0.1, 60);

  // ── Materials & helpers ──────────────────────────────────────────────────
  const mats: THREE.Material[] = [];
  const geos: THREE.BufferGeometry[] = [];
  const mat = (color: string, rough = 0.85, extra: { metalness?: number; emissive?: string; emissiveIntensity?: number; side?: THREE.Side } = {}) => {
    const m = hi
      ? new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: extra.metalness ?? 0, emissive: extra.emissive ?? "#000000", emissiveIntensity: extra.emissiveIntensity ?? 0, side: extra.side })
      : new THREE.MeshLambertMaterial({ color, emissive: extra.emissive ?? "#000000", emissiveIntensity: extra.emissiveIntensity ?? 0, side: extra.side });
    mats.push(m);
    return m;
  };
  const g = <T extends THREE.BufferGeometry>(geo: T) => { geos.push(geo); return geo; };
  const n = (v: number) => Math.max(6, Math.round(v * seg));
  const mesh = (geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0, shadow = true) => {
    const o = new THREE.Mesh(geo, m);
    o.position.set(x, y, z);
    o.castShadow = hi && shadow;
    o.receiveShadow = hi;
    return o;
  };
  const rbox = (w: number, h: number, d: number, r = 0.06) => g(new RoundedBoxGeometry(w, h, d, hi ? 4 : 2, r));

  // Soft radial texture, used for blob shadows and the lamp's glow halo.
  const radial = (inner: string, outer: string) => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const x = c.getContext("2d")!;
    const grd = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, inner);
    grd.addColorStop(1, outer);
    x.fillStyle = grd;
    x.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const shadowTex = radial("rgba(60,45,30,0.38)", "rgba(60,45,30,0)");
  const glowTex = radial("rgba(255,214,160,0.95)", "rgba(255,214,160,0)");
  const blob = (w: number, d: number) => {
    const m = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    mats.push(m);
    const o = new THREE.Mesh(g(new THREE.PlaneGeometry(w, d)), m);
    o.rotation.x = -Math.PI / 2;
    o.position.y = 0.012;
    return o;
  };

  // ── Products ─────────────────────────────────────────────────────────────
  function sofa() {
    const grp = new THREE.Group();
    const body = mat(C.sage), cushion = mat(C.sageLight), wood = mat(C.oak, 0.6);
    grp.add(mesh(rbox(2.3, 0.42, 0.95, 0.1), body, 0, 0.36, 0));
    grp.add(mesh(rbox(2.3, 0.62, 0.24, 0.1), body, 0, 0.78, -0.36));
    for (const x of [-1.06, 1.06]) grp.add(mesh(rbox(0.2, 0.62, 0.95, 0.08), body, x, 0.55, 0));
    for (const x of [-0.5, 0.5]) grp.add(mesh(rbox(0.98, 0.16, 0.7, 0.07), cushion, x, 0.64, 0.08));
    for (const x of [-0.48, 0.48]) grp.add(mesh(rbox(0.86, 0.48, 0.16, 0.08), cushion, x, 0.9, -0.2));
    grp.add(mesh(rbox(0.36, 0.3, 0.1, 0.05), mat(C.terracotta), -0.62, 0.86, -0.06));
    const leg = g(new THREE.CylinderGeometry(0.03, 0.025, 0.16, n(12)));
    for (const x of [-1.05, 1.05]) for (const z of [-0.36, 0.36]) grp.add(mesh(leg, wood, x, 0.08, z));
    grp.add(blob(3, 1.6));
    return grp;
  }

  function chair() {
    const grp = new THREE.Group();
    const boucle = mat("#EDE6DA", 1), ash = mat(C.oak, 0.6);
    grp.add(mesh(rbox(0.82, 0.18, 0.78, 0.08), boucle, 0, 0.42, 0.02));
    const back = mesh(rbox(0.82, 0.7, 0.16, 0.08), boucle, 0, 0.8, -0.32);
    back.rotation.x = -0.18;
    grp.add(back);
    for (const x of [-0.43, 0.43]) grp.add(mesh(rbox(0.1, 0.32, 0.7, 0.04), boucle, x, 0.6, 0));
    const leg = g(new THREE.CylinderGeometry(0.025, 0.02, 0.4, n(10)));
    for (const [x, z, rx] of [[-0.34, 0.3, 0.12], [0.34, 0.3, 0.12], [-0.34, -0.3, -0.12], [0.34, -0.3, -0.12]] as const) {
      const l = mesh(leg, ash, x, 0.19, z);
      l.rotation.x = rx;
      grp.add(l);
    }
    grp.add(blob(1.3, 1.3));
    return grp;
  }

  function lamp() {
    const grp = new THREE.Group();
    const wood = mat(C.oak, 0.6), brass = mat(C.brass, 0.35, { metalness: 0.6 });
    grp.add(mesh(g(new THREE.CylinderGeometry(0.3, 0.3, 0.05, n(40))), wood, 0, 0.58, 0));
    grp.add(mesh(g(new THREE.CylinderGeometry(0.05, 0.07, 0.56, n(16))), wood, 0, 0.28, 0));
    grp.add(mesh(g(new THREE.CylinderGeometry(0.2, 0.2, 0.03, n(32))), wood, 0, 0.015, 0));
    grp.add(mesh(g(new THREE.CylinderGeometry(0.11, 0.13, 0.04, n(32))), brass, 0, 0.63, 0));
    grp.add(mesh(g(new THREE.CylinderGeometry(0.015, 0.015, 0.42, n(12))), brass, 0, 0.84, 0));
    // Pleated linen shade: ridged cone that glows when the light comes on.
    const shadeGeo = g(new THREE.CylinderGeometry(0.15, 0.27, 0.3, hi ? 36 : 24, 1, true));
    const pos = shadeGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      const k = 1 + 0.06 * Math.sign(Math.sin(a * 18));
      pos.setX(i, pos.getX(i) * k);
      pos.setZ(i, pos.getZ(i) * k);
    }
    shadeGeo.computeVertexNormals();
    const shadeMat = mat(C.ivory, 0.9, { side: THREE.DoubleSide, emissive: "#FFD9A8", emissiveIntensity: 0.04 }) as THREE.MeshStandardMaterial | THREE.MeshLambertMaterial;
    grp.add(mesh(shadeGeo, shadeMat, 0, 1.1, 0, false));
    // Warm bulb light (no shadow map: a point-light shadow costs six extra renders a frame).
    const light = new THREE.PointLight("#FFD3A0", 0, 5.5, 1.6);
    light.position.set(0, 1.05, 0);
    grp.add(light);
    const haloMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
    mats.push(haloMat);
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(1.05, 1.05, 1);
    halo.position.set(0, 1.08, 0);
    grp.add(halo);
    grp.add(blob(0.9, 0.9));
    return { grp, light, shadeMat, haloMat };
  }

  function vase() {
    const pts = [[0, 0], [0.09, 0], [0.14, 0.08], [0.15, 0.18], [0.1, 0.3], [0.06, 0.36], [0.07, 0.4]].map(([x, y]) => new THREE.Vector2(x, y));
    const grp = new THREE.Group();
    grp.add(mesh(g(new THREE.LatheGeometry(pts, n(40))), mat(C.terracotta, 0.7)));
    const stem = mat(C.leafDark, 0.9);
    for (const [rx, rz, h] of [[0.25, 0.1, 0.4], [-0.2, -0.15, 0.34], [0.05, 0.3, 0.3]]) {
      const s = mesh(g(new THREE.CylinderGeometry(0.006, 0.006, h, 6)), stem, 0, 0.4 + h / 2, 0);
      s.rotation.set(rx, 0, rz);
      grp.add(s);
    }
    return grp;
  }

  function coffeeTable() {
    const grp = new THREE.Group();
    grp.add(mesh(g(new THREE.CylinderGeometry(0.62, 0.62, 0.07, n(48))), mat(C.travertine, 0.55), 0, 0.42, 0));
    grp.add(mesh(g(new THREE.CylinderGeometry(0.3, 0.36, 0.38, n(32))), mat(C.travertine, 0.6), 0, 0.19, 0));
    grp.add(blob(1.6, 1.6));
    return grp;
  }

  function planter() {
    const grp = new THREE.Group();
    grp.add(mesh(g(new THREE.CylinderGeometry(0.26, 0.2, 0.46, n(32))), mat(C.terracotta, 0.8), 0, 0.23, 0));
    const leafMats = [mat(C.leaf, 0.75), mat(C.leafDark, 0.75)];
    const leafGeo = g(new THREE.SphereGeometry(0.2, n(18), n(12)));
    for (const [x, y, z, rz, m] of [[0, 0.95, 0, 0.3, 0], [0.14, 0.78, 0.08, -0.6, 1], [-0.16, 0.82, -0.04, 0.7, 0], [0.04, 1.15, -0.1, 0.1, 1], [-0.08, 0.68, 0.14, 0.9, 0]] as const) {
      const l = mesh(leafGeo, leafMats[m], x, y, z);
      l.scale.set(0.55, 1.4, 0.22);
      l.rotation.set(0.2, x * 4, rz);
      grp.add(l);
    }
    grp.add(blob(0.8, 0.8));
    return grp;
  }

  function archWindow() {
    const shape = (w: number, h: number) => {
      const s = new THREE.Shape();
      s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
      return s;
    };
    const grp = new THREE.Group();
    grp.add(mesh(g(new THREE.ExtrudeGeometry(shape(1.8, 2.8), { depth: 0.06, bevelEnabled: false, curveSegments: n(24) })), mat(C.frame, 0.9), 0, 0, 0, false));
    const glassMat = new THREE.MeshBasicMaterial({ color: C.window });
    mats.push(glassMat);
    const glass = new THREE.Mesh(g(new THREE.ShapeGeometry(shape(1.56, 2.62), n(24))), glassMat);
    glass.position.set(0, 0.08, 0.07);
    grp.add(glass, mesh(g(new THREE.BoxGeometry(0.03, 2.5, 0.02)), mat(C.frame, 0.9), 0, 1.3, 0.08, false));
    return { grp, glassMat };
  }

  // ── Lights ───────────────────────────────────────────────────────────────
  const hemi = new THREE.HemisphereLight("#FFF8EE", "#C9B79C", hi ? 1.3 : 1.5);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#FFF1DC", hi ? 2.1 : 1.6);
  sun.position.set(-3, 7, 5);
  if (hi) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(mobile ? 1024 : 1536, mobile ? 1024 : 1536);
    Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
    sun.shadow.radius = 5;
    sun.shadow.bias = -0.0005;
  }
  scene.add(sun);

  // ── Room ─────────────────────────────────────────────────────────────────
  const floor = mesh(g(new THREE.PlaneGeometry(14, 10)), mat(C.floor, 0.95), 0, 0, 0, false);
  floor.rotation.x = -Math.PI / 2;
  const wall = mesh(g(new THREE.PlaneGeometry(14, 7)), mat(C.wall, 0.95), 0, 3.5, -3, false);
  const rug = mesh(rbox(3.6, 0.02, 2.4, 0.01), mat(C.rug, 1), 0.1, 0.01, -0.7, false);
  const win = archWindow();
  win.grp.position.set(0.9, 0.5, -2.97);
  scene.add(floor, wall, rug, win.grp);

  const pieces = {
    sofa: sofa(), chair: chair(), lamp: lamp(), table: coffeeTable(), vase: vase(), planter: planter(),
  };
  const place: Record<keyof typeof pieces, [number, number, number, number]> = {
    sofa: [0, 0, -1.9, 0], chair: [-2.35, 0, 0.1, 0.75], lamp: [-1.7, 0, -2.05, 0], table: [0.1, 0, -0.45, 0], vase: [0.28, 0.455, -0.5, 0], planter: [1.85, 0, -2.2, 0],
  };
  const items = Object.entries(pieces).map(([k, v], i) => {
    const obj = "grp" in v ? v.grp : v;
    const [x, y, z, ry] = place[k as keyof typeof pieces];
    obj.position.set(x, y, z);
    obj.rotation.y = ry;
    scene.add(obj);
    return { key: k, obj, base: new THREE.Vector3(x, y, z), ry, delay: i * 0.12 };
  });

  // ── Camera keyframes (scroll progress → where we stand / what we look at) ─
  const K = (p: number, pos: [number, number, number], look: [number, number, number]) => ({ p, pos: new THREE.Vector3(...pos), look: new THREE.Vector3(...look) });
  const keys = mobile
    ? [K(0, [0.3, 3.4, 9.6], [0, 0.6, -1]), K(0.3, [-1.3, 1.7, 3.6], [-2.35, 0.55, 0.1]), K(0.62, [-1.0, 1.5, 0.4], [-1.7, 1.0, -2.05]), K(1, [0.8, 1.6, 2.6], [0, 0.6, -1.7])]
    : [K(0, [0.4, 3.0, 8.4], [0.4, 0.7, -1.0]), K(0.3, [-0.6, 1.55, 3.0], [-2.1, 0.55, 0.0]), K(0.62, [-0.3, 1.5, 0.9], [-1.6, 0.95, -2.05]), K(1, [1.3, 1.5, 1.9], [0, 0.6, -1.7])];
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), tmp = new THREE.Vector3();
  const dusk = new THREE.Color("#E3D6C4");

  let progress = 0, px = 0, py = 0, sx = 0, sy = 0;
  let start = -1, last = 0, dirty = true;
  const intro = 1.8; // seconds for the pieces to float in on load

  function apply(time: number) {
    if (start < 0) start = time;
    const t = (time - start) / 1000;

    // Pieces float in once on load, then breathe gently.
    for (const it of items) {
      const k = easeOut((t - it.delay) / 0.9);
      it.obj.visible = k > 0.001;
      const bob = it.key === "vase" ? 0 : Math.sin(t * 1.1 + it.delay * 9) * 0.012 * k;
      it.obj.position.set(it.base.x, it.base.y + (1 - k) * 1.4 + bob, it.base.z);
      it.obj.scale.setScalar(0.8 + 0.2 * k);
    }
    // Featured pieces turn slowly as you scroll past them.
    pieces.chair.rotation.y = place.chair[3] + smooth((progress - 0.12) / 0.4) * 0.9 - 0.45 + Math.sin(t * 0.5) * 0.03;
    pieces.sofa.rotation.y = smooth((progress - 0.7) / 0.3) * -0.18;

    // Camera between keyframes, plus a small pointer parallax.
    let i = 0;
    while (i < keys.length - 2 && progress > keys[i + 1].p) i++;
    const a = keys[i], b = keys[i + 1], f = smooth((progress - a.p) / (b.p - a.p));
    camPos.copy(a.pos).lerp(b.pos, f);
    camLook.copy(a.look).lerp(b.look, f);
    sx += (px - sx) * 0.06; sy += (py - sy) * 0.06;
    camera.position.copy(camPos).add(tmp.set(sx * 0.35, -sy * 0.2, 0));
    camera.lookAt(camLook);

    // The lamp comes on as it becomes the focus; daylight dims a little.
    const glow = smooth((progress - 0.4) / 0.2);
    pieces.lamp.light.intensity = glow * (hi ? 5 : 3.5);
    pieces.lamp.shadeMat.emissiveIntensity = 0.04 + glow * 0.7;
    pieces.lamp.haloMat.opacity = glow * 0.5;
    hemi.intensity = (hi ? 1.3 : 1.5) - glow * 0.45;
    sun.intensity = (hi ? 2.1 : 1.6) - glow * 0.9;
    win.glassMat.color.set(C.window).lerp(dusk, glow * 0.6);
  }

  return {
    tier,
    setProgress(p) { if (Math.abs(p - progress) > 1e-5) { progress = p; dirty = true; } },
    setPointer(x, y) { px = x; py = y; dirty = true; },
    frame(time) {
      // 30 fps cap in the low tier; always draw during the intro and while things are settling.
      if (!hi && time - last < 33) return false;
      const settling = start < 0 || (time - start) / 1000 < intro + 0.6 || Math.abs(px - sx) > 0.002 || Math.abs(py - sy) > 0.002;
      if (!dirty && !settling && !hi) return false;
      last = time;
      apply(time);
      renderer.render(scene, camera);
      dirty = false;
      return true;
    },
    resize(w, h) { renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); dirty = true; },
    dispose() {
      geos.forEach((x) => x.dispose());
      mats.forEach((m) => m.dispose());
      shadowTex.dispose(); glowTex.dispose();
      renderer.dispose();
    },
  };
}
