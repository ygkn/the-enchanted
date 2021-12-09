import { Sparkle } from "./works/Sparkle";
import { Pointer } from "./works/Pointer";
import { Koki1 } from "./works/Koki1";
import { Work } from "./works/types";
import { Group, Object3D } from "three";
import { Fireworks } from "./works/Fireworks";

const Works = [Pointer, Sparkle, Koki1, Fireworks];

export class WorkSwitcher extends Work {
  root: Object3D;
  workIndex: number | null = null;
  shownWork: Work | null = null;

  handleKeydown: (event: KeyboardEvent) => void;

  constructor() {
    super();
    this.root = new Group();

    this.handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        this.goNextWork();
      }
    };

    document.addEventListener("keydown", this.handleKeydown);

    this.goNextWork();
  }

  goNextWork() {
    if (this.shownWork !== null) {
      this.root.remove(this.shownWork.root);
      this.shownWork.dispose();
    }

    if (this.workIndex === null) {
      this.workIndex = 0;
    } else {
      this.workIndex += 1;
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
    document.removeEventListener("keydown", this.handleKeydown);
  }
}
