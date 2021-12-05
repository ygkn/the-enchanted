import { Icosahedron } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, VFC } from "react";
import { Mesh } from "three";

export const Pointer: VFC = () => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    meshRef.current.position.x = window.deviceCoords.x;
    meshRef.current.position.y = window.deviceCoords.y;
  });
  return (
    <Icosahedron ref={meshRef} position={[0, 0, -10]}>
      <meshStandardMaterial color="#fff" wireframe />
    </Icosahedron>
  );
};
