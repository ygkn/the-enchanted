import { Vector2 } from "three";

export const getWordPointerPosition = (
  mouse: Vector2,
  depth: number
): Vector2 => {
  const position = new Vector2();
  position.copy(window.isDebug ? mouse : window.deviceCoords);

  position.x *= depth;
  position.y *= depth;

  return position;
};
