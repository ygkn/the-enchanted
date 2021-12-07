import {
  AmbientLight,
  BoxGeometry,
  ConeGeometry,
  DirectionalLight,
  Group,
  Material,
  Mesh,
  MeshLambertMaterial,
  SphereGeometry,
  TorusGeometry,
} from "three";
import { getWordPointerPosition } from "../pointer";
import { Work } from "./types";

const geometries = [
  new TorusGeometry(1, 0.5, 16, 100),
  new SphereGeometry(),
  new ConeGeometry(0.75, 2, 16, 50),
  new BoxGeometry(),
];

export class Koki1 extends Work {
  root: Group;
  spheres: Mesh[];
  geometry: TorusGeometry;
  material: Material;

  constructor() {
    super();
    this.root = new Group();
    this.root.add(new AmbientLight(0xffffff, 0.5));
    const light = new DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    this.root.add(light);
    this.material = new MeshLambertMaterial({
      color: 0x9841f0,
    });
    this.geometry = new TorusGeometry(1, 0.5, 16, 100);
    this.spheres = [];
    for (let i = 0; i < 18; i++) {
      this.spheres.push(
        new Mesh(
          geometries[Math.floor(Math.random() * geometries.length)],
          this.material
        )
      );
      this.spheres[i].position.x = 5 * ((i % 6) - 2.5);
      this.spheres[i].position.y = 5 * (Math.floor(i / 6) - 1);
      this.spheres[i].position.z = -10;
      this.root.add(this.spheres[i]);
    }
  }

  update() {
    const pointerPosition = getWordPointerPosition(10);
    for (const sphere of this.spheres) {
      const distance = Math.sqrt(
        (pointerPosition.x - sphere.position.x) ** 2 +
          (pointerPosition.y - sphere.position.y) ** 2
      );
      const scaleRate = Math.max(1, 2 - distance / 8);
      sphere.scale.x = scaleRate;
      sphere.scale.y = scaleRate;
      sphere.scale.z = scaleRate;

      sphere.rotation.x = sphere.rotation.y =
        (Math.max(0, 8 - Math.abs(distance)) / 8) * 2 * Math.PI;
    }
  }

  dispose() {}
}
