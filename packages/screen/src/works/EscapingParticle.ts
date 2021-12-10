import {
  AmbientLight,
  Group,
  Points,
  PointsMaterial,
  BufferGeometry,
  Float32BufferAttribute,
  TextureLoader,
  Vector2,
} from "three";
import { getWordPointerPosition } from "../pointer";
import { Work } from "./types";
import circleImage from "../images/texture-circle.png";

const texture = new TextureLoader().load(circleImage);

const material = new PointsMaterial({
  color: 0xbbbbbb,
  size: 0.05,
  map: texture,
});

const width = 15;
const row = 270;
const column = row / 2;
const space = width / row;

export class EscapingParticle extends Work {
  root: Group;
  dots: Points;
  dotsPositions: {
    current: Vector2;
    created: Vector2;
  }[];

  constructor() {
    super();
    this.root = new Group();

    const light = new AmbientLight();
    this.root.add(light);

    this.dotsPositions = [];
    const vertices: number[] = [];

    for (let rowIndex = 0; rowIndex < row; rowIndex++) {
      for (let columnIndex = 0; columnIndex < column; columnIndex++) {
        vertices.push(
          width / 2 - space * rowIndex,
          width / 4 - space * columnIndex,
          -10
        );

        this.dotsPositions.push({
          current: new Vector2(
            width / 2 - space * rowIndex,
            width / 4 - space * columnIndex
          ),
          created: new Vector2(
            width / 2 - space * rowIndex,
            width / 4 - space * columnIndex
          ),
        });
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));

    this.dots = new Points(geometry, material);

    this.root.add(this.dots);
  }

  update() {
    const pointerPosition = getWordPointerPosition(10);

    const positions = this.dots.geometry.attributes.position.array;

    for (let index = 0; index < this.dotsPositions.length; index++) {
      const dotPosition = this.dotsPositions[index];
      const distanceToPointer = pointerPosition.distanceTo(dotPosition.current);

      if (distanceToPointer < 1) {
        const toTargetNormalized = new Vector2()
          .copy(dotPosition.current)
          .sub(pointerPosition)
          .normalize();

        const target = new Vector2()
          .copy(toTargetNormalized)
          .add(pointerPosition);

        dotPosition.current.add(
          new Vector2()
            .copy(toTargetNormalized)
            .multiplyScalar(target.distanceTo(dotPosition.current) ** 2)
        );

        (positions as number[])[index * 3] = dotPosition.current.x;
        (positions as number[])[index * 3 + 1] = dotPosition.current.y;
        (positions as number[])[index * 3 + 2] = -10;
      } else {
        const target = dotPosition.created;

        dotPosition.current.add(
          new Vector2()
            .copy(target)
            .sub(dotPosition.current)
            .normalize()
            .multiplyScalar(target.distanceTo(dotPosition.current) ** 2)
        );

        (positions as number[])[index * 3] = dotPosition.current.x;
        (positions as number[])[index * 3 + 1] = dotPosition.current.y;
        (positions as number[])[index * 3 + 2] = -10;
      }
    }

    this.dots.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.dots.geometry.dispose();
  }
}
