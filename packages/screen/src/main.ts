import { Fog, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { listen } from "./pointer";
import { WorkSwitcher } from "./WorkSwitcher";

listen();

const renderer = new WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#canvas")!,
});

const scene = new Scene();

scene.fog = new Fog(0x000000, 1, 500);

const camera = new PerspectiveCamera(60);
camera.position.set(0, 0, 0);

const workSwitcher = new WorkSwitcher();
scene.add(workSwitcher.root);

const tick = (timestamp: number) => {
  workSwitcher.update(timestamp);
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick(performance.now());

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && workSwitcher.workIndex === null) {
    workSwitcher.goNextWork();
    setInterval(() => {
      workSwitcher.goNextWork();
    }, 30 * 1000);
  }
});

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
