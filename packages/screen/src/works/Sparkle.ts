import {
  AmbientLight,
  Group,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  Vector2,
} from "three";
import { getWordPointerPosition } from "../pointer";
import sparkleImageUrl from "../images/sparkle.png";
import { Work } from "./types";

const map = new TextureLoader().load(sparkleImageUrl);
const material = new SpriteMaterial({ map });

export class Sparkle extends Work {
  root: Group;
  sparkles: Set<{
    createdPosition: Vector2;
    createdAt: number;
    sprite: Sprite;
  }>;
  soundEffect: HTMLAudioElement;

  nextCreationTime: number;
  lastPointerPosition: Vector2;

  constructor() {
    super();
    this.root = new Group();

    const light = new AmbientLight();
    this.root.add(light);

    this.sparkles = new Set();

    this.nextCreationTime = performance.now();
    this.lastPointerPosition = getWordPointerPosition(10);
    this.soundEffect = new Audio("/audio/sparkleSE.mp3");
  }

  update(timestamp: number) {
    const nowPointerPosition = getWordPointerPosition(10);
    if (
      nowPointerPosition.distanceTo(this.lastPointerPosition) > 0.2 &&
      this.soundEffect.paused
    ) {
      this.soundEffect.currentTime = 0;
      this.soundEffect.play();
    }

    if (
      this.nextCreationTime < timestamp &&
      nowPointerPosition.distanceTo(this.lastPointerPosition) > 0.1
    ) {
      const createdPosition = new Vector2();
      createdPosition.copy(nowPointerPosition);

      createdPosition.x += Math.random();
      createdPosition.y += Math.random();

      const sprite = new Sprite(material);
      sprite.position.set(createdPosition.x, createdPosition.y, -10);
      this.root.add(sprite);

      this.sparkles.add({
        createdAt: timestamp,
        createdPosition,
        sprite,
      });

      this.nextCreationTime = timestamp + 100 + Math.random() * 100;
      this.lastPointerPosition.copy(nowPointerPosition);
    }

    const max = 1000;

    for (const sparkle of this.sparkles) {
      const elapsed = (timestamp - sparkle.createdAt) / max;

      const scaleRate = Math.max(0, 1 - (elapsed * 2 - 1) ** 2) * 2;

      sparkle.sprite.scale.x = scaleRate;
      sparkle.sprite.scale.y = scaleRate;

      if (elapsed > 1) {
        this.root.remove(sparkle.sprite);
        this.sparkles.delete(sparkle);
      }
    }
  }

  dispose() {}
}
