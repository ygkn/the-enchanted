import {
  AmbientLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from "three";
import { getWordPointerPosition } from "../pointer";
import { Work } from "./types";

export class Pointer extends Work {
  root: Group;
  sphere: Mesh;

  constructor() {
    super();
    this.root = new Group();

    const light = new AmbientLight();
    this.root.add(light);

    const geometry = new SphereGeometry(1, 5, 5);

    const material = new MeshStandardMaterial({
      color: 0xffffff,
      wireframe: true,
    });

    this.sphere = new Mesh(geometry, material);
    this.sphere.position.z = -10;

    this.root.add(this.sphere);
  }

  update() {
    const pointerPosition = getWordPointerPosition(10);
    this.sphere.position.x = pointerPosition.x;
    this.sphere.position.y = pointerPosition.y;
  }

  dispose() {
    if (Array.isArray(this.sphere.material)) {
      for (const material of this.sphere.material) {
        material.dispose();
      }
    } else {
      this.sphere.material.dispose();
    }

    this.sphere.geometry.dispose();
  }
}
