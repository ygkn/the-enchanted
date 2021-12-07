import type { Object3D } from "three";

export abstract class Work {
  constructor() {}
  /**
   * Root object of work.
   * This may be THREE.Group
   */
  abstract root: Object3D;
  /**
   * Called in each frame.
   */
  abstract update(timestamp: number): void;
  /**
   * Called after removed from parent.
   */
  abstract dispose(): void;
}
