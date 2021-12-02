export type Vector3d = {
  x: number;
  y: number;
  z: number;
};

type BinaryOperation<ReturnValue extends unknown = Vector3d> = (
  a: Vector3d,
  b: Vector3d
) => ReturnValue;

export const add: BinaryOperation = (a, b) => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

export const subtract: BinaryOperation = (a, b) => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

export const scalarTimes = (a: Vector3d, n: number) => ({
  x: a.x * n,
  y: a.y * n,
  z: a.z * n,
});
