import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Object3D,
  Points,
  PointsMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { Work } from "./types";
import textureImage from "../images/texture-circle.png";

const texture = new TextureLoader().load(textureImage);
const height = 6;
const segment = height * 10;
const maxR = height / 3;

const generateVertices = (position: Vector3) =>
  Array.from({ length: segment }, () => Math.random() * height).flatMap((y) => {
    const r = maxR - (maxR / height) * y;
    const theta = 1.5 * Math.PI * y;
    return [
      position.x + r * Math.cos(theta) + MathUtils.randFloatSpread(0.05),
      position.y + y - height / 2 + MathUtils.randFloatSpread(0.05),
      position.z + r * Math.sin(theta) + MathUtils.randFloatSpread(0.05),
      position.x + r * Math.cos(theta + Math.PI) + MathUtils.randFloatSpread(0.05),
      position.y + y - height / 2 + MathUtils.randFloatSpread(0.05),
      position.z + r * Math.sin(theta + Math.PI) + MathUtils.randFloatSpread(0.05),
    ];
  });

const baseMaterial = new PointsMaterial({
  size: 0.05,
  alphaMap: texture,
  map: texture,
  transparent: true,
  blending: AdditiveBlending,
  opacity: 0.8,
});

const redMaterial = baseMaterial.clone();
redMaterial.color.setHSL(0, 1, 0.5);

const yellowMaterial = baseMaterial.clone();
yellowMaterial.color.setHSL(1 / 6, 1, 0.5);

const greenMaterial = baseMaterial.clone();
greenMaterial.color.setHSL(2 / 6, 1, 0.5);

const materials = [redMaterial, yellowMaterial, greenMaterial];

export class XmasTree extends Work {
  root: Object3D;

  trees: Set<{
    z: number;
    objects: Object3D[];
  }>;

  constructor() {
    super();
    this.root = new Group();
    this.trees = new Set();

    this.addTree(new Vector3(0, 0, -10));
    this.addTree(new Vector3(0, 0, -10));
    this.addTree(new Vector3(0, 0, -10));
    this.addTree(new Vector3(0, 0, -10));
  }

  addTree(rootPosition: Vector3) {
    const objects = materials.map((material) => {
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new Float32BufferAttribute(generateVertices(rootPosition), 3));

      return new Points(geometry, material);
    });

    this.root.add(...objects);
    this.trees.add({ z: rootPosition.z, objects });
  }

  update() {}

  dispose() {}
}
