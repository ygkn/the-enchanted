import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Points,
  PointsMaterial,
  TextureLoader,
  Vector3,
} from "three";
import { getWordPointerPosition } from "../pointer";
import fireworksAlphaTextureImage from "../images/fireworks-alpha-texture.png";
import { Work } from "./types";

type PolarAngle = { theta: number; phi: number };

const starAngles: PolarAngle[] = [];

for (let theta = 0; theta < Math.PI; theta += Math.PI / 18) {
  for (let phi = 0; phi < Math.PI * 2; phi += (Math.PI * 2) / 18) {
    starAngles.push({
      theta,
      phi,
    });
  }
}

starAngles.push({
  theta: Math.PI,
  phi: Math.PI * 2,
});

const texture = new TextureLoader().load(fireworksAlphaTextureImage);

export class Fireworks extends Work {
  root: Group;

  fireWorks: Set<{
    startTimestamp: number;
    stars: Points;
    trails: Points;
    maxRadius: number;
    createdPosition: Vector3;
  }>;

  lastCreated: boolean;

  constructor() {
    super();
    this.root = new Group();

    const light = new AmbientLight();
    this.root.add(light);

    this.fireWorks = new Set();

    this.lastCreated = false;
  }

  addFirework(timestamp: number) {
    const soundeffect = new Audio("/audio/fireworksSE.mp3");
    soundeffect.play();

    const hue = MathUtils.randFloat(0, 1);

    const starGeometry = new BufferGeometry();
    const starMaterial = new PointsMaterial({
      blending: AdditiveBlending,
      color: new Color().setHSL(hue + 0.25 - Math.floor(hue + 0.25), 0.5, 0.8),
      size: 0.5,
      alphaMap: texture,
      map: texture,
      transparent: true,
      opacity: 0.5,
    });

    starGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(
        starAngles.flatMap(() => [0, 0, -10]),
        3
      )
    );

    const stars = new Points(starGeometry, starMaterial);

    const trailGeometry = new BufferGeometry();
    const trailMaterial = new PointsMaterial({
      blending: AdditiveBlending,
      color: new Color().setHSL(hue, 0.5, 0.5),
      size: 0.1,
      alphaMap: texture,
      map: texture,
      transparent: true,
      opacity: 0.5,
    });

    trailGeometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(starAngles.length * 3 * 100), 3)
    );

    const trails = new Points(trailGeometry, trailMaterial);

    this.fireWorks.add({
      startTimestamp: timestamp,
      stars,
      trails,
      maxRadius: MathUtils.randFloat(1, 2),
      createdPosition: new Vector3(
        MathUtils.randFloatSpread(10),
        MathUtils.randFloat(0, 5),
        -10
      ),
    });

    this.root.add(stars, trails);
  }

  update(timestamp: number) {
    if (getWordPointerPosition(10).y > 4 && !this.lastCreated) {
      this.addFirework(timestamp);

      this.lastCreated = true;
    }
    if (getWordPointerPosition(10).y < 0) {
      this.lastCreated = false;
    }

    const max = 2 * 1000;

    for (const firework of this.fireWorks) {
      const proceedRate = Math.max(
        0,
        Math.min(1, (timestamp - firework.startTimestamp) / max)
      );

      if (timestamp - firework.startTimestamp > max) {
        this.fireWorks.delete(firework);
        this.root.remove(firework.stars, firework.trails);
        firework.stars.geometry.dispose();
        firework.trails.geometry.dispose();

        if (Array.isArray(firework.stars.material)) {
          for (const material of firework.stars.material) {
            material.dispose();
          }
        } else {
          firework.stars.material.dispose();
        }

        if (Array.isArray(firework.trails.material)) {
          for (const material of firework.trails.material) {
            material.dispose();
          }
        } else {
          firework.trails.material.dispose();
        }
      }

      (firework.stars.geometry.attributes.position as BufferAttribute).set(
        getPointsPosition(
          firework.createdPosition,
          firework.maxRadius,
          proceedRate
        )
      );

      (firework.stars.material as PointsMaterial).size =
        Math.sin(proceedRate * Math.PI) / 5;

      firework.stars.geometry.attributes.position.needsUpdate = true;

      const trailPointsPosition: number[] = [];
      for (
        let trailProceedRate = proceedRate ** 2;
        trailProceedRate <= proceedRate;
        trailProceedRate += 1 / 100
      ) {
        trailPointsPosition.push(
          ...getPointsPosition(
            firework.createdPosition,
            firework.maxRadius,
            trailProceedRate
          )
        );
      }

      (firework.trails.geometry.attributes.position as BufferAttribute).set(
        trailPointsPosition
      );

      firework.trails.geometry.attributes.position.needsUpdate = true;
    }
  }

  dispose() {
    for (const firework of this.fireWorks) {
      firework.stars.geometry.dispose();
      firework.trails.geometry.dispose();

      if (Array.isArray(firework.stars.material)) {
        for (const material of firework.stars.material) {
          material.dispose();
        }
      } else {
        firework.stars.material.dispose();
      }

      if (Array.isArray(firework.trails.material)) {
        for (const material of firework.trails.material) {
          material.dispose();
        }
      } else {
        firework.trails.material.dispose();
      }
    }
  }
}

const getPointsPosition = (
  createdPosition: Vector3,
  maxRadius: number,
  proceedRate: number
) => {
  const radius = (1 - (1 - proceedRate) ** 2) * maxRadius;

  return starAngles.flatMap(({ theta, phi }) => [
    createdPosition.x + radius * Math.cos(theta) * Math.cos(phi),
    createdPosition.y +
      radius * Math.cos(theta) * Math.sin(phi) -
      proceedRate ** 2,
    createdPosition.z + radius * Math.sin(theta),
  ]);
};
