import {
  AmbientLight,
  Group,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  Vector2,
} from "three";
import { getWordPointerPosition } from "../pointer";
import sparkleImageUrl from "../images/sparkle.png";
import { Work } from "./types";

export class Sparkle extends Work {
  root: Group;
  map: Texture;
  sparkles: {
    createdPosition: Vector2;
    createdAt: number;
    sprite: Sprite;
  }[];
  material: SpriteMaterial;
  soundEffect: HTMLAudioElement;

  nextCreationTime: number;
  lastPointerPosition: Vector2;

  constructor() {
    super();
    this.root = new Group();

    const light = new AmbientLight();
    this.root.add(light);

    this.map = new TextureLoader().load(sparkleImageUrl);
    this.material = new SpriteMaterial({ map: this.map });
    this.sparkles = [];

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

      const sprite = new Sprite(this.material);
      sprite.position.set(createdPosition.x, createdPosition.y, -10);
      this.root.add(sprite);

      this.sparkles.push({
        createdAt: timestamp,
        createdPosition,
        sprite,
      });

      this.nextCreationTime = timestamp + 100 + Math.random() * 100;
      this.lastPointerPosition.copy(nowPointerPosition);
    }

    for (const sparkle of this.sparkles) {
      const elapsed = (timestamp - sparkle.createdAt) / 500;

      const scaleRate = Math.max(0, 1 - (elapsed - 1) ** 2) * 2;

      sparkle.sprite.scale.x = scaleRate;
      sparkle.sprite.scale.y = scaleRate;
    }
  }

  dispose() {}
}
