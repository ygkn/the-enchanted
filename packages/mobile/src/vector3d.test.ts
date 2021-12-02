import { add, scalarTimes, subtract, Vector3d } from "./vector3d";

const a: Vector3d = {
  x: 2,
  y: 3,
  z: 5,
};

const b: Vector3d = {
  x: 7,
  y: 11,
  z: 19,
};

test("adds vector", () => {
  expect(add(a, b)).toEqual({ x: 9, y: 14, z: 24 });
});

test("subtract vector", () => {
  expect(subtract(a, b)).toEqual({ x: -5, y: -8, z: -14 });
});

test("scalarTimes vector", () => {
  expect(scalarTimes(a, 2)).toEqual({ x: 4, y: 6, z: 10 });
});
