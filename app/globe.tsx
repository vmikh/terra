'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  surfaceAt,
  surfaceFrames,
  yearAtSurfacePosition,
} from './planet-model';
import { moonAt } from './moon-model';
import { TextureCache } from './texture-cache';
import { lightsAt } from './night-lights';
import { NOW, MAX } from './epochs';

type Props = {
  year?: number;
  clouds?: boolean;
  rotate?: boolean;
  zoom?: number;
  reset?: number;
  jump?: number;
  lang?: string;
  climate?: boolean;
  warming?: number;
};
type Pair = { map: THREE.Texture; field: THREE.Texture };
const vertex = `varying vec2 surfaceUv; void main(){surfaceUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const surfaceFragment = `
precision highp float;
varying vec2 surfaceUv;
uniform sampler2D mapA,mapB,fieldA,fieldB,motion,lava;
uniform float fraction,modernA,modernB,hasMotion,dry,ice,heat,barren;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 uv=surfaceUv;
 vec2 ua=uv,ub=uv;
 // Back-trace both surfaces along their registered displacement, then combine
 // aligned terrain. Geometry moves instead of crossfading two coastlines.
 for(int j=0;j<3;j++){
   vec2 forward=(texture2D(motion,ua).rg*255.-128.)/127.*vec2(.25,-.25);
   vec2 backward=(texture2D(motion,ub).ba*255.-128.)/127.*vec2(.25,-.25);
   ua=vec2(fract(uv.x-forward.x*fraction*hasMotion),clamp(uv.y-forward.y*fraction*hasMotion,0.,1.));
   ub=vec2(fract(uv.x-backward.x*(1.-fraction)*hasMotion),clamp(uv.y-backward.y*(1.-fraction)*hasMotion,0.,1.));
 }
 vec3 a=texture2D(mapA,ua).rgb,b=texture2D(mapB,ub).rgb;
 vec3 fa=texture2D(fieldA,ua).rgb,fb=texture2D(fieldB,ub).rgb;
 vec3 f=mix(fa,fb,fraction);
 float n=noise(uv*vec2(360.,180.))*.55+noise(uv*vec2(1000.,500.))*.30+noise(uv*vec2(75.,37.5))*.15;
 float land=smoothstep(.496,.504,f.r+dry*.60);
 vec3 fallback=mix(vec3(.18,.13,.07),vec3(.018,.048,.022),f.b)*(.7+n*.65);
 vec3 ga=mix(fallback,a,smoothstep(.496,.51,fa.r));
 vec3 gb=mix(fallback,b,smoothstep(.496,.51,fb.r));
 vec3 ground=mix(ga,gb,fraction);
 ground=mix(ground,vec3(.20,.135,.072)*(.7+n*.6),barren*.72);
 ground=mix(ground,vec3(.28,.17,.075)*(.62+n*.8),dry*.9);
 float shore=smoothstep(.39,.502,f.r+dry*.6);
 vec3 ocean=mix(vec3(.002,.006,.014),vec3(.008,.035,.052),shore);
 vec3 result=mix(ocean,ground,land);
 float modern=modernA*(1.-fraction)+modernB*fraction;
 result=mix(result,mix(a,b,fraction),modern*(1.-dry)*pow(abs(fraction*2.-1.),12.));
 float polar=abs(uv.y-.5)*2.;
 float frozen=ice*smoothstep(.15,.9,polar*.8+n*.35);
 result=mix(result,vec3(.61,.70,.77)*(.82+n*.25),frozen);
 vec3 rock=texture2D(lava,uv*vec2(4.,2.)).rgb;
 result=mix(result,rock*vec3(1.,.62,.28),heat);
 gl_FragColor=vec4(result,1.);
}`;

export default function Globe({
  year = NOW,
  clouds = true,
  rotate = true,
  zoom = 0,
  reset = 0,
  lang = 'ru',
  climate = false,
  warming = 0,
  jump = 0,
}: Props) {
  const host = useRef<HTMLDivElement>(null),
    settings = useRef({ year, clouds, rotate, climate, warming }),
    lastZoom = useRef(0);
  useEffect(() => {
    settings.current = { year, clouds, rotate, climate, warming };
  }, [year, clouds, rotate, climate, warming]);
  const api = useRef<{
    update: (year: number, immediate?: boolean) => void;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    globe: THREE.Mesh;
  } | null>(null);
  const lastJump = useRef(jump);
  const retryTextures = useRef<() => void>(() => {});
  const [preload, setPreload] = useState({ done: 0, total: 0, failed: false });
  const [error, setError] = useState(false),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!host.current) return;
    const el = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      // WebGL initialization can fail only after mounting its native renderer.
      // oxlint-disable-next-line react/react-compiler
      setError(true);
      setLoading(false);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    let disposed = false,
      generation = 0,
      frame = 0,
      previousTime = 0,
      ready = false,
      pending = false;
    let displayedPosition = surfaceAt(settings.current.year).position;
    let desiredPosition = displayedPosition;
    let travelSpeed = 1;
    let target = surfaceAt(settings.current.year);
    const visual = {
      heat: target.heat,
      dry: target.dry,
      electric: target.electric,
      ancient: target.ancient,
      ice: target.ice,
    };
    const scene = new THREE.Scene(),
      camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 7.5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 4.5;
    controls.maxDistance = 10;
    controls.autoRotateSpeed = 0.25;
    controls.rotateSpeed = 0.5;
    const loader = new THREE.TextureLoader();
    const owned = new Set<THREE.Texture>();
    const blank: THREE.Texture = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1,
    );
    blank.needsUpdate = true;
    owned.add(blank);
    const surfaceTarget = new THREE.WebGLRenderTarget(
      Math.min(4096, renderer.capabilities.maxTextureSize),
      Math.min(4096, renderer.capabilities.maxTextureSize) / 2,
      {
        depthBuffer: false,
        stencilBuffer: false,
      },
    );
    const uniforms = {
      mapA: { value: blank },
      mapB: { value: blank },
      fieldA: { value: blank },
      fieldB: { value: blank },
      motion: { value: blank },
      hasMotion: { value: 0 },
      lava: { value: blank },
      fraction: { value: 0 },
      modernA: { value: 1 },
      modernB: { value: 1 },

      dry: { value: 0 },
      ice: { value: 0 },
      heat: { value: 0 },
      barren: { value: 0 },
    };
    const surfaceMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: surfaceFragment,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), surfaceMaterial),
      surfaceScene = new THREE.Scene(),
      surfaceCamera = new THREE.Camera();
    surfaceScene.add(quad);
    const renderSurface = () => {
      const old = renderer.getRenderTarget();
      renderer.setRenderTarget(surfaceTarget);
      renderer.render(surfaceScene, surfaceCamera);
      renderer.setRenderTarget(old);
    };
    const material = new THREE.MeshPhongMaterial({
      map: surfaceTarget.texture,
      color: 0xffffff,
      shininess: 12,
      specular: 0x203044,
    });
    const lightUniforms = {
      nightMap: { value: blank },
      electricity: { value: 0 },
      cityStrength: { value: new THREE.Vector3() },
      sunDirection: { value: new THREE.Vector3(-5, 3, 5).normalize() },
      heatGlow: { value: 0 },
      historicalYear: { value: NOW },
    };
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, lightUniforms);
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 terraNormal; varying vec2 terraUv;',
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nterraNormal=normalize(mat3(modelMatrix)*normal);terraUv=uv;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
    varying vec3 terraNormal; varying vec2 terraUv;
    uniform sampler2D nightMap;
    uniform float electricity,heatGlow,historicalYear;
    uniform vec3 cityStrength;
    uniform vec3 sunDirection;
    float settlement(vec2 uv,vec2 p){vec2 d=uv-p;d.x=min(abs(d.x),1.-abs(d.x));d*=vec2(2.,1.);return exp(-dot(d,d)*250000.);}
   `,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
    float night=1.-smoothstep(-.15,.12,dot(normalize(terraNormal),sunDirection));
    vec3 city=texture2D(nightMap,terraUv).rgb;
    city=vec3(1.,.77,.42)*city.r*smoothstep(.015,.12,city.r);
    float historic=settlement(terraUv,vec2(0.49970833,0.78620556))*cityStrength[0]+settlement(terraUv,vec2(0.29443056,0.72615000))*cityStrength[1]+settlement(terraUv,vec2(0.88826111,0.69824444))*cityStrength[2];
    totalEmissiveRadiance+=night*(city*electricity*2.8+vec3(1.,.55,.20)*historic*.32);
    totalEmissiveRadiance+=diffuseColor.rgb*vec3(1.4,.42,.055)*heatGlow;
   `,
        );
    };
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.88, 96, 64),
      material,
    );
    globe.rotation.y = -1.6;
    scene.add(globe);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });
    const cloud = new THREE.Mesh(
      new THREE.SphereGeometry(1.9, 80, 48),
      cloudMaterial,
    );
    globe.add(cloud);
    const haloMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { glowColor: { value: new THREE.Color('#438deb') } },
      vertexShader:
        'varying vec3 vNormal;varying vec3 vPosition;void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',
      fragmentShader:
        'varying vec3 vNormal;varying vec3 vPosition;uniform vec3 glowColor;void main(){float f=pow(1.-abs(dot(normalize(vNormal),normalize(-vPosition))),3.5);gl_FragColor=vec4(glowColor,f*.65);}',
    });
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.96, 80, 48),
      haloMaterial,
    );
    scene.add(halo);
    scene.add(new THREE.AmbientLight(0x7189b3, 0.8));
    const sun = new THREE.DirectionalLight(0xffecd9, 3.1);
    sun.position.set(-5, 3, 5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x326ac5, 0.35);
    fill.position.set(4, -2, -3);
    scene.add(fill);
    const manifest = [
      ...new Set([
        '/textures/hq/modern.jpg',
        '/textures/surface/modern-field.png',
        '/textures/hq/proto.jpg',
        '/textures/surface/proto-field.png',
        '/textures/lava.jpg',
        '/textures/clouds.png',
        '/textures/hq/night-2016.jpg',
        '/textures/hq/modern-height.jpg',
        '/textures/hq/relief.jpg',
        '/textures/hq/moon.jpg',
        ...surfaceFrames.flatMap((f) => [
          `/textures/hq/${f.key}.jpg`,
          `/textures/surface/${f.key}-field.png`,
        ]),
        ...surfaceFrames
          .slice(0, -1)
          .flatMap((f, i) =>
            f.key === surfaceFrames[i + 1].key
              ? []
              : [`/textures/motion/${f.key}_${surfaceFrames[i + 1].key}.png`],
          ),
      ]),
    ];
    const assets = new TextureCache(manifest, (done, total, failed) =>
      setPreload({ done, total, failed }),
    );
    retryTextures.current = () => {
      void assets.preload();
    };
    const moonUniforms = {
      lunarMolten: { value: 0 },
      lunarCraters: { value: 1 },
      lunarMaria: { value: 1 },
      lunarHeat: { value: 0 },
    };
    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0xb8b5af,
      shininess: 2,
      specular: 0x080808,
      transparent: true,
    });
    moonMaterial.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, moonUniforms);
      shader.fragmentShader =
        `
        uniform float lunarMolten, lunarCraters, lunarMaria, lunarHeat;
        float lunarHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
        float lunarHash3(vec3 p) { return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453); }
        float lunarNoise(vec3 p) {
          vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(mix(lunarHash3(i),lunarHash3(i+vec3(1,0,0)),f.x),
            mix(lunarHash3(i+vec3(0,1,0)),lunarHash3(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(lunarHash3(i+vec3(0,0,1)),lunarHash3(i+vec3(1,0,1)),f.x),
            mix(lunarHash3(i+vec3(0,1,1)),lunarHash3(i+vec3(1,1,1)),f.x),f.y),f.z);
        }
        float lunarFbm(vec3 p) {
          return lunarNoise(p)*.53+lunarNoise(p*2.03)*.27+lunarNoise(p*4.09)*.13+lunarNoise(p*8.21)*.07;
        }
      ` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <map_fragment>',
          `
        #include <map_fragment>
        vec3 lunarEmission=vec3(0.);
        #ifdef USE_MAP
          // Spherical noise avoids a longitude seam and polar texture pinching.
          float longitude=vMapUv.x*6.2831853, latitude=vMapUv.y*3.14159265;
          vec3 point=vec3(sin(latitude)*cos(longitude),cos(latitude),sin(latitude)*sin(longitude));
          float broad=lunarFbm(point*6.);
          float detail=lunarFbm(point*95.);
          vec3 warped=point*17.+vec3(broad*4.,lunarFbm(point*9.)*3.,detail);
          float plates=lunarFbm(warped);
          float fissures=1.-smoothstep(.018,.075,abs(plates-.5));
          float pools=smoothstep(.49,.66,broad);
          float grain=lunarNoise(point*360.);
          vec2 grid=vMapUv*vec2(100.,50.);
          float crater=0.;
          for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++) {
            vec2 cell=floor(grid)+vec2(float(x),float(y));
            vec2 centre=cell+vec2(lunarHash(cell),lunarHash(cell+19.));
            float d=length(grid-centre), r=.08+lunarHash(cell+41.)*.24;
            crater+=(smoothstep(r*.8,r,d)-smoothstep(r,r*1.25,d))*.13;
            crater-=(1.-smoothstep(r*.3,r*.9,d))*.12;
          }
          vec3 ancient=vec3(.23,.22,.21)*(.55+broad*.8+detail*.4+grain*.1)+crater*lunarCraters;
          // Old fractured crust remains detailed before the mapped maria exist.
          ancient*=1.-fissures*.22;
          vec3 cooled=mix(ancient,diffuseColor.rgb,lunarMaria);
          float melt=max(lunarMolten,smoothstep(.72,1.,lunarHeat));
          float hot=(fissures*.65+pools*.8)*melt;
          vec3 crust=vec3(.07,.045,.028)*(.4+detail*1.5+grain*.2);
          diffuseColor.rgb=mix(cooled,crust,melt*.88);
          // Spatially varying emission preserves dark crust even on the night side.
          lunarEmission=mix(vec3(1.,.055,.002),vec3(1.,.48,.06),pools)*hot*1.35;
          lunarEmission+=cooled*vec3(.8,.15,.025)*lunarHeat*.3;
        #endif
      `,
        )
        .replace(
          '#include <emissivemap_fragment>',
          `
        #include <emissivemap_fragment>
        totalEmissiveRadiance=lunarEmission;
      `,
        );
    };
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(1.88 * 0.2727, 64, 48),
      moonMaterial,
    );
    moon.rotation.y = -1.6;
    moon.visible = false;
    scene.add(moon);
    let moonReady = false;
    const load = async (path: string, color = true) => {
      const url = await assets.get(path);
      if (disposed) throw new Error('disposed');
      return new Promise<THREE.Texture>((resolve, reject) =>
        loader.load(
          url,
          (t) => {
            if (disposed) {
              t.dispose();
              reject(new Error('disposed'));
              return;
            }
            t.wrapS = THREE.RepeatWrapping;
            if (color) t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = renderer.capabilities.getMaxAnisotropy();
            owned.add(t);
            resolve(t);
          },
          undefined,
          reject,
        ),
      );
    };
    const cache = new Map<string, Promise<Pair>>();
    const loaded = new Map<string, Pair>();
    let activeKeys: string[] = [];
    const pair = (key: string) => {
      if (cache.has(key)) {
        const p = cache.get(key)!;
        cache.delete(key);
        cache.set(key, p);
        return p;
      }
      const promise = Promise.all([
        load(`/textures/hq/${key}.jpg`),
        load(`/textures/surface/${key}-field.png`, false),
      ])
        .then(([map, field]) => {
          const value = { map, field };
          loaded.set(key, value);
          return value;
        })
        .catch((e) => {
          cache.delete(key);
          throw e;
        });
      cache.set(key, promise);
      return promise;
    };
    const evict = () => {
      for (const key of cache.keys()) {
        if (cache.size <= 4) break;
        if (key === 'proto' || activeKeys.includes(key) || !loaded.has(key))
          continue;
        const p = loaded.get(key)!;
        p.map.dispose();
        p.field.dispose();
        owned.delete(p.map);
        owned.delete(p.field);
        cache.delete(key);
        loaded.delete(key);
      }
    };
    let lavaReady: Promise<void> | undefined;
    const getLava = () =>
      (lavaReady ??= load('/textures/lava.jpg')
        .then((t) => {
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          uniforms.lava.value = t;
        })
        .catch((error) => {
          lavaReady = undefined;
          throw error;
        }));
    const motions = new Map<string, THREE.Texture>();
    const getMotion = async (a: string, b: string) => {
      if (a === b) return blank;
      const key = `${a}_${b}`;
      if (motions.has(key)) return motions.get(key)!;
      const t = await load(`/textures/motion/${key}.png`, false);
      motions.set(key, t);
      // Motion fields are small; only a few neighbouring pairs need GPU memory.
      for (const [k, old] of motions) {
        if (motions.size <= 6) break;
        if (k !== key) {
          old.dispose();
          owned.delete(old);
          motions.delete(k);
        }
      }
      return t;
    };
    let terrainRelief: THREE.Texture | null = null;
    let modernRelief: THREE.Texture | null = null;
    let backgroundStarted = false;
    const startBackground = () => {
      if (disposed || backgroundStarted) return;
      backgroundStarted = true;
      void assets.preload();
      load('/textures/hq/moon.jpg')
        .then((texture) => {
          moonMaterial.map = texture;
          moonMaterial.bumpMap = texture;
          moonMaterial.bumpScale = 0.008;
          moonMaterial.needsUpdate = true;
          moonReady = true;
        })
        .catch(() => {});
      // Keep the tour's first surface decoded and uploaded for immediate playback.
      void Promise.all([pair('proto'), getLava()])
        .then(([first]) => {
          if (disposed) return;
          renderer.initTexture(first.map);
          renderer.initTexture(first.field);
          renderer.initTexture(uniforms.lava.value);
        })
        .catch(() => {});
      load('/textures/clouds.png')
        .then((t) => {
          cloudMaterial.map = t;
          cloudMaterial.needsUpdate = true;
        })
        .catch(() => {});
      load('/textures/hq/night-2016.jpg')
        .then((t) => {
          lightUniforms.nightMap.value = t;
        })
        .catch(() => {});
      load('/textures/hq/modern-height.jpg', false)
        .then((t) => {
          modernRelief = t;
          if (target.modern > 0.999999) {
            material.bumpMap = t;
            material.bumpScale = 0.025;
            material.needsUpdate = true;
          }
        })
        .catch(() => {});
      load('/textures/hq/relief.jpg', false)
        .then((t) => {
          terrainRelief = t;
          if (target.modern < 0.999999) {
            material.bumpMap = t;
            material.bumpScale = 0.012;
            material.needsUpdate = true;
          }
        })
        .catch(() => {});
    };
    const setSurface = async (position: number, immediate = false) => {
      pending = true;
      const id = generation;
      const next = surfaceAt(yearAtSurfacePosition(position));
      try {
        const [a, b, flow] = await Promise.all([
          pair(next.from.key),
          pair(next.to.key),
          getMotion(next.from.key, next.to.key),
          next.heat > 0 ? getLava() : Promise.resolve(),
        ]);
        if (disposed || id !== generation) return;
        displayedPosition = position;
        target = next;
        if (immediate)
          Object.assign(visual, {
            heat: next.heat,
            dry: next.dry,
            electric: next.electric,
            ancient: next.ancient,
            ice: next.ice,
          });
        activeKeys = [next.from.key, next.to.key];
        uniforms.mapA.value = a.map;
        uniforms.mapB.value = b.map;
        uniforms.fieldA.value = a.field;
        uniforms.fieldB.value = b.field;
        uniforms.motion.value = flow;
        uniforms.hasMotion.value = next.from.key === next.to.key ? 0 : 1;
        uniforms.fraction.value = next.mix;
        uniforms.modernA.value = next.from.key === 'modern' ? 1 : 0;
        uniforms.modernB.value = next.to.key === 'modern' ? 1 : 0;
        uniforms.dry.value = next.dry;
        uniforms.ice.value = next.ice;
        uniforms.heat.value = next.heat;
        uniforms.barren.value = next.barren;
        renderSurface();
        // Direct 8K source for modern Earth: no 4K offscreen bottleneck.
        const exactModern =
          next.modern > 0.999999 &&
          next.heat === 0 &&
          next.dry === 0 &&
          next.ice === 0;
        const previousMap = material.map;
        const previousBump = material.bumpMap;
        material.map = exactModern
          ? next.from.key === 'modern'
            ? a.map
            : b.map
          : surfaceTarget.texture;
        material.bumpMap =
          exactModern && modernRelief ? modernRelief : terrainRelief;
        material.bumpScale = exactModern ? 0.025 : 0.012;
        if (previousMap !== material.map || previousBump !== material.bumpMap)
          material.needsUpdate = true;
        ready = true;
        setLoading(false);
        setError(false);
        evict();
        requestAnimationFrame(startBackground);
      } catch {
        if (!disposed && id === generation) {
          setError(true);
          setLoading(false);
        }
      } finally {
        if (id === generation) pending = false;
      }
    };
    const update = (y: number, immediate = false) => {
      desiredPosition = surfaceAt(y).position;
      travelSpeed = Math.max(
        0.6,
        Math.abs(desiredPosition - displayedPosition) / 2.4,
      );
      if (immediate) {
        generation++;
        void setSurface(desiredPosition, true);
        return;
      }
      if (!ready && !pending) void setSurface(desiredPosition);
    };
    api.current = { update, camera, controls, globe };
    update(settings.current.year);
    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const cool = new THREE.Color('#438deb'),
      warm = new THREE.Color('#ef7836'),
      neutral = new THREE.Color('#ffffff'),
      tint = new THREE.Color();
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;
      const s = settings.current;
      if (
        ready &&
        !pending &&
        Math.abs(desiredPosition - displayedPosition) > 0.000000001
      ) {
        const delta = desiredPosition - displayedPosition;
        const step = Math.min(Math.abs(delta), travelSpeed * dt, 0.6);
        void setSurface(displayedPosition + Math.sign(delta) * step);
      }
      const ease = 1 - Math.exp(-dt * 5);
      for (const key of ['heat', 'dry', 'electric', 'ancient', 'ice'] as const)
        visual[key] += (target[key] - visual[key]) * ease;
      controls.autoRotate = s.rotate;
      controls.update(dt);
      cloud.visible = s.clouds && !s.climate;
      cloudMaterial.opacity = 0.38 * (1 - visual.heat) * (1 - visual.dry * 0.8);
      lightUniforms.historicalYear.value = target.year;
      // Use the selected date immediately: rewinding must not leave future lights.
      const lights = lightsAt(s.year);
      const lightingGeography = target.modern > 0.999999 ? 1 : 0;
      lightUniforms.electricity.value = lights.modern * lightingGeography;
      lightUniforms.cityStrength.value.set(
        ...(lights.cities.map((v) => v * lightingGeography) as [
          number,
          number,
          number,
        ]),
      );
      const lunar = moonAt(s.year);
      moon.visible = moonReady && lunar.visible;
      moon.scale.setScalar(lunar.formation);
      moon.position.set(lunar.separation * 0.84, lunar.separation * 0.49, -0.8);
      moonUniforms.lunarMolten.value = lunar.molten;
      moonUniforms.lunarCraters.value = lunar.craters;
      moonUniforms.lunarMaria.value = lunar.maria;
      moonMaterial.bumpScale = 0.008 * lunar.maria;
      moonUniforms.lunarHeat.value = lunar.solarHeat;
      moonMaterial.opacity = lunar.endVisibility;
      globe.visible = ready && s.year < MAX;
      halo.visible = s.year < MAX;
      cloud.visible = cloud.visible && s.year < MAX;
      lightUniforms.heatGlow.value = visual.heat * 0.85;
      haloMaterial.uniforms.glowColor.value.copy(cool).lerp(warm, visual.heat);
      tint.copy(neutral);
      if (s.warming > 0)
        tint.lerp(new THREE.Color('#efc5a0'), Math.min(s.warming / 10, 0.4));
      if (s.climate)
        tint.lerp(new THREE.Color(s.warming > 2 ? '#ffa560' : '#9ecce2'), 0.5);
      material.color.lerp(tint, ease);
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);
    const lost = (e: Event) => {
      e.preventDefault();
      setError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      disposed = true;
      assets.dispose();
      retryTextures.current = () => {};
      generation++;
      api.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      owned.forEach((t) => t.dispose());
      surfaceTarget.dispose();
      surfaceMaterial.dispose();
      quad.geometry.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (o.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      renderer.domElement.remove();
    };
  }, []);
  useEffect(() => {
    const immediate = lastJump.current !== jump;
    lastJump.current = jump;
    api.current?.update(year, immediate);
  }, [year, jump]);
  useEffect(() => {
    const a = api.current;
    if (!a) return;
    a.camera.position.multiplyScalar(Math.pow(0.85, zoom - lastZoom.current));
    lastZoom.current = zoom;
    a.controls.update();
  }, [zoom]);
  useEffect(() => {
    const a = api.current;
    if (!a) return;
    a.camera.position.set(0, 0.1, 7.5);
    a.globe.rotation.set(0, -1.6, 0);
    a.controls.target.set(0, 0, 0);
    a.controls.update();
  }, [reset]);
  return (
    <>
      <div
        className="globe"
        ref={host}
        // A canvas-backed interactive scene has no equivalent native image element.
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
        role="img"
        aria-label={
          lang === 'ru'
            ? 'Интерактивная 3D-модель Земли'
            : 'Interactive 3D Earth'
        }
      >
        {year >= MAX && (
          <div className="globe-status engulfed">
            {lang === 'ru'
              ? 'Земля поглощена Солнцем'
              : 'Earth engulfed by the Sun'}
            <small>
              {lang === 'ru'
                ? 'Один из сценариев далёкого будущего'
                : 'One possible far-future outcome'}
            </small>
          </div>
        )}
        {year < MAX && (loading || error) && (
          <div className="globe-status">
            {error
              ? lang === 'ru'
                ? 'Не удалось загрузить поверхность. Сохранён предыдущий вид.'
                : 'Could not load the surface. The previous view is retained.'
              : lang === 'ru'
                ? 'Загружаем поверхность…'
                : 'Loading the surface…'}
          </div>
        )}
      </div>
      {preload.total > 0 && preload.done < preload.total && (
        <div className="texture-preload">
          <div className="texture-preload-label">
            <span>{lang === 'ru' ? 'Загружаем эпохи' : 'Loading eras'}</span>
            <span>{Math.floor((preload.done / preload.total) * 100)}%</span>
          </div>
          <progress
            value={preload.done}
            max={preload.total}
            aria-label={lang === 'ru' ? 'Загрузка текстур' : 'Texture loading'}
          />
          <p>
            {preload.failed
              ? lang === 'ru'
                ? 'Не все текстуры загрузились.'
                : 'Some textures could not be loaded.'
              : lang === 'ru'
                ? 'Для плавного путешествия дождитесь окончания загрузки.'
                : 'For a smooth journey, please wait for loading to finish.'}
          </p>
          {preload.failed && (
            <button type="button" className="btn btn-link" onClick={() => retryTextures.current()}>
              {lang === 'ru' ? 'Повторить' : 'Retry'}
            </button>
          )}
        </div>
      )}
    </>
  );
}
