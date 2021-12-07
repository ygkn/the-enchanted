import { AmbientLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { listen } from "./pointer";
import { WorkSwitcher } from "./WorkSwitcher";

if (typeof window.isDebug === "undefined") {
  window.isDebug = false;
}

listen();

const renderer = new WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#canvas")!,
});

const scene = new Scene();

const camera = new PerspectiveCamera(90);
camera.position.set(0, 0, 0);

const workSwitcher = new WorkSwitcher();
scene.add(workSwitcher.root);

const light = new AmbientLight();
scene.add(light);

const tick = (timestamp: number) => {
  workSwitcher.update(timestamp);
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick(performance.now());

const onResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};

onResize();

window.addEventListener("resize", onResize, { passive: true });
