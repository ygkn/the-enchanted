import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Points,
  PointsMaterial,
  Texture,
  TextureLoader,
  Vector2,
} from "three";
import { getWorldPointerPosition } from "../pointer";
import { Work } from "./types";
import texture from "../images/rose-texture.png";

export class Rose extends Work {
  root: Group;
  map: Texture;
  particles: Set<{
    createdPosition: Vector2;
    createdAt: number;
    mesh: Points;
  }>;
  geometry: BufferGeometry;

  nextCreationTime: number;
  lastPointerPosition: Vector2;
  constructor() {
    super();
    this.root = new Group();
    this.root.add(new AmbientLight(0xffffff, 1));
    this.map = new TextureLoader().load(texture);
    //パーティクルの数
    const numofmeshes = 1000;
    //r=1+cos{(7/8)θ}
    const dot = (Math.PI * 16) / numofmeshes;
    const vertices = [];
    for (let i = 0; i < numofmeshes; i++) {
      const x = 5 * (1 + Math.cos((7 / 8) * dot * i)) * Math.cos(dot * i);
      const y = 5 * (1 + Math.cos((7 / 8) * dot * i)) * Math.sin(dot * i);
      vertices.push(x, y, -30);
    }
    this.geometry = new BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new Float32BufferAttribute(vertices, 3)
    );

    this.nextCreationTime = performance.now();
    this.lastPointerPosition = getWorldPointerPosition(30);
    this.particles = new Set();
  }

  update(timestamp: number) {
    const nowPointerPosition = getWorldPointerPosition(30);

    if (
      this.nextCreationTime < timestamp &&
      nowPointerPosition.distanceTo(this.lastPointerPosition) > 0.1
    ) {
      const createdPosition = new Vector2();
      createdPosition.copy(nowPointerPosition);

      createdPosition.x += Math.random();
      createdPosition.y += Math.random();

      const material = new PointsMaterial({
        size: 1,
        color: new Color().setHSL((timestamp % 2000) / 2000, 1, 0.5),
        alphaMap: this.map,
        transparent: true,
        opacity: 0.6,
        blending: AdditiveBlending,
      });
      const rose = new Points(this.geometry, material);
      rose.position.set(createdPosition.x, createdPosition.y, -50);
      this.root.add(rose);
      const soundeffect = new Audio("/audio/roseSE.mp3");
      soundeffect.play();
      this.particles.add({
        createdAt: timestamp,
        createdPosition,
        mesh: rose,
      });

      this.nextCreationTime = timestamp + 100 + Math.random() * 500;
      this.lastPointerPosition.copy(nowPointerPosition);
    }

    for (const particle of this.particles) {
      const elapsed = (timestamp - particle.createdAt) / 500;

      const scaleRate = Math.max(0, 1 - (elapsed - 1) ** 2) * 2;

      particle.mesh.scale.x = scaleRate;
      particle.mesh.scale.y = scaleRate;
      if (timestamp - particle.createdAt >= 1000) {
        this.root.remove(particle.mesh);
        this.particles.delete(particle);

        if (Array.isArray(particle.mesh.material)) {
          for (const material of particle.mesh.material) {
            material.dispose();
          }
        } else {
          particle.mesh.material.dispose();
        }
      }
    }
  }

  dispose() {
    for (const particle of this.particles) {
      this.root.remove(particle.mesh);
      this.particles.delete(particle);

      if (Array.isArray(particle.mesh.material)) {
        for (const material of particle.mesh.material) {
          material.dispose();
        }
      } else {
        particle.mesh.material.dispose();
      }
    }
  }
}
