/**
 * Scène 3D du hero : port TypeScript fidèle de `talgasy-hero3d.js` (maquette Claude Design,
 * référence three r128 — d'où la version exacte épinglée dans package.json). Logo TG extrudé,
 * fumée, carte du monde jour/nuit, détonations Montréal ↔ Madagascar, curseur qui soulève la
 * carte, sortie au défilement où le logo se dissout. Chargé à la demande (import dynamique)
 * pour que three.js ne pèse pas sur le premier affichage.
 */
import * as THREE from "three";

import { HERO_MAP as MAP } from "./map-data";

export type HeroSceneOptions = { skipIntro: boolean; mapIntensity: number | null; logoScale: number | null };
export type HeroScene = {
  setExit: (p: number) => void;
  setMap: (v: number) => void;
  setActive: (v: boolean) => void;
  dispose: () => void;
};

const CONFIG = { tint: 0.0, map: 2.0, night: 0.38, loop: 9.0, extrude: 0.3, smoke: 1.0, clear: 0.16, rough: 0.34, bloom: 0.12, swing: 0.45 };
const BG = 0x021b26;

type Plane = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
type Puff = {
  mesh: Plane;
  phase: number;
  nx: number;
  ny: number;
  z: number;
  dx: number;
  dy: number;
  s0: number;
  grow: number;
  rot0: number;
  rotV: number;
  wob: number;
  wobK: number;
  peak: number;
};
type Burst = {
  mesh: Plane;
  x: number;
  y: number;
  z: number;
  dx: number;
  up: number;
  s0: number;
  grow: number;
  rot: number;
  rv: number;
  peak: number;
  d0: number;
};
type PulseUniforms = {
  uTau: { value: number };
  uFire: { value: number };
  uBeacon: { value: number };
  uHS: { value: number };
  uRmax: { value: number };
  uVis: { value: number };
};
type Post = {
  scene: THREE.Scene;
  cam: THREE.Camera;
  quad: THREE.Mesh<THREE.PlaneGeometry, THREE.Material>;
  rtScene: THREE.WebGLRenderTarget;
  rtBright: THREE.WebGLRenderTarget;
  rtA: THREE.WebGLRenderTarget;
  rtB: THREE.WebGLRenderTarget;
  bright: THREE.ShaderMaterial;
  blur: THREE.ShaderMaterial;
  comp: THREE.ShaderMaterial;
};

export function createHeroScene(host: HTMLElement, pointerArea: HTMLElement, opts: HeroSceneOptions): HeroScene {
  const D2R = Math.PI / 180;
  const mobile = host.clientWidth < 768;
  const reduce = !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sstep = (a: number, b: number, x: number) => {
    let t = (x - a) / (b - a);
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    return t * t * (3 - 2 * t);
  };
  const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

  /* contours exacts du monogramme */
  const PATH_T: [number, number][] = [[0, 0], [0, 225], [439, 225], [439, 1771], [707, 1771], [707, 225], [2129, 225], [2129, 0]];
  const PATH_G: [number, number][] = [[1018, 348], [1018, 1771], [2129, 1771], [2129, 579], [1525, 579], [1525, 798], [1872, 798], [1872, 1531], [1300, 1531], [1300, 348]];
  const mkShape = (p: [number, number][]) => {
    const s = new THREE.Shape();
    p.forEach((pt, i) => {
      const x = (pt[0] - 2129 / 2) / 1000;
      const y = -(pt[1] - 1771 / 2) / 1000;
      if (i === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
    s.closePath();
    return s;
  };
  const SHAPES = [mkShape(PATH_T), mkShape(PATH_G)];

  const noiseFactory = (seed: number) => {
    const G = new Float32Array(4096);
    let s = seed * 9301 + 49297;
    for (let i = 0; i < 4096; i++) {
      s = (s * 9301 + 49297) % 233280;
      G[i] = s / 233280;
    }
    const h = (i: number, j: number) => G[((i & 63) * 64 + (j & 63)) & 4095];
    return (x: number, y: number, cells: number) => {
      const gx = x * cells;
      const gy = y * cells;
      const i = Math.floor(gx);
      const j = Math.floor(gy);
      let fx = gx - i;
      let fy = gy - j;
      fx = fx * fx * (3 - 2 * fx);
      fy = fy * fy * (3 - 2 * fy);
      const a = h(i, j);
      const b = h(i + 1, j);
      const c = h(i, j + 1);
      const d = h(i + 1, j + 1);
      const t = a + (b - a) * fx;
      return t + (c + (d - c) * fx - t) * fy;
    };
  };

  const smokeTexture = (seed: number) => {
    const S = 192;
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const cx = cv.getContext("2d");
    if (!cx) return new THREE.Texture();
    const img = cx.createImageData(S, S);
    const vn = noiseFactory(seed);
    const wn = noiseFactory(seed + 17);
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const v = y / S;
        const wx = wn(u, v, 3) - 0.5;
        const wy = wn(u + 0.37, v + 0.71, 3) - 0.5;
        const uu = u + wx * 0.38;
        const vv = v + wy * 0.38;
        let f = 0;
        let amp = 0.5;
        let c = 3;
        for (let o = 0; o < 5; o++) {
          f += amp * vn(uu, vv, c);
          c *= 2;
          amp *= 0.5;
        }
        const dx = u - 0.5;
        const dy = v - 0.5;
        const r = Math.min(1, Math.sqrt(dx * dx + dy * dy) * 2.05);
        let mask = 1 - r;
        mask = mask * mask * (3 - 2 * mask);
        let a = (f * 1.55 - 0.48) * mask * 1.9;
        a = a < 0 ? 0 : a > 1 ? 1 : a;
        const k = (y * S + x) * 4;
        img.data[k] = 255;
        img.data[k + 1] = 255;
        img.data[k + 2] = 255;
        img.data[k + 3] = (a * 255) | 0;
      }
    cx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(cv);
    t.minFilter = THREE.LinearFilter;
    return t;
  };

  const microMaps = () => {
    const S = 256;
    const hn = noiseFactory(91);
    const h = new Float32Array(S * S);
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const u = x / S;
        const v = y / S;
        let f = 0;
        let amp = 0.5;
        let c = 8;
        for (let o = 0; o < 4; o++) {
          f += amp * hn(u, v, c);
          c *= 2.3;
          amp *= 0.5;
        }
        h[y * S + x] = f;
      }
    const rc = document.createElement("canvas");
    rc.width = rc.height = S;
    const rx = rc.getContext("2d");
    const nc = document.createElement("canvas");
    nc.width = nc.height = S;
    const nx = nc.getContext("2d");
    if (rx && nx) {
      const ri = rx.createImageData(S, S);
      for (let i = 0; i < S * S; i++) {
        let g = 0.74 + h[i] * 0.44;
        g = g > 1 ? 1 : g;
        ri.data[i * 4] = ri.data[i * 4 + 1] = ri.data[i * 4 + 2] = (g * 255) | 0;
        ri.data[i * 4 + 3] = 255;
      }
      rx.putImageData(ri, 0, 0);
      const ni = nx.createImageData(S, S);
      for (let y2 = 0; y2 < S; y2++)
        for (let x2 = 0; x2 < S; x2++) {
          const l = h[y2 * S + ((x2 - 1 + S) % S)];
          const r = h[y2 * S + ((x2 + 1) % S)];
          const d = h[((y2 + 1) % S) * S + x2];
          const up = h[((y2 - 1 + S) % S) * S + x2];
          const nX = (l - r) * 2.2;
          const nY = (up - d) * 2.2;
          const nZ = 1.0;
          const len = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
          const k = (y2 * S + x2) * 4;
          ni.data[k] = (((nX / len) * 0.5 + 0.5) * 255) | 0;
          ni.data[k + 1] = (((nY / len) * 0.5 + 0.5) * 255) | 0;
          ni.data[k + 2] = (((nZ / len) * 0.5 + 0.5) * 255) | 0;
          ni.data[k + 3] = 255;
        }
      nx.putImageData(ni, 0, 0);
    }
    const tex = (c: HTMLCanvasElement) => {
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(5, 5);
      return t;
    };
    return { rough: tex(rc), norm: tex(nc) };
  };

  /* renderer */
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
  const DPR = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
  renderer.setPixelRatio(DPR);
  renderer.sortObjects = true;
  const canvas = renderer.domElement;
  canvas.style.cssText = "display:block;width:100%;height:100%;opacity:0;transition:opacity .6s ease;touch-action:pan-y";
  host.appendChild(canvas);
  const isGL2 = !!renderer.capabilities.isWebGL2;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 5.3);
  const TANH = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5));

  /* environnement studio */
  try {
    const EW = 1024;
    const EH = 512;
    const ec = document.createElement("canvas");
    ec.width = EW;
    ec.height = EH;
    const ex = ec.getContext("2d");
    if (ex) {
      const lg = ex.createLinearGradient(0, 0, 0, EH);
      lg.addColorStop(0, "#1a4a5c");
      lg.addColorStop(0.42, "#0a2733");
      lg.addColorStop(0.52, "#03151e");
      lg.addColorStop(1, "#010a10");
      ex.fillStyle = lg;
      ex.fillRect(0, 0, EW, EH);
      const softbox = (x: number, y: number, w: number, hh: number, col: string, blur: number) => {
        ex.save();
        try {
          ex.filter = `blur(${blur}px)`;
        } catch {
          // navigateur sans filtre de canevas : la boîte reste nette
        }
        ex.fillStyle = col;
        ex.beginPath();
        if (typeof ex.roundRect === "function") ex.roundRect(x, y, w, hh, Math.min(w, hh) * 0.45);
        else ex.rect(x, y, w, hh);
        ex.fill();
        ex.restore();
      };
      softbox(90, 40, 300, 130, "rgba(255,255,255,0.92)", 26);
      softbox(600, 70, 240, 100, "rgba(210,255,238,0.62)", 30);
      softbox(380, 250, 420, 90, "rgba(48,217,140,0.34)", 44);
      softbox(-40, 200, 180, 120, "rgba(23,126,79,0.30)", 40);
      const envTex = new THREE.CanvasTexture(ec);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      const pm = new THREE.PMREMGenerator(renderer);
      pm.compileEquirectangularShader();
      scene.environment = pm.fromEquirectangular(envTex).texture;
      envTex.dispose();
      pm.dispose();
    }
  } catch {
    // sans environnement, le logo garde ses lumières directes
  }

  /* logo */
  const FOREST = new THREE.Color(0x177e4f);
  const BRIGHT = new THREE.Color(0x30d98c);
  const MM = microMaps();
  const matFace = new THREE.MeshPhysicalMaterial({
    color: FOREST.clone(),
    metalness: 0.22,
    roughness: CONFIG.rough,
    clearcoat: 1.0,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.0,
    roughnessMap: MM.rough,
    normalMap: MM.norm,
    normalScale: new THREE.Vector2(0.14, 0.14),
  });
  const matSide = new THREE.MeshPhysicalMaterial({
    color: FOREST.clone().multiplyScalar(0.62),
    metalness: 0.86,
    roughness: Math.max(0.05, CONFIG.rough * 0.85),
    clearcoat: 0.45,
    clearcoatRoughness: 0.28,
    envMapIntensity: 1.4,
    roughnessMap: MM.rough,
    normalMap: MM.norm,
    normalScale: new THREE.Vector2(0.22, 0.22),
  });
  matFace.color.copy(FOREST).lerp(BRIGHT, CONFIG.tint);
  matSide.color.copy(matFace.color).multiplyScalar(0.62);

  const dissolveU = { uDissolve: { value: 0 }, uEdgeCol: { value: new THREE.Color(0x1d5a45) } };
  const DISSOLVE_FNS = [
    "varying vec3 vTgObj;",
    "uniform float uDissolve;",
    "uniform vec3 uEdgeCol;",
    "float tgHash3(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }",
    "float tgNoise3(vec3 p){",
    "  vec3 i=floor(p); vec3 f=fract(p); f=f*f*(3.0-2.0*f);",
    "  float a=tgHash3(i), b=tgHash3(i+vec3(1.0,0.0,0.0)), c=tgHash3(i+vec3(0.0,1.0,0.0)), d=tgHash3(i+vec3(1.0,1.0,0.0));",
    "  float e=tgHash3(i+vec3(0.0,0.0,1.0)), g=tgHash3(i+vec3(1.0,0.0,1.0)), h=tgHash3(i+vec3(0.0,1.0,1.0)), k=tgHash3(i+vec3(1.0,1.0,1.0));",
    "  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z);",
    "}",
  ].join("\n");
  const DISSOLVE_CLIP = [
    "float tgN=tgNoise3(vTgObj*3.2)*0.62+tgNoise3(vTgObj*7.4+7.1)*0.38+(vTgObj.y+0.9)*0.10;",
    "if(tgN<uDissolve) discard;",
    "float tgEdge=(1.0-smoothstep(uDissolve,uDissolve+0.07,tgN))*step(0.001,uDissolve);",
  ].join("\n");
  const addDissolve = (mat: THREE.MeshPhysicalMaterial) => {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uDissolve = dissolveU.uDissolve;
      sh.uniforms.uEdgeCol = dissolveU.uEdgeCol;
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vTgObj;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvTgObj=position;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", `#include <common>\n${DISSOLVE_FNS}`)
        .replace("#include <clipping_planes_fragment>", `#include <clipping_planes_fragment>\n${DISSOLVE_CLIP}`)
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance+=uEdgeCol*tgEdge;");
    };
    mat.needsUpdate = true;
  };
  addDissolve(matFace);
  addDissolve(matSide);

  const bev = Math.min(0.022, CONFIG.extrude * 0.16);
  const logoGeo = new THREE.ExtrudeGeometry(SHAPES, { depth: CONFIG.extrude, curveSegments: 1, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 5 });
  logoGeo.center();
  logoGeo.computeVertexNormals();
  const logo = new THREE.Mesh(logoGeo, [matFace, matSide]);
  logo.scale.setScalar(opts.logoScale || 0.82);
  scene.add(logo);
  const LOGO_Y0 = 0.28; // logo légèrement remonté : dégage la zone du titre
  // En portrait (tablette), le texte du hero occupe la moitié basse : le logo remonte vers
  // le tiers haut du panneau au lieu de rester au centre, derrière le titre. Écart à la
  // maquette, qui ne prévoit que le paysage. Recalculé à chaque redimensionnement.
  let logoY = LOGO_Y0;

  /* lumières */
  scene.add(new THREE.AmbientLight(0x0b2520, 0.2));
  const key = new THREE.DirectionalLight(0xf2fff8, 1.9);
  key.position.set(4.2, 5.2, 2.6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x30d98c, 0.28);
  fill.position.set(-4, -2, 2.5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xa9e8cd, 2.0);
  rim.position.set(-0.5, 1.4, -5);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x9effd2, 0.75);
  rim2.position.set(2.2, -1.6, -4);
  scene.add(rim2);
  const sweep = new THREE.PointLight(0xffffff, 2.3, 16, 2);
  scene.add(sweep);

  /* fumée */
  const TEX = [smokeTexture(3), smokeTexture(29), smokeTexture(101), smokeTexture(211)];
  const smokeGroup = new THREE.Group();
  scene.add(smokeGroup);
  const WX = 1.0;
  const WY = 0.82;
  const WN = Math.sqrt(WX * WX + WY * WY);
  const radial = (nx: number, ny: number) => Math.sqrt(nx * WX * (nx * WX) + ny * WY * (ny * WY)) / WN;
  const samplePos = (minR: number, bias: number): [number, number, number] => {
    for (let k = 0; k < 400; k++) {
      const nx = (Math.random() * 2 - 1) * 1.06;
      const ny = (Math.random() * 2 - 1) * 1.06;
      const r = radial(nx, ny);
      if (r < minR) continue;
      const pr = Math.pow(Math.min(1, (r - minR) / (1.08 - minR)), bias);
      if (Math.random() < pr) return [nx, ny, r];
    }
    return [1.1 * (Math.random() < 0.5 ? -1 : 1), 1.0 * (Math.random() < 0.5 ? -1 : 1), 1.05];
  };
  const puffs: Puff[] = [];
  const N_BODY = mobile ? 60 : 112;
  for (let i = 0; i < N_BODY; i++) {
    const s = samplePos(0.1, 0.75);
    const L = 0.33 - Math.min(1, s[2]) * 0.15 + (Math.random() - 0.5) * 0.06;
    const col = new THREE.Color().setHSL(0.424 + (Math.random() - 0.5) * 0.05, 0.24 + Math.random() * 0.18, L);
    const mesh: Plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: TEX[(Math.random() * TEX.length) | 0], color: col, transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending, opacity: 0 }),
    );
    mesh.renderOrder = 5;
    const inv = 1 / (s[2] + 1e-3);
    const p: Puff = {
      mesh,
      phase: i / N_BODY + Math.random() * (0.85 / N_BODY),
      nx: s[0],
      ny: s[1],
      z: -2.9 + Math.random() * 4.3,
      dx: s[0] * inv * 0.045 * Math.random() + (Math.random() - 0.5) * 0.05,
      dy: s[1] * inv * 0.045 * Math.random() + (Math.random() - 0.5) * 0.05,
      s0: (1.05 + Math.random() * 1.55) * (0.72 + 0.5 * Math.min(1.1, s[2])),
      grow: 0.6 + Math.random() * 0.8,
      rot0: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.75,
      wob: 0.012 + Math.random() * 0.03,
      wobK: 1 + ((Math.random() * 2) | 0),
      peak: 0.1 + Math.random() * 0.2,
    };
    if (p.z > 0.35 && s[2] < 0.55) p.z = -2.9 + Math.random() * 2.6;
    puffs.push(p);
    smokeGroup.add(mesh);
  }

  const hazeU = { uClear: { value: CONFIG.clear }, uDensity: { value: CONFIG.smoke }, uCol: { value: new THREE.Color(0x14463a) } };
  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: hazeU,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }",
      fragmentShader: [
        "precision highp float; varying vec2 vUv;",
        "uniform float uClear,uDensity; uniform vec3 uCol;",
        "void main(){",
        "  vec2 q=(vUv-0.5)*2.0;",
        "  float r=length(q*vec2(1.0,0.82))/1.2932;",
        "  float a=smoothstep(uClear+0.10,1.12,r)*0.62*uDensity;",
        "  gl_FragColor=vec4(uCol,clamp(a,0.0,0.82));",
        "}",
      ].join("\n"),
    }),
  );
  haze.frustumCulled = false;
  haze.renderOrder = 30;
  scene.add(haze);

  let scrollT = 0;
  let scrollS = 0;
  const updateSmoke = (t: number) => {
    const cR = CONFIG.clear * (1 - sstep(0, 0.6, scrollS));
    const sM = CONFIG.smoke * (1 + 0.5 * sstep(0, 0.5, scrollS));
    const asp = camera.aspect;
    const cz = camera.position.z;
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const a = (t + p.phase) % 1;
      const hh = TANH * (cz - p.z);
      const hw = hh * asp;
      const wob = Math.sin(a * Math.PI * 2 * p.wobK + p.rot0) * p.wob;
      const nx = p.nx + p.dx * a + wob;
      const ny = p.ny + p.dy * a + wob * 0.7;
      p.mesh.position.set(nx * hw, ny * hh, p.z);
      const sc = p.s0 * (1 + p.grow * a) * (hh / 1.82);
      p.mesh.scale.set(sc, sc, 1);
      const fall = sstep(cR, cR + 0.52, radial(nx, ny));
      const env = Math.pow(Math.sin(a * Math.PI), 1.1);
      p.mesh.material.opacity = env * p.peak * sM * fall;
      p.mesh.quaternion.copy(camera.quaternion);
      p.mesh.rotateZ(p.rot0 + p.rotV * a);
    }
  };

  const burst: Burst[] = [];
  for (let b = 0; b < 28; b++) {
    const bm: Plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: TEX[b % TEX.length],
        color: new THREE.Color().setHSL(0.424 + (Math.random() - 0.5) * 0.04, 0.26 + Math.random() * 0.16, 0.28 + Math.random() * 0.14),
        transparent: true,
        depthWrite: false,
        depthTest: true,
        opacity: 0,
      }),
    );
    bm.renderOrder = 7;
    bm.visible = false;
    smokeGroup.add(bm);
    burst.push({
      mesh: bm,
      x: (Math.random() * 2 - 1) * 1.0,
      y: (Math.random() * 2 - 1) * 0.82,
      z: (Math.random() * 2 - 1) * 0.25,
      dx: (Math.random() * 2 - 1) * 0.5,
      up: 0.5 + Math.random() * 1.0,
      s0: 0.35 + Math.random() * 0.55,
      grow: 1.2 + Math.random() * 1.8,
      rot: Math.random() * 6.2832,
      rv: (Math.random() - 0.5) * 1.4,
      peak: 0.2 + Math.random() * 0.25,
      d0: Math.random(),
    });
  }
  const updateBurst = (ex: number, tsec: number) => {
    for (let i = 0; i < burst.length; i++) {
      const b = burst[i];
      const k = clamp01((ex - 0.05 - b.d0 * 0.18) / 0.72);
      const env = k > 0 ? Math.sin(Math.PI * k) : 0;
      b.mesh.visible = env > 0.001;
      if (!b.mesh.visible) continue;
      b.mesh.position.set(b.x * (1 + k * 0.35) + b.dx * k, b.y + b.up * k, b.z);
      const sc = b.s0 * (1 + b.grow * k);
      b.mesh.scale.set(sc, sc, 1);
      b.mesh.quaternion.copy(camera.quaternion);
      b.mesh.rotateZ(b.rot + b.rv * k + tsec * 0.05 * (b.rv > 0 ? 1 : -1));
      b.mesh.material.opacity = env * b.peak;
    }
  };

  /* carte du monde */
  const MAP_Z = -3.4;
  const HS = 0.34;
  const RMAX = 0.26;
  const mapGroup = new THREE.Group();
  mapGroup.position.z = MAP_Z;
  scene.add(mapGroup);
  const raw = atob(MAP.data);
  const ND = (raw.length / 3) | 0;
  const aT = new Float32Array(ND * 2);
  const aC = new Float32Array(ND * 2);
  const aJ = new Float32Array(ND * 2);
  const aN = new Float32Array(ND * 3);
  const aS = new Float32Array(ND * 3);
  const mPos = new Float32Array(ND * 3);
  let mapSettled = 0;
  for (let q = 0; q < ND; q++) {
    const c = raw.charCodeAt(q * 3);
    const r = raw.charCodeAt(q * 3 + 1);
    const tn = raw.charCodeAt(q * 3 + 2) / 255;
    const u = MAP.U0 + (c + 0.5 * (r & 1)) * MAP.DU;
    const v = MAP.V0 - r * MAP.DV;
    aT[q * 2] = u;
    aT[q * 2 + 1] = v;
    mPos[q * 3] = u;
    mPos[q * 3 + 1] = v;
    const la = MAP.rowLat[r] * D2R;
    const lo = (MAP.rowA[r] * u + MAP.rowB[r]) * D2R;
    aS[q * 3] = Math.cos(la) * Math.cos(lo);
    aS[q * 3 + 1] = Math.cos(la) * Math.sin(lo);
    aS[q * 3 + 2] = Math.sin(la);
    let sx = u < 0 ? -1 : 1;
    let sy = v < 0 ? -1 : 1;
    if (Math.random() < 0.22) {
      if (Math.random() < 0.5) sx = -sx;
      else sy = -sy;
    }
    aC[q * 2] = sx;
    aC[q * 2 + 1] = sy;
    aJ[q * 2] = Math.random() * 2 - 1;
    aJ[q * 2 + 1] = Math.random() * 2 - 1;
    const dd = Math.min(1, Math.hypot(u - sx * 0.8, v - sy * 0.45) / 1.9);
    const delay = 0.25 + 1.25 * dd + Math.random() * 0.3;
    const dur = 1.25 + Math.random() * 0.55 + 0.25 * dd;
    aN[q * 3] = delay;
    aN[q * 3 + 1] = dur;
    aN[q * 3 + 2] = tn;
    if (delay + 0.7 * dur > mapSettled) mapSettled = delay + 0.7 * dur;
  }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute("position", new THREE.BufferAttribute(mPos, 3));
  mg.setAttribute("aTarget", new THREE.BufferAttribute(aT, 2));
  mg.setAttribute("aCorner", new THREE.BufferAttribute(aC, 2));
  mg.setAttribute("aJit", new THREE.BufferAttribute(aJ, 2));
  mg.setAttribute("aAnim", new THREE.BufferAttribute(aN, 3));
  mg.setAttribute("aSphere", new THREE.BufferAttribute(aS, 3));

  const mapU = {
    uIntro: { value: 0 },
    uCornerExt: { value: new THREE.Vector2(0.8, 0.45) },
    uSpacingPx: { value: 10 },
    uRmax: { value: RMAX },
    uBaseDist: { value: 8.7 },
    uCityA: { value: new THREE.Vector2(MAP.mtl[0], MAP.mtl[1]) },
    uCityB: { value: new THREE.Vector2(MAP.tnr[0], MAP.tnr[1]) },
    uPA: { value: -1 },
    uPB: { value: -1 },
    uBase: { value: 0.5 * (opts.mapIntensity != null ? opts.mapIntensity : CONFIG.map) },
    uNight: { value: CONFIG.night },
    uSun: { value: new THREE.Vector3(1, 0, 0) },
    uCursor: { value: new THREE.Vector2(9, 9) },
    uHover: { value: 0 },
    uTime: { value: 0 },
    uClick: { value: new THREE.Vector2(9, 9) },
    uClickT: { value: -1 },
    uVis: { value: 1 },
    uLo: { value: new THREE.Color(0x177e4f) },
    uHi: { value: new THREE.Color(0x30d98c) },
  };
  const MAP_VS = [
    "attribute vec2 aTarget; attribute vec2 aCorner; attribute vec2 aJit; attribute vec3 aAnim; attribute vec3 aSphere;",
    "uniform float uIntro,uSpacingPx,uRmax,uPA,uPB,uHover,uTime,uClickT,uBaseDist;",
    "uniform vec2 uCornerExt,uCityA,uCityB,uCursor,uClick;",
    "uniform vec3 uSun;",
    "varying float vA,vGlow,vTone,vFly,vDay;",
    "float wave(vec2 p,vec2 c,float tau,float rmax){",
    "  if(tau<0.0) return 0.0;",
    "  float d=distance(p,c);",
    "  float R=rmax*(1.0-pow(1.0-tau,3.0));",
    "  float sc=rmax/0.26;",
    "  float w=(0.012+0.030*tau)*sc;",
    "  float x=(d-R)/w;",
    "  float ring=exp(-x*x)*pow(1.0-tau,1.5);",
    "  float fl=exp(-d*d/(0.0025*sc*sc))*max(0.0,1.0-tau*5.0);",
    "  return ring*1.4+fl*1.6;",
    "}",
    "void main(){",
    "  float pr=clamp((uIntro-aAnim.x)/aAnim.y,0.0,1.0);",
    "  float e=1.0-pow(1.0-pr,3.0);",
    "  vec2 st=aCorner*uCornerExt*(1.0+abs(aJit)*0.35);",
    "  vec2 dir=normalize(aTarget-st+vec2(1e-5));",
    "  vec2 ctrl=mix(st,aTarget,0.5)+vec2(-dir.y,dir.x)*aJit.x*0.32;",
    "  float ie=1.0-e;",
    "  vec2 p=ie*ie*st+2.0*ie*e*ctrl+e*e*aTarget;",
    "  vDay=smoothstep(-0.309,0.052,dot(aSphere,uSun));",
    "  float dc=distance(aTarget,uCursor);",
    "  float lift=uHover*exp(-dc*dc/0.0027);",
    "  lift+=min(wave(aTarget,uClick,uClickT,0.13),1.6)*0.42;",
    "  float bob=0.5+0.5*sin(uTime*2.3+aJit.y*6.2832);",
    "  vec2 spread=(aTarget-uCursor)*lift*0.12*uHover;",
    "  vec3 pos=vec3(p+spread*e,lift*(0.60+0.28*bob)*e);",
    "  vGlow=wave(aTarget,uCityA,uPA,uRmax)+wave(aTarget,uCityB,uPB,uRmax);",
    "  vFly=1.0-smoothstep(0.7,1.0,pr);",
    "  vA=smoothstep(0.0,0.1,pr);",
    "  vTone=aAnim.z;",
    "  vec4 mv=modelViewMatrix*vec4(pos,1.0);",
    "  gl_Position=projectionMatrix*mv;",
    "  float persp=uBaseDist/max(-mv.z,0.001);",
    "  gl_PointSize=uSpacingPx*(0.36+0.16*vFly+0.30*min(vGlow,1.5))*persp;",
    "}",
  ].join("\n");
  const MAP_FS = [
    "precision highp float;",
    "varying float vA,vGlow,vTone,vFly,vDay;",
    "uniform float uBase,uNight,uVis; uniform vec3 uLo,uHi;",
    "void main(){",
    "  float m=1.0-smoothstep(0.16,0.5,length(gl_PointCoord-0.5));",
    "  float g=min(vGlow,2.0);",
    "  float dayk=mix(uNight,1.60,vDay);",
    "  float b=uBase*(0.80+0.34*vTone)*dayk+vFly*0.30+g*0.85;",
    "  vec3 col=mix(uLo,uHi,clamp(vFly*0.7+g*0.75,0.0,1.0));",
    "  gl_FragColor=vec4(col*b*uVis,m*vA);",
    "}",
  ].join("\n");
  const mapDots = new THREE.Points(
    mg,
    new THREE.ShaderMaterial({ uniforms: mapU, transparent: true, depthTest: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: MAP_VS, fragmentShader: MAP_FS }),
  );
  mapDots.frustumCulled = false;
  mapDots.renderOrder = -5;
  mapGroup.add(mapDots);

  const PULSE_FS = [
    "precision highp float; varying vec2 vUv;",
    "uniform float uTau,uFire,uBeacon,uHS,uRmax,uVis;",
    "void main(){",
    "  float q=length((vUv-0.5)*2.0);",
    "  float r=q*uHS;",
    "  float I=0.0;",
    "  if(uTau>=0.0){",
    "    float t=uTau;",
    "    float R=uRmax*(1.0-pow(1.0-t,3.0));",
    "    float w=0.012+0.030*t;",
    "    float x=(r-R)/w;",
    "    I+=exp(-x*x)*pow(1.0-t,1.6)*1.15;",
    "    float t2=clamp((t-0.12)/0.88,0.0,1.0);",
    "    float R2=uRmax*0.62*(1.0-pow(1.0-t2,3.0));",
    "    float x2=(r-R2)/(w*0.8);",
    "    I+=exp(-x2*x2)*pow(1.0-t2,2.0)*step(0.12,t)*0.5;",
    "    float fl=smoothstep(0.0,0.025,t)*exp(-t*7.0);",
    "    I+=exp(-r*r/0.0009)*fl*3.0;",
    "    I+=exp(-r*r/0.012)*fl*0.5;",
    "  }",
    "  I*=uFire;",
    "  float rb=r/max(uBeacon,0.001);",
    "  float bc=(exp(-rb*rb/0.00006)*1.2+exp(-rb*rb/0.0008)*0.22)*step(0.001,uBeacon);",
    "  I+=bc;",
    "  float hot=clamp(exp(-r*r/0.0009)*1.4*uFire+bc*0.5,0.0,1.0);",
    "  vec3 col=mix(vec3(0.188,0.851,0.549),vec3(0.86,1.0,0.94),hot);",
    "  float edge=1.0-smoothstep(0.85,1.0,q);",
    "  gl_FragColor=vec4(col*I*edge*uVis,1.0);",
    "}",
  ].join("\n");
  const pulseMesh = (city: [number, number]): PulseUniforms => {
    const u: PulseUniforms = { uTau: { value: -1 }, uFire: { value: 0 }, uBeacon: { value: 0 }, uHS: { value: HS }, uRmax: { value: RMAX }, uVis: { value: 1 } };
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: u,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
        fragmentShader: PULSE_FS,
      }),
    );
    m.position.set(city[0], city[1], 0.004);
    m.scale.set(HS, HS, 1);
    m.renderOrder = 25;
    m.frustumCulled = false;
    mapGroup.add(m);
    return u;
  };
  const pulseM = pulseMesh(MAP.mtl);
  const pulseA = pulseMesh(MAP.tnr);

  const PULSE_T0 = mapSettled + 1.0;
  let introT = opts.skipIntro ? mapSettled : 0;
  let pulsePh = 0;
  let fireA = -1;
  const easeOutBack = (x: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };
  const sunVec = (ms: number): [number, number, number] => {
    const n = ms / 86400000 + 2440587.5 - 2451545.0;
    const Lm = (280.46 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * D2R;
    const lam = (Lm + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * D2R;
    const eps = (23.439 - 0.0000004 * n) * D2R;
    const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
    const gmst = ((280.46061837 + 360.98564736629 * n) % 360) * D2R;
    const lon = ra - gmst;
    return [Math.cos(dec) * Math.cos(lon), Math.cos(dec) * Math.sin(lon), Math.sin(dec)];
  };

  const curT = new THREE.Vector2(9, 9);
  const cur = new THREE.Vector2(9, 9);
  let hoverT = 0;
  let hover = 0;
  let clickT = -1;
  let mapK = 1.38;
  const updateMap = (dt: number) => {
    const s = sunVec(Date.now());
    mapU.uSun.value.set(s[0], s[1], s[2]);
    mapU.uTime.value += dt;
    if (reduce) {
      mapU.uIntro.value = 1e4;
      mapU.uPA.value = -1;
      mapU.uPB.value = -1;
      pulseM.uTau.value = -1;
      pulseA.uTau.value = -1;
      pulseM.uFire.value = 0;
      pulseA.uFire.value = 0;
      pulseM.uBeacon.value = 1;
      pulseA.uBeacon.value = 1;
      mapU.uHover.value = 0;
      mapU.uClickT.value = -1;
      return;
    }
    if (hover < 0.02 && hoverT > 0) cur.copy(curT);
    const kk = 1 - Math.exp(-dt * 12);
    cur.x += (curT.x - cur.x) * kk;
    cur.y += (curT.y - cur.y) * kk;
    hover += (hoverT - hover) * (1 - Math.exp(-dt * 6));
    mapU.uCursor.value.copy(cur);
    mapU.uHover.value = hover;
    if (clickT >= 0) {
      clickT += dt / 1.4;
      if (clickT >= 1) clickT = -1;
    }
    mapU.uClickT.value = clickT;
    introT += dt;
    mapU.uIntro.value = introT;
    const period = CONFIG.loop / 3;
    if (introT >= PULSE_T0) pulsePh += dt / period;
    const tM = introT >= PULSE_T0 ? pulsePh % 1 : -1;
    const tA = pulsePh >= 0.5 ? (pulsePh - 0.5) % 1 : -1;
    if (tA >= 0 && fireA < 0) fireA = introT;
    mapU.uPA.value = tM;
    mapU.uPB.value = tA;
    pulseM.uTau.value = tM;
    pulseA.uTau.value = tA;
    pulseM.uFire.value = tM >= 0 ? 1 : 0;
    pulseA.uFire.value = tA >= 0 ? 1 : 0;
    const bM = clamp01((introT - PULSE_T0) / 0.7);
    const bA = fireA < 0 ? 0 : clamp01((introT - fireA) / 0.7);
    pulseM.uBeacon.value = bM > 0 ? easeOutBack(bM) : 0;
    pulseA.uBeacon.value = bA > 0 ? easeOutBack(bA) : 0;
  };

  /* post-traitement */
  const makeRT = (w: number, h: number, ms: boolean): THREE.WebGLRenderTarget => {
    const o: THREE.WebGLRenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: true,
      stencilBuffer: false,
    };
    if (ms && isGL2) {
      const rt = new THREE.WebGLMultisampleRenderTarget(w, h, o);
      rt.samples = 4;
      return rt;
    }
    return new THREE.WebGLRenderTarget(w, h, o);
  };
  const VS = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }";
  let post: Post | null = null;
  try {
    const pScene = new THREE.Scene();
    const quad = new THREE.Mesh<THREE.PlaneGeometry, THREE.Material>(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;
    pScene.add(quad);
    post = {
      scene: pScene,
      cam: new THREE.Camera(),
      quad,
      rtScene: makeRT(2, 2, true),
      rtBright: makeRT(2, 2, false),
      rtA: makeRT(2, 2, false),
      rtB: makeRT(2, 2, false),
      bright: new THREE.ShaderMaterial({
        uniforms: { tD: { value: null }, uT: { value: 0.82 }, uK: { value: 0.15 } },
        vertexShader: VS,
        fragmentShader: [
          "precision highp float; varying vec2 vUv; uniform sampler2D tD; uniform float uT,uK;",
          "void main(){ vec3 c=texture2D(tD,vUv).rgb; float l=dot(c,vec3(0.2126,0.7152,0.0722));",
          " gl_FragColor=vec4(c*smoothstep(uT,uT+uK,l),1.0); }",
        ].join("\n"),
      }),
      blur: new THREE.ShaderMaterial({
        uniforms: { tD: { value: null }, uDir: { value: new THREE.Vector2() } },
        vertexShader: VS,
        fragmentShader: [
          "precision highp float; varying vec2 vUv; uniform sampler2D tD; uniform vec2 uDir;",
          "void main(){ vec3 s=vec3(0.0);",
          " s+=texture2D(tD,vUv-uDir*4.0).rgb*0.0162; s+=texture2D(tD,vUv-uDir*3.0).rgb*0.0540;",
          " s+=texture2D(tD,vUv-uDir*2.0).rgb*0.1216; s+=texture2D(tD,vUv-uDir).rgb*0.1946;",
          " s+=texture2D(tD,vUv).rgb*0.2270;",
          " s+=texture2D(tD,vUv+uDir).rgb*0.1946; s+=texture2D(tD,vUv+uDir*2.0).rgb*0.1216;",
          " s+=texture2D(tD,vUv+uDir*3.0).rgb*0.0540; s+=texture2D(tD,vUv+uDir*4.0).rgb*0.0162;",
          " gl_FragColor=vec4(s,1.0); }",
        ].join("\n"),
      }),
      comp: new THREE.ShaderMaterial({
        uniforms: { tBase: { value: null }, tBloom: { value: null }, uBloom: { value: CONFIG.bloom }, uGrain: { value: 0.028 }, uTime: { value: 0 }, uVig: { value: 0.42 }, uFade: { value: 0 } },
        vertexShader: VS,
        fragmentShader: [
          "precision highp float; varying vec2 vUv;",
          "uniform sampler2D tBase,tBloom; uniform float uBloom,uGrain,uTime,uVig,uFade;",
          "float h12(vec2 p){ vec3 q=fract(vec3(p.xyx)*0.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }",
          "void main(){",
          " vec3 b=texture2D(tBase,vUv).rgb, g=texture2D(tBloom,vUv).rgb;",
          " vec3 c=b+g*uBloom;",
          " vec3 cc=clamp(c,0.0,1.0);",
          " c=mix(c,cc*cc*(3.0-2.0*cc),0.28);",
          " vec2 q=vUv-0.5; c*=clamp(1.0-dot(q,q)*uVig,0.0,1.0);",
          " c=mix(c,vec3(0.008,0.106,0.149),uFade);",
          " c+=(h12(gl_FragCoord.xy+uTime)-0.5)*uGrain;",
          " gl_FragColor=vec4(c,1.0); }",
        ].join("\n"),
      }),
    };
  } catch {
    post = null;
  }
  const pass = (m: THREE.Material, t: THREE.WebGLRenderTarget | null) => {
    if (!post) return;
    post.quad.material = m;
    renderer.setRenderTarget(t);
    renderer.render(post.scene, post.cam);
  };

  /* cadrage */
  let baseCamZ = 5.3;
  let exitE = 0;
  let H = 2;
  const fitMap = () => {
    const asp = camera.aspect;
    const cz = baseCamZ;
    const Lx = 1.1 / (TANH * cz * asp) + 0.05;
    const Ly = 0.92 / (TANH * cz) + 0.05;
    let k = 1.38;
    [MAP.mtl, MAP.tnr].forEach((c) => {
      const kx = Lx / Math.abs(c[0]);
      const ky = Ly / (Math.abs(c[1]) * asp);
      k = Math.max(k, Math.min(kx, ky));
    });
    k = Math.min(k, 2.4);
    mapK = k;
    const vh = TANH * (cz - MAP_Z);
    const vw = vh * asp;
    const half = k * vw;
    mapGroup.scale.set(half, half, 1);
    mapU.uCornerExt.value.set(1.12 / k, 1.12 / (k * asp));
    mapU.uSpacingPx.value = MAP.DU * half * (H * 0.5 / vh);
    mapU.uBaseDist.value = cz - MAP_Z;
  };
  const resize = () => {
    const w = host.clientWidth || window.innerWidth;
    const h = host.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    baseCamZ = Math.max(5.3, 1.1 / (0.36 * TANH * camera.aspect));
    camera.position.z = baseCamZ - 0.9 * exitE;
    renderer.setSize(w, h, false);
    // Hauteur visible à la profondeur du logo ; cible : centre du logo à 27 % du haut en
    // tablette, 14 % sur un téléphone très étroit (entre l'en-tête et les badges).
    const portrait = clamp01((1.15 - camera.aspect) / 0.4);
    const cible = 0.14 + 0.13 * clamp01((camera.aspect - 0.45) / 0.35);
    const haut = (0.5 - cible) * 2 * TANH * baseCamZ;
    logoY = LOGO_Y0 + (Math.max(LOGO_Y0, haut) - LOGO_Y0) * portrait;
    const W = Math.max(2, (w * DPR) | 0);
    H = Math.max(2, (h * DPR) | 0);
    if (post) {
      post.rtScene.setSize(W, H);
      post.rtBright.setSize(Math.max(2, W >> 1), Math.max(2, H >> 1));
      post.rtA.setSize(Math.max(2, W >> 2), Math.max(2, H >> 2));
      post.rtB.setSize(Math.max(2, W >> 2), Math.max(2, H >> 2));
    }
    fitMap();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  /* interaction */
  let drag = false;
  let lastX = 0;
  let spin = 0;
  let manual = 0;
  let tapX = 0;
  let tapY = 0;
  let tapTime = 0;
  const mapCursor = (e: PointerEvent) => {
    const rc = canvas.getBoundingClientRect();
    const nx = ((e.clientX - rc.left) / rc.width) * 2 - 1;
    const ny = -(((e.clientY - rc.top) / rc.height) * 2 - 1);
    curT.set(nx / mapK, ny / (mapK * camera.aspect));
  };
  const onDown = (e: PointerEvent) => {
    drag = true;
    lastX = e.clientX;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // capture refusée (pointeur déjà relâché) : le glisser marche quand même
    }
    mapCursor(e);
    hoverT = 1;
    tapX = e.clientX;
    tapY = e.clientY;
    tapTime = performance.now();
  };
  const onDragMove = (e: PointerEvent) => {
    if (!drag) return;
    const d = e.clientX - lastX;
    lastX = e.clientX;
    manual += d * 0.009;
    spin = d * 0.009;
  };
  const onUp = (e: PointerEvent) => {
    drag = false;
    if (Math.hypot(e.clientX - tapX, e.clientY - tapY) < 7 && performance.now() - tapTime < 400) {
      mapCursor(e);
      mapU.uClick.value.copy(curT);
      clickT = 0;
    }
  };
  const onCancel = () => {
    drag = false;
  };
  const onHover = (e: PointerEvent) => {
    mapCursor(e);
    hoverT = 1;
  };
  const onLeave = () => {
    hoverT = 0;
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onDragMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  pointerArea.addEventListener("pointermove", onHover);
  pointerArea.addEventListener("pointerleave", onLeave);

  /* boucle */
  const clock = new THREE.Clock();
  let t01 = 0;
  let raf = 0;
  let active = true;
  let shown = false;
  let disposed = false;
  const onVisibility = () => {
    if (!document.hidden) clock.getDelta();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.1);
    if (document.hidden) return;
    scrollS += reduce ? scrollT - scrollS : (scrollT - scrollS) * (1 - Math.exp(-dt * 9));
    if (Math.abs(scrollT - scrollS) < 1e-4) scrollS = scrollT;
    if (scrollS > 0.995 && shown) return;
    const ex = scrollS;
    exitE = ex * ex * (3 - 2 * ex);
    const exitVis = 1 - sstep(0, 0.5, ex);
    dissolveU.uDissolve.value = sstep(0.05, 0.75, ex) * 1.22;
    camera.position.z = baseCamZ - 0.9 * exitE;
    mapU.uVis.value = 1 - sstep(0, 0.6, ex);
    pulseM.uVis.value = exitVis;
    pulseA.uVis.value = exitVis;
    hazeU.uClear.value = CONFIG.clear * (1 - sstep(0, 0.6, ex));
    hazeU.uDensity.value = CONFIG.smoke * (1 + 0.5 * sstep(0, 0.5, ex));
    if (post) post.comp.uniforms.uFade.value = sstep(0.72, 1.0, ex);
    updateBurst(ex, mapU.uTime.value);
    t01 = reduce ? 0.22 : (t01 + dt / CONFIG.loop) % 1;
    if (!drag && !reduce) {
      manual += spin;
      spin *= 0.94;
    }
    const a = t01 * Math.PI * 2;
    logo.rotation.y = reduce ? -0.35 : a + Math.sin(a) * CONFIG.swing + manual;
    logo.rotation.x = Math.sin(a) * 0.05;
    logo.position.y = logoY + Math.sin(a * 2) * 0.03;
    sweep.position.set(Math.cos(a) * 3.5, 1.2 + Math.sin(a * 2) * 0.7, Math.sin(a) * 2.5 + 1.8);
    updateSmoke(t01);
    updateMap(dt);
    if (post) {
      renderer.setRenderTarget(post.rtScene);
      renderer.clear();
      renderer.render(scene, camera);
      post.bright.uniforms.tD.value = post.rtScene.texture;
      pass(post.bright, post.rtBright);
      const bw = post.rtA.width;
      const bh = post.rtA.height;
      let src = post.rtBright;
      for (let k = 0; k < 3; k++) {
        post.blur.uniforms.tD.value = src.texture;
        post.blur.uniforms.uDir.value.set((1 + k * 0.5) / bw, 0);
        pass(post.blur, post.rtA);
        post.blur.uniforms.tD.value = post.rtA.texture;
        post.blur.uniforms.uDir.value.set(0, (1 + k * 0.5) / bh);
        pass(post.blur, post.rtB);
        src = post.rtB;
      }
      post.comp.uniforms.tBase.value = post.rtScene.texture;
      post.comp.uniforms.tBloom.value = post.rtB.texture;
      post.comp.uniforms.uTime.value = (performance.now() % 10000) * 0.001;
      pass(post.comp, null);
    } else {
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }
    if (!shown) {
      shown = true;
      canvas.style.opacity = "1";
    }
  };
  raf = requestAnimationFrame(frame);

  return {
    setExit: (p) => {
      scrollT = clamp01(p);
    },
    setMap: (v) => {
      if (isFinite(v)) mapU.uBase.value = 0.5 * v;
    },
    setActive: (v) => {
      if (disposed || v === active) return;
      active = v;
      if (v) {
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onDragMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      pointerArea.removeEventListener("pointermove", onHover);
      pointerArea.removeEventListener("pointerleave", onLeave);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          const mat: THREE.Material | THREE.Material[] = obj.material;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
      TEX.forEach((t) => t.dispose());
      MM.rough.dispose();
      MM.norm.dispose();
      if (scene.environment) scene.environment.dispose();
      if (post) {
        [post.rtScene, post.rtBright, post.rtA, post.rtB].forEach((rt) => rt.dispose());
        post.bright.dispose();
        post.blur.dispose();
        post.comp.dispose();
        post.quad.geometry.dispose();
      }
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
