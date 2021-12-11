import {
  AmbientLight,
  BoxGeometry,
  ConeGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  PointLight,
  SphereGeometry,
  TorusGeometry,
  Vector2,
} from "three";
import { getWorldPointerPosition } from "../pointer";
import { Work } from "./types";

const geometries = [
  new TorusGeometry(0.5, 0.25, 16, 100),
  new SphereGeometry(0.5),
  new ConeGeometry(0.3, 1, 16, 50),
  new BoxGeometry(0.5, 0.5, 0.5),
];

const material = new MeshLambertMaterial({
  color: 0x9841f0,
});

export class Koki1 extends Work {
  root: Group;
  meshes: Mesh[];
  pointer: PointLight;
  soundEffect: HTMLAudioElement;
  lastPointerPosition: Vector2;

  constructor() {
    super();
    this.root = new Group();
    this.root.add(new AmbientLight(0xffffff, 0.3));
    const light = new DirectionalLight(0xffffff, 1.0);
    light.castShadow = true;
    this.root.add(light);
    this.meshes = [];

    //球の数,行数,列
    const numofmeshes = 28;
    const numofline = 4;
    const numofcolumn = Math.floor(numofmeshes / numofline);

    for (let i = 0; i < numofmeshes; i++) {
      this.meshes.push(
        new Mesh(
          geometries[Math.floor(Math.random() * geometries.length)],
          material
        )
      );
      this.meshes[i].position.x =
        5 * ((i % numofcolumn) - (numofcolumn - 1) / 2);
      this.meshes[i].position.y =
        4 * (Math.floor(i / numofcolumn) - numofline / 2 + 0.5);
      this.meshes[i].position.z = -17;
      this.root.add(this.meshes[i]);
    }
    //ポインター
    this.pointer = new PointLight(0xea9198, 2, 10, 1.0);
    this.pointer.position.z = -5;
    this.root.add(this.pointer);

    this.soundEffect = new Audio("/audio/Koki1.mp3");

    this.lastPointerPosition = getWorldPointerPosition(17);
  }

  update() {
    const pointerPosition = getWorldPointerPosition(17);

    if (
      pointerPosition.distanceTo(this.lastPointerPosition) > 0.2 &&
      this.soundEffect.paused
    ) {
      this.soundEffect.currentTime = 0;
      this.soundEffect.play();
    }

    this.lastPointerPosition = pointerPosition;

    this.pointer.position.x = pointerPosition.x;
    this.pointer.position.y = pointerPosition.y;
    for (const meshe of this.meshes) {
      const distance = Math.sqrt(
        (pointerPosition.x - meshe.position.x) ** 2 +
          (pointerPosition.y - meshe.position.y) ** 2
      );
      const scaleRate = Math.max(1, 4 - distance / 2);
      meshe.scale.x = scaleRate;
      meshe.scale.y = scaleRate;
      meshe.scale.z = scaleRate;

      meshe.rotation.x = meshe.rotation.y =
        (Math.max(0, 8 - Math.abs(distance)) / 8) * 2 * Math.PI;
    }
  }

  dispose() {}
}
