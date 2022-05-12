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
import textureImage from "../images/texture-circle.png";
import { getWorldPointerPosition } from "../pointer";
import { Work } from "./types";

const texture = new TextureLoader().load(textureImage);
const height = 6;
const segment = height * 50;
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
  opacity: 0.4,
});

const whiteMaterial = baseMaterial.clone();
whiteMaterial.color.setHSL(0, 0, 1);

const redMaterial = baseMaterial.clone();
redMaterial.color.setHSL(0, 1, 0.5);

const yellowMaterial = baseMaterial.clone();
yellowMaterial.color.setHSL(1 / 6, 1, 0.5);

const greenMaterial = baseMaterial.clone();
greenMaterial.color.setHSL(2 / 6, 1, 0.5);

const materials = [whiteMaterial, redMaterial, yellowMaterial, greenMaterial];

export class XmasTree extends Work {
  root: Object3D;
  lastCreated: boolean;
  trees: Set<{
    z: number;
    objects: Object3D[];
  }>;

  constructor() {
    super();
    this.lastCreated = false;
    this.root = new Group();
    this.trees = new Set();

    for (const [x, y, z] of
         // prettier-ignore
        [
            [-8,   0, -10], [8,   0, -10],
            [-7.5, 0, -15], [7.5, 0, -15],
            [-7,   0, -20], [7,   0, -20],
            [-6.5, 0, -25], [6.5, 0, -25],
            [-6,   0, -30], [6  , 0, -30],
            [-5.5, 0, -35], [5.5, 0, -35],
        ]
    ) {
      this.addTree(new Vector3(x, y, z));
    }

    this.addSnowField();
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

  addSnowField() {
    for (let _ = 0; _ < 2000; _++) {
      const geometry = new BufferGeometry();
      const positions = [MathUtils.randFloat(-8, 8), -height / 2, MathUtils.randFloat(0, -40)];
      geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

      const material = new PointsMaterial({
        size: MathUtils.randFloat(0.05, 0.15),
        alphaMap: texture,
        map: texture,
        transparent: true,
        blending: AdditiveBlending,
        opacity: 0.4,
        color: [0xffffff, 0xaaaaff, 0xffff00][MathUtils.randInt(0, 2)],
      });

      this.root.add(new Points(geometry, material));
    }
  }

  update(timestamp: number) {
    if (getWorldPointerPosition(10).y > 4) {
      this.lastCreated = false;
    }
    if (getWorldPointerPosition(10).y < 0 && !this.lastCreated) {
      // TODO: opacity -> 0.9
      this.lastCreated = true;
    }
  }

  dispose() {}
}
