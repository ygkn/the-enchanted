import {
  AmbientLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  MathUtils,
  Points,
  PointsMaterial,
  BufferGeometry,
  BufferAttribute,
  Float32BufferAttribute,
  TextureLoader,
} from "three";
import { getWordPointerPosition } from "../pointer";
import { Work } from "./types";
import circleImage from "../images/texture-circle.png";

const texture = new TextureLoader().load(circleImage);

export class New extends Work {
  root: Group;
  dots: Points;
  dotsVelocities;

  constructor() {
    super();
    // Group生成
    this.root = new Group();

    // 光
    const light = new AmbientLight();
    this.root.add(light);

    /*
    const geometry_particle = new SphereGeometry(0.05, 32, 32);
    const material_particle = new MeshStandardMaterial({
      color: 0xbbbbbb,
    });

    this.spheres = [];
    */

    const width = 12;
    const row = 120;
    const column = row / 2;
    const space = width / row;

    /*
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num / 2; j++) {
        this.spheres.push(new Mesh(geometry_particle, material_particle));

        this.spheres[i * (num / 2) + j].position.x = i / 4 - num / 8;
        this.spheres[i * (num / 2) + j].position.y = j / 4 - num / 16;
        this.spheres[i * (num / 2) + j].position.z = -40;
        this.root.add(this.spheres[i * (num / 2) + j]);
      }
    }
    */

    const vertices: number[] = [];

    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
      for (let columnIndex = 0; columnIndex < column; columnIndex++) {
        vertices.push(
          width / 2 - space * rowIndex,
          width / 4 - space * columnIndex,
          -10
        );
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

    const material = new PointsMaterial({
      color: 0xbbbbbb,
      size: 0.08,
      map: texture,
    });

    const points = new Points(geometry, material);

    this.root.add(points);
  }

  update() {
    const pointerPosition = getWordPointerPosition(10);

    /*
    for (const sphere of this.spheres) {
      const distance = Math.sqrt(
        (pointerPosition.x - sphere.position.x) ** 2 +
          (pointerPosition.y - sphere.position.y) ** 2
      );

      const speed = 1 * (1 / distance);

      if (distance < 5) {
        if (pointerPosition.x > sphere.position.x) {
          sphere.position.x -= speed;
        } else {
          sphere.position.x += speed;
        }
        if (pointerPosition.y > sphere.position.y) {
          sphere.position.y -= speed;
        } else {
          sphere.position.y += speed;
        }
      }
    }
    */
  }

  dispose() {}
}
