'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export default function Globe({
  texture = '/textures/earth.jpg',
  mode = 'modern',
  clouds = true,
  rotate = true,
  zoom = 0,
  reset = 0,
  lang = 'ru',
  climate = false,
  warming = 0,
}: {
  texture?: string;
  mode?: string;
  clouds?: boolean;
  rotate?: boolean;
  zoom?: number;
  reset?: number;
  lang?: string;
  climate?: boolean;
  warming?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const lastZoom = useRef(0);
  const api = useRef<{
    material: THREE.MeshPhongMaterial;
    cloud: THREE.Mesh;
    ice: THREE.Mesh;
    controls: OrbitControls;
    camera: THREE.PerspectiveCamera;
    globe: THREE.Mesh;
    halo: THREE.Mesh;
    loader: THREE.TextureLoader;
    generation: number;
    texture?: THREE.Texture;
  } | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!host.current) return;
    const el = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);
    let disposed = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.1, 7.5);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 4.5;
    controls.maxDistance = 10;
    controls.autoRotateSpeed = 0.25;
    controls.rotateSpeed = 0.5;
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 12,
      specular: 0x203044,
    });
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1.88, 96, 64),
      material,
    );
    globe.rotation.y = -1.6;
    scene.add(globe);
    const ice = new THREE.Mesh(
      new THREE.SphereGeometry(1.888, 80, 48),
      new THREE.MeshPhongMaterial({
        color: 0xdeedf4,
        transparent: true,
        opacity: 0.9,
        shininess: 8,
      }),
    );
    ice.visible = false;
    globe.add(ice);
    const loader = new THREE.TextureLoader();
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
    loader.load('/textures/clouds.png', (t) => {
      if (disposed) {
        t.dispose();
        return;
      }
      cloudMaterial.map = t;
      cloudMaterial.needsUpdate = true;
    });
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.96, 80, 48),
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { glowColor: { value: new THREE.Color('#438deb') } },
        vertexShader:
          'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal); vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',
        fragmentShader:
          'varying vec3 vNormal; varying vec3 vPosition;uniform vec3 glowColor; void main(){float f=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.5);gl_FragColor=vec4(glowColor,f*.65);}',
      }),
    );
    scene.add(halo);
    scene.add(new THREE.AmbientLight(0x7189b3, 0.8));
    const sun = new THREE.DirectionalLight(0xffecd9, 3.1);
    sun.position.set(-5, 3, 5);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x326ac5, 0.35);
    fill.position.set(4, -2, -3);
    scene.add(fill);
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    api.current = {
      material,
      cloud,
      ice,
      controls,
      camera,
      globe,
      halo,
      loader,
      generation: 0,
    };
    let frame = 0;
    let previous = 0;
    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      controls.update(Math.min((time - previous) / 1000, 0.1));
      previous = time;
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
      api.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const m = o.material as THREE.Material;
          m.dispose();
          if ('map' in m) (m.map as THREE.Texture)?.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      renderer.domElement.remove();
    };
  }, []);
  useEffect(() => {
    const a = api.current;
    if (!a) return;
    setLoading(true);
    const generation = ++a.generation;
    const accept = (t: THREE.Texture) => {
      if (api.current !== a || generation !== a.generation) {
        t.dispose();
        return;
      }
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      a.texture?.dispose();
      a.texture = t;
      a.material.map = t;
      a.material.needsUpdate = true;
      setLoading(false);
      setError(false);
    };
    if (texture.startsWith('solid:')) {
      const t = new THREE.DataTexture(
        new Uint8Array([255, 255, 255, 255]),
        1,
        1,
      );
      t.needsUpdate = true;
      accept(t);
    } else
      a.loader.load(texture, accept, undefined, () => {
        if (generation === a.generation) {
          setError(true);
          setLoading(false);
        }
      });
  }, [texture]);
  useEffect(() => {
    const a = api.current;
    if (!a) return;
    a.cloud.visible = clouds && mode === 'modern' && !climate;
    a.controls.autoRotate = rotate;
    const base =
      mode === 'hot' || mode === 'destroyed'
        ? '#ffb080'
        : mode === 'ice'
          ? '#cde9f5'
          : mode === 'ocean'
            ? '#245b83'
            : mode === 'barren'
              ? '#9f7b50'
              : '#ffffff';
    a.material.color.set(base);
    if (mode === 'modern' && warming > 0)
      a.material.color.lerp(
        new THREE.Color('#efc5a0'),
        Math.min(warming / 10, 0.4),
      );
    if (climate)
      a.material.color.lerp(
        new THREE.Color(warming > 2 ? '#ffa560' : '#9ecce2'),
        0.5,
      );
    a.globe.visible = mode !== 'destroyed';
    a.ice.visible = mode === 'ice';
    a.material.emissive.set(mode === 'hot' ? '#b32d05' : '#000000');
    a.material.emissiveIntensity = mode === 'hot' ? 0.45 : 0;
    a.halo.visible = mode !== 'destroyed';
    (a.halo.material as THREE.ShaderMaterial).uniforms.glowColor.value.set(
      mode === 'hot' ? '#e57434' : '#438deb',
    );
  }, [clouds, rotate, mode, climate, warming]);
  useEffect(() => {
    const a = api.current;
    if (a) {
      a.camera.position.multiplyScalar(Math.pow(0.85, zoom - lastZoom.current));
      lastZoom.current = zoom;
      a.controls.update();
    }
  }, [zoom]);
  useEffect(() => {
    const a = api.current;
    if (a) {
      a.camera.position.set(0, 0.1, 7.5);
      a.globe.rotation.set(0, -1.6, 0);
      a.controls.target.set(0, 0, 0);
      a.controls.update();
    }
  }, [reset]);
  return (
    <div
      className="globe"
      ref={host}
      role="img"
      aria-label={
        lang === 'ru' ? 'Интерактивная 3D-модель Земли' : 'Interactive 3D Earth'
      }
    >
      {mode === 'destroyed' && (
        <div className="final-earth">
          <span>∅</span>
          <p>
            {lang === 'ru'
              ? 'Земля поглощена Солнцем'
              : 'Earth engulfed by the Sun'}
          </p>
          <small>
            {lang === 'ru'
              ? 'Сценарий завершения · точный исход неизвестен'
              : 'End scenario · the exact outcome is uncertain'}
          </small>
        </div>
      )}
      {(loading || error) && (
        <div className="globe-status">
          {error
            ? lang === 'ru'
              ? 'Не удалось показать 3D. Проверьте WebGL и соединение.'
              : '3D unavailable. Check WebGL and your connection.'
            : lang === 'ru'
              ? 'Загружаем поверхность…'
              : 'Loading the surface…'}
        </div>
      )}
    </div>
  );
}
