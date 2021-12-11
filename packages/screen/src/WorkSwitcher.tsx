import { Sparkle } from "./works/Sparkle";
import { Koki1 } from "./works/Koki1";
import { Work } from "./works/types";
import { Rose } from "./works/Rose";
import { EscapingParticle } from "./works/EscapingParticle";
import { Group, Object3D } from "three";
import { Fireworks } from "./works/Fireworks";

const Works = [Sparkle, Koki1, Rose, EscapingParticle, Fireworks];

export class WorkSwitcher extends Work {
  root: Object3D;
  workIndex: number | null = null;
  shownWork: Work | null = null;

  constructor() {
    super();
    this.root = new Group();
  }

  goNextWork() {
    if (this.shownWork !== null) {
      this.root.remove(this.shownWork.root);
      this.shownWork.dispose();
    }

    if (this.workIndex === null) {
      this.workIndex = 0;
    } else {
      this.workIndex = (this.workIndex + 1) % Works.length;
    }

    const NewWork = Works[this.workIndex];

    this.shownWork = new NewWork();

    this.root.add(this.shownWork.root);
  }

  update(timestamp: number) {
    this.shownWork?.update(timestamp);
  }

  dispose() {
    this.shownWork?.dispose();
  }
}
